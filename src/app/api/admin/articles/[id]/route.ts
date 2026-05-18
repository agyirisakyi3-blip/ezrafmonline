import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { jsonResponse } from "@/lib/api-utils";
import { checkRateLimit, parseJsonBody, sanitizeHtml, sanitizePlain } from "@/lib/security";
import { z } from "zod";

const articleUpdateSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(500),
  excerpt: z.string().max(1000).optional().default(""),
  content: z.string(),
  featuredImage: z.string().max(1000).optional().default(""),
  status: z.enum(["draft", "published"]),
  isEditorPick: z.boolean().optional(),
  seoTitle: z.string().max(500).optional().default(""),
  seoDescription: z.string().max(1000).optional().default(""),
  categoryId: z.string().min(1),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "articles:put";
  if (!checkRateLimit(`articles:${ip}`, 20, 60_000)) {
    return jsonResponse({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await params;
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) {
    return jsonResponse({ error: "Not found" }, { status: 404 });
  }

  const parsed = await parseJsonBody<Record<string, unknown>>(req);
  if (parsed.error) return jsonResponse(parsed.error, { status: parsed.error.status });

  const result = articleUpdateSchema.safeParse(parsed.data);
  if (!result.success) {
    return jsonResponse(
      { error: "Validation failed", details: result.error.issues },
      { status: 400 },
    );
  }

  const data = result.data;

  const article = await prisma.article.update({
    where: { id },
    data: {
      title: sanitizePlain(data.title),
      slug: data.slug,
      excerpt: sanitizePlain(data.excerpt),
      content: sanitizeHtml(data.content),
      featuredImage: data.featuredImage,
      status: data.status,
      isEditorPick: data.isEditorPick ?? undefined,
      seoTitle: data.seoTitle ? sanitizePlain(data.seoTitle) : "",
      seoDescription: data.seoDescription ? sanitizePlain(data.seoDescription) : "",
      categoryId: data.categoryId,
      publishedAt:
        data.status === "published" && !existing.publishedAt
          ? new Date()
          : data.status === "draft"
            ? null
            : undefined,
    },
  });

  revalidatePath("/");
  revalidatePath(`/articles/${article.slug}`);
  revalidatePath("/articles");

  return jsonResponse(article);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "articles:delete";
  if (!checkRateLimit(`articles:delete:${ip}`, 10, 60_000)) {
    return jsonResponse({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/articles");
  return jsonResponse({ success: true });
}
