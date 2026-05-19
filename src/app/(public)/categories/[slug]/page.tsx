import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { siteMetadata } from "@/lib/seo";
import { getCategoryBySlug, getArticlesByCategory } from "@/lib/queries";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return siteMetadata({
    title: category.name,
    description: category.description || `${category.name} news and updates`,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [category, articles] = await Promise.all([
    getCategoryBySlug(slug),
    getArticlesByCategory(slug),
  ]);

  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs
        crumbs={[{ label: category.name }]}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">{category.name}</h1>
        {category.description && (
          <p className="mt-1 text-zinc-500">{category.description}</p>
        )}
      </div>

      <div className="space-y-0 divide-y divide-zinc-100 border-t border-zinc-200">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group block py-6 first:pt-6"
          >
            <article className="flex flex-col gap-4 sm:flex-row">
              {article.featuredImage && (
                <div className="w-full sm:w-56 h-40 shrink-0 overflow-hidden rounded-sm bg-zinc-100">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-zinc-900 leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="mt-2 text-sm text-zinc-500 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                <div className="mt-3 text-xs text-zinc-400">
                  {article.author?.name && (
                    <span>By <span className="font-medium text-zinc-500">{article.author.name}</span> &middot; </span>
                  )}
                  {article.publishedAt && formatDate(article.publishedAt)}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <p className="py-12 text-center text-zinc-400">No articles in this category yet.</p>
      )}
    </div>
  );
}
