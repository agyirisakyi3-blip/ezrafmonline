import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { checkRateLimit, parseJsonBody } from "@/lib/security";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.REVALIDATION_SECRET;

  if (!secret) {
    return new Response("Server misconfiguration", { status: 500 });
  }

  if (authHeader !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "revalidate";
  if (!checkRateLimit(`revalidate:${ip}`, 10, 60_000)) {
    return new Response("Too many requests", { status: 429 });
  }

  const parsed = await parseJsonBody<{ path?: string }>(req);
  if (parsed.error) {
    return Response.json(parsed.error, { status: parsed.error.status });
  }

  const path = parsed.data?.path;
  if (path) {
    revalidatePath(path);
  } else {
    revalidatePath("/");
    revalidatePath("/articles");
  }

  return Response.json({ revalidated: true });
}
