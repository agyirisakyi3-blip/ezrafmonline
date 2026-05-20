import { auth } from "./auth";

const requestStore = new Map<string, number[]>();

const CLEANUP_INTERVAL = 60_000;
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of requestStore) {
      const recent = timestamps.filter((t) => now - t < CLEANUP_INTERVAL);
      if (recent.length === 0) requestStore.delete(key);
      else requestStore.set(key, recent);
    }
  }, CLEANUP_INTERVAL);
}

export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
): Promise<boolean> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const now = Date.now();
      const windowKey = Math.floor(now / windowMs);
      const redisKey = `ratelimit:${key}:${windowKey}`;
      const res = await fetch(`${upstashUrl}/incr/${redisKey}`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
      });
      const data = await res.json() as { result: number };
      if (data.result === 1) {
        await fetch(`${upstashUrl}/expire/${redisKey}/${Math.ceil(windowMs / 1000)}`, {
          headers: { Authorization: `Bearer ${upstashToken}` },
        });
      }
      return data.result <= maxAttempts;
    } catch {
      // fall through to in-memory
    }
  }

  const now = Date.now();
  const timestamps = requestStore.get(key) ?? [];
  const recent = timestamps.filter((t) => now - t < windowMs);
  if (recent.length >= maxAttempts) return false;
  recent.push(now);
  requestStore.set(key, recent);
  return true;
}

export function validateOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin) return false;
  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/on\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript\s*:/gi, "");
}

export function sanitizePlain(input: string): string {
  return input
    .replace(/[<>&"']/g, (ch) => {
      switch (ch) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "&": return "&amp;";
        case '"': return "&quot;";
        case "'": return "&#x27;";
        default: return ch;
      }
    });
}

const MAGIC_BYTES: Record<string, Uint8Array[]> = {
  "image/jpeg": [new Uint8Array([0xff, 0xd8, 0xff])],
  "image/png": [new Uint8Array([0x89, 0x50, 0x4e, 0x47])],
  "image/webp": [new Uint8Array([0x52, 0x49, 0x46, 0x46])],
  "image/gif": [new Uint8Array([0x47, 0x49, 0x46, 0x38])],
};

export function validateFileMagic(buffer: Uint8Array, mimeType: string): boolean {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return false;
  return signatures.some((sig) =>
    sig.every((byte, i) => buffer[i] === byte),
  );
}

const BODY_SIZE_LIMIT = 5 * 1024 * 1024;

export async function parseJsonBody<T>(
  req: Request,
): Promise<{ data?: T; error?: { error: string; status: number } }> {
  const cl = req.headers.get("content-length");
  if (cl && parseInt(cl, 10) > BODY_SIZE_LIMIT) {
    return { error: { error: "Request body too large", status: 413 } };
  }
  try {
    const text = await req.text();
    if (text.length > BODY_SIZE_LIMIT) {
      return { error: { error: "Request body too large", status: 413 } };
    }
    return { data: JSON.parse(text) as T };
  } catch {
    return { error: { error: "Invalid JSON", status: 400 } };
  }
}

export async function requireAdmin(
  role?: string,
): Promise<{ session: any; error?: never } | { error: { error: string; status: number }; session?: never }> {
  const session = await auth();
  if (!session?.user) {
    return { error: { error: "Unauthorized", status: 401 } };
  }
  if (role && (session.user as any).role !== role) {
    return { error: { error: "Forbidden: insufficient permissions", status: 403 } };
  }
  return { session };
}

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
