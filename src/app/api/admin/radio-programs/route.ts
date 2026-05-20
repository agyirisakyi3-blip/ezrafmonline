import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const programs = await prisma.radioProgram.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(programs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, host, imageUrl, startTime, endTime, days, description, sortOrder } = await req.json();

    if (!title?.trim() || !startTime?.trim() || !endTime?.trim()) {
      return NextResponse.json({ error: "Title, start time, and end time are required" }, { status: 400 });
    }

    const program = await prisma.radioProgram.create({
      data: {
        title: title.trim(),
        host: host?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        startTime,
        endTime,
        days: days || "weekdays",
        description: description?.trim() || null,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
      },
    });

    return NextResponse.json(program, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, host, imageUrl, startTime, endTime, days, description, sortOrder, active } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const program = await prisma.radioProgram.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(host !== undefined && { host: host?.trim() || null }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl?.trim() || null }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(days !== undefined && { days }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(program);
  } catch {
    return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.radioProgram.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
