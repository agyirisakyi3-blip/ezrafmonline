import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/security";

function detectDevice(ua: string | null): string {
  if (!ua) return "desktop";
  const lower = ua.toLowerCase();
  if (/(tablet|ipad|playbook|silk|android(?!.*mobile))/i.test(lower)) return "tablet";
  if (/(mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop)/i.test(lower)) return "mobile";
  return "desktop";
}

function detectSource(referer: string | null): string {
  if (!referer) return "direct";
  const lower = referer.toLowerCase();
  if (lower.includes("google")) return "google";
  if (lower.includes("facebook") || lower.includes("fb.com") || lower.includes("fb.me")) return "facebook";
  if (lower.includes("x.com") || lower.includes("twitter")) return "twitter";
  return "other";
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "track";
  if (!checkRateLimit(`track:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { slug } = await req.json();
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const device = detectDevice(req.headers.get("user-agent"));
  const source = detectSource(req.headers.get("referer"));

  const [articleResult] = await Promise.all([
    prisma.article.updateMany({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    }),
    prisma.$executeRawUnsafe(
      `INSERT INTO "DailyView" (id, date, path, count) VALUES (gen_random_uuid(), $1, $2, 1)
       ON CONFLICT (date, path) DO UPDATE SET count = "DailyView".count + 1`,
      today, slug,
    ),
    prisma.$executeRawUnsafe(
      `INSERT INTO "DailyTraffic" (id, date, device, source, count) VALUES (gen_random_uuid(), $1, $2, $3, 1)
       ON CONFLICT (date, device, source) DO UPDATE SET count = "DailyTraffic".count + 1`,
      today, device, source,
    ),
  ]);

  const response = NextResponse.json({ ok: true });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
