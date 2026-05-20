import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { jsonResponse } from "@/lib/api-utils";
import { z } from "zod";

const programSchema = z.object({
  title: z.string().min(1).max(200),
  host: z.string().max(200).optional().nullable(),
  imageUrl: z.string().max(1000).optional().nullable(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:mm format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:mm format"),
  days: z.string().max(100).optional().default("weekdays"),
  description: z.string().max(2000).optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
});

const programUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200).optional(),
  host: z.string().max(200).optional().nullable(),
  imageUrl: z.string().max(1000).optional().nullable(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:mm format").optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:mm format").optional(),
  days: z.string().max(100).optional(),
  description: z.string().max(2000).optional().nullable(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

const deleteSchema = z.object({
  id: z.string().min(1),
});

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
    const json = await req.json();
    const result = programSchema.safeParse(json);
    if (!result.success) {
      return jsonResponse({ error: "Validation failed", details: result.error.issues }, { status: 400 });
    }

    const data = result.data;
    const program = await prisma.radioProgram.create({
      data: {
        title: data.title.trim(),
        host: data.host?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        startTime: data.startTime,
        endTime: data.endTime,
        days: data.days,
        description: data.description?.trim() || null,
        sortOrder: data.sortOrder,
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
    const json = await req.json();
    const result = programUpdateSchema.safeParse(json);
    if (!result.success) {
      return jsonResponse({ error: "Validation failed", details: result.error.issues }, { status: 400 });
    }

    const { id, ...data } = result.data;

    const program = await prisma.radioProgram.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.host !== undefined && { host: data.host?.trim() || null }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl?.trim() || null }),
        ...(data.startTime !== undefined && { startTime: data.startTime }),
        ...(data.endTime !== undefined && { endTime: data.endTime }),
        ...(data.days !== undefined && { days: data.days }),
        ...(data.description !== undefined && { description: data.description?.trim() || null }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.active !== undefined && { active: data.active }),
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
    const json = await req.json();
    const result = deleteSchema.safeParse(json);
    if (!result.success) {
      return jsonResponse({ error: "ID is required" }, { status: 400 });
    }

    await prisma.radioProgram.delete({ where: { id: result.data.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
