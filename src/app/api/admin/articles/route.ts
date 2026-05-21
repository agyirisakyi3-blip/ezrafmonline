import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { jsonResponse } from "@/lib/api-utils";
import { checkRateLimit, parseJsonBody, sanitizeHtml, sanitizePlain } from "@/lib/security";
import { z } from "zod";

const articleSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(500),
  excerpt: z.string().max(1000).optional().default(""),
  content: z.string(),
  featuredImage: z.string().max(1000).optional().default(""),
  status: z.enum(["draft", "published", "scheduled"]).optional().default("draft"),
  isEditorPick: z.boolean().optional().default(false),
  sortOrder: z.number().int().min(0).optional().default(0),
  seoTitle: z.string().max(500).optional().default(""),
  seoDescription: z.string().max(1000).optional().default(""),
  categoryId: z.string().min(1).optional().default(""),
  scheduledAt: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "articles:post";
  if (!checkRateLimit(`articles:${ip}`, 20, 60_000)) {
    return jsonResponse({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = await parseJsonBody<Record<string, unknown>>(req);
  if (parsed.error) return jsonResponse(parsed.error, { status: parsed.error.status });

  const result = articleSchema.safeParse(parsed.data);
  if (!result.success) {
    return jsonResponse(
      { error: "Validation failed", details: result.error.issues },
      { status: 400 },
    );
  }

  const userId = (session.user as { id: string }).id;
  const data = result.data;

  const article = await prisma.article.create({
    data: {
      title: sanitizePlain(data.title),
      slug: data.slug,
      excerpt: sanitizePlain(data.excerpt),
      content: sanitizeHtml(data.content),
      featuredImage: data.featuredImage,
      status: data.status as any,
      isEditorPick: data.isEditorPick,
      sortOrder: data.sortOrder,
      seoTitle: data.seoTitle ? sanitizePlain(data.seoTitle) : "",
      seoDescription: data.seoDescription ? sanitizePlain(data.seoDescription) : "",
      categoryId: data.categoryId || null,
      authorId: userId,
      publishedAt: data.status === "published" ? new Date() : undefined,
      scheduledAt: data.status === "scheduled" && data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    },
  });

  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath(`/articles/${article.slug}`);

  return jsonResponse(article, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  const articles = await prisma.article.findMany({
    include: { category: true, author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return jsonResponse(articles);
}
