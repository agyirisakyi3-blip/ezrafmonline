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
  if (!checkRateLimit(`track:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { slug } = await req.json();
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const device = detectDevice(req.headers.get("user-agent"));
  const source = detectSource(req.headers.get("referer"));

  await Promise.all([
    prisma.article.updateMany({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    }),
    prisma.dailyView.upsert({
      where: { date_path: { date: today, path: slug } },
      create: { date: today, path: slug, count: 1 },
      update: { count: { increment: 1 } },
    }),
    prisma.dailyTraffic.upsert({
      where: { date_device_source: { date: today, device, source } },
      create: { date: today, device, source, count: 1 },
      update: { count: { increment: 1 } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
