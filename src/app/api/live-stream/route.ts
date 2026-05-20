import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/security";

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "live-stream";
  if (!checkRateLimit(`live:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const config = await prisma.siteConfig.findUnique({ where: { id: "default" } });

  const response = NextResponse.json({
    url: config?.liveRadioUrl || null,
    active: config?.liveRadioActive || false,
  });
  response.headers.set("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  return response;
}
