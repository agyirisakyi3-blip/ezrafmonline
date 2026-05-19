import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { siteMetadata } from "@/lib/seo";

export const metadata: Metadata = siteMetadata({
  title: "Search",
  description: "Search news articles",
  path: "/search",
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const articles = query
    ? await prisma.article.findMany({
        where: {
          status: "published",
          OR: [
            { title: { contains: query } },
            { excerpt: { contains: query } },
          ],
        },
        include: { category: true, author: { select: { name: true } } },
        orderBy: { publishedAt: "desc" },
        take: 20,
      })
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Search</h1>
        <p className="mt-1 text-zinc-500">Find the stories that matter to you</p>
      </div>

      <form className="mb-8">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search articles..."
            className="block w-full rounded-lg border border-zinc-300 bg-white py-3.5 pl-12 pr-4 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>
      </form>

      {query && (
        <p className="mb-6 text-sm text-zinc-500">
          <span className="font-semibold text-zinc-800">{articles.length}</span> result{articles.length !== 1 ? "s" : ""} for &ldquo;<span className="font-medium text-zinc-900">{query}</span>&rdquo;
        </p>
      )}

      <div className="space-y-0 divide-y divide-zinc-100 border-t border-zinc-200">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group block py-6 first:pt-6"
          >
            <article className="flex flex-col gap-4 sm:flex-row">
              {article.featuredImage && (
                <div className="relative w-full sm:w-44 h-32 shrink-0 overflow-hidden rounded-sm bg-zinc-100">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 176px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {article.category && (
                  <span className="mb-1 inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-2 py-0.5">
                    {article.category.name}
                  </span>
                )}
                <h2 className="text-lg font-bold text-zinc-900 leading-snug mt-1 group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="mt-1 text-sm text-zinc-500 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                <div className="mt-2 text-xs text-zinc-400">
                  {article.publishedAt && formatDate(article.publishedAt)}
                </div>
              </div>
            </article>
          </Link>
        ))}
        {query && articles.length === 0 && (
          <div className="py-16 text-center">
            <svg className="mx-auto mb-4 h-12 w-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-zinc-400">No articles found for &ldquo;{query}&rdquo;</p>
            <p className="mt-1 text-sm text-zinc-300">Try different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
}
