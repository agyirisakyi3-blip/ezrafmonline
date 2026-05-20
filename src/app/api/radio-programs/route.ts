import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/security";

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "radio-programs";
  if (!checkRateLimit(`radio:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const programs = await prisma.radioProgram.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  const response = NextResponse.json(programs);
  response.headers.set("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=600");
  return response;
}
