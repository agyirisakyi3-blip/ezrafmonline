import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, imageUrl } from "@/lib/utils";
import { siteMetadata } from "@/lib/seo";
import { getPublishedArticles } from "@/lib/queries";

export const metadata: Metadata = siteMetadata({
  title: "All News",
  description: "Latest stories, breaking news and updates",
  path: "/articles",
});

export const revalidate = 120;

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">All News</h1>
        <p className="mt-1 text-zinc-500">Latest stories and breaking news</p>
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
                    src={imageUrl(article.featuredImage)}
                    alt={article.title}
                    loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {article.category && (
                  <span className="mb-1 inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-2 py-0.5">
                    {article.category.name}
                  </span>
                )}
                <h2 className="text-xl font-bold text-zinc-900 leading-snug mt-1 group-hover:text-primary transition-colors">
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
        <p className="py-12 text-center text-zinc-400">No articles published yet.</p>
      )}
    </div>
  );
}
