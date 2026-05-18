import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/security";

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
  ]);

  return NextResponse.json({ ok: true });
}
