import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ArticleForm from "@/components/articles/article-form";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [article, categories] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!article) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Article</h1>
      <ArticleForm
        categories={categories}
        article={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt ?? "",
          content: article.content,
          featuredImage: article.featuredImage ?? "",
          status: article.status,
          isEditorPick: article.isEditorPick,
          seoTitle: article.seoTitle ?? "",
          seoDescription: article.seoDescription ?? "",
          categoryId: article.categoryId ?? "",
        }}
      />
    </div>
  );
}
