import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "default" } });

  return NextResponse.json({
    url: config?.liveRadioUrl || null,
    active: config?.liveRadioActive || false,
  });
}
