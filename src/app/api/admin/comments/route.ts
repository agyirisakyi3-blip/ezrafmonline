import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { jsonResponse } from "@/lib/api-utils";
import { z } from "zod";

const patchSchema = z.object({
  id: z.string().min(1),
  action: z.enum(["approve", "reject", "delete"]),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const perPage = 20;
  const filter = searchParams.get("filter");

  const where = filter === "pending"
    ? { isApproved: false }
    : filter === "approved"
      ? { isApproved: true }
      : {};

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { article: { select: { title: true, slug: true } } },
    }),
    prisma.comment.count({ where }),
  ]);

  return NextResponse.json({
    comments,
    total,
    page,
    totalPages: Math.ceil(total / perPage),
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const result = patchSchema.safeParse(json);
    if (!result.success) {
      return jsonResponse({ error: "Invalid request" }, { status: 400 });
    }

    const { id, action } = result.data;

    if (action === "delete") {
      await prisma.comment.delete({ where: { id } });
    } else {
      await prisma.comment.update({
        where: { id },
        data: { isApproved: action === "approve" },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}
