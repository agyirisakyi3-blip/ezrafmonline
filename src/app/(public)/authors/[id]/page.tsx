import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { siteMetadata } from "@/lib/seo";
import { getAuthorById } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const author = await getAuthorById(id);
  if (!author) return {};
  return siteMetadata({
    title: `${author.name} - Author`,
    description: `Articles by ${author.name} at Ezrafmonline`,
    path: `/authors/${author.id}`,
  });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const author = await getAuthorById(id);
  if (!author) notFound();

  const { articles } = author;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10 flex items-center gap-6">
        {author.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={author.name}
            loading="lazy"
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
            {author.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">{author.name}</h1>
          <p className="mt-1 text-zinc-500 capitalize">{author.role.toLowerCase()} at Ezrafmonline</p>
          {author.bio && (
            <p className="mt-2 text-sm text-zinc-600 max-w-lg">{author.bio}</p>
          )}
          <p className="mt-1 text-sm text-zinc-400">
            {articles.length} article{articles.length !== 1 ? "s" : ""} published
          </p>
        </div>
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
                <div className="w-full sm:w-48 h-32 shrink-0 overflow-hidden rounded-sm bg-zinc-100">
                  <img
                    src={article.featuredImage}
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
                  {article.publishedAt && formatDate(article.publishedAt)}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <p className="py-16 text-center text-zinc-400">No published articles yet.</p>
      )}
    </div>
  );
}
