import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const programs = await prisma.radioProgram.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  const response = NextResponse.json(programs);
  response.headers.set("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=600");
  return response;
}
