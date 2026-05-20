import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, sanitizeHtml, sanitizePlain } from "@/lib/security";
import { z } from "zod";

const PAGE_SIZE = 20;

const commentSchema = z.object({
  content: z.string().min(1).max(5000),
  authorName: z.string().min(1).max(100),
  authorEmail: z.string().email().optional().or(z.literal("")),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);

  const article = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { articleId: article.id, isApproved: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, content: true, authorName: true, createdAt: true },
    }),
    prisma.comment.count({ where: { articleId: article.id, isApproved: true } }),
  ]);

  return NextResponse.json({
    comments,
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const ip = req.headers.get("x-forwarded-for") ?? "comment:post";
  if (!checkRateLimit(`comment:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const article = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  try {
    const json = await req.json();
    const result = commentSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.issues },
        { status: 400 },
      );
    }

    const { content, authorName, authorEmail } = result.data;

    const comment = await prisma.comment.create({
      data: {
        content: sanitizeHtml(content.trim()),
        authorName: sanitizePlain(authorName.trim()),
        authorEmail: authorEmail?.trim() || null,
        articleId: article.id,
      },
      select: { id: true, content: true, authorName: true, createdAt: true },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
