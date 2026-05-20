import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "default" } });

  const response = NextResponse.json({
    url: config?.liveRadioUrl || null,
    active: config?.liveRadioActive || false,
  });
  response.headers.set("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  return response;
}
