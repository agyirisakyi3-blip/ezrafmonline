import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const programs = await prisma.radioProgram.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(programs);
}
