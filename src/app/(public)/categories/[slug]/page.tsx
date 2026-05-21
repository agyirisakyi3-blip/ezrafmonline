import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatDate, imageUrl } from "@/lib/utils";
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

const PER_PAGE = 15;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [articles, total] = await Promise.all([
    getArticlesByCategory(slug, currentPage, PER_PAGE),
    prisma.article.count({
      where: { status: "published", category: { slug } },
    }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

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
        <p className="mt-2 text-sm text-zinc-400">{total} article{total !== 1 ? "s" : ""}</p>
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
                <div className="relative w-full sm:w-56 h-40 shrink-0 overflow-hidden rounded-sm bg-zinc-100">
                  <Image
                    src={imageUrl(article.featuredImage)}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 224px"
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {currentPage > 1 && (
            <Link href={`/categories/${slug}?page=${currentPage - 1}`}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
              Previous
            </Link>
          )}
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`/categories/${slug}?page=${p}`}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                p === currentPage ? "bg-primary text-white" : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}>
              {p}
            </Link>
          ))}
          {currentPage < totalPages && (
            <Link href={`/categories/${slug}?page=${currentPage + 1}`}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
              Next
            </Link>
          )}
        </div>
      )}

      {articles.length === 0 && (
        <p className="py-12 text-center text-zinc-400">No articles in this category yet.</p>
      )}
    </div>
  );
}
