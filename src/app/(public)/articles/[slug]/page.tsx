import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatDateLong } from "@/lib/utils";
import { SidebarCard } from "@/components/articles/article-card";
import ArticleContent from "@/components/articles/article-content";
import { siteMetadata, articleJsonLd } from "@/lib/seo";
import JsonLd from "@/components/ui/json-ld";
import AdSlot from "@/components/ads/ad-slot";
import TrackView from "@/components/track-view";
import {
  getPublishedArticleBySlug,
  getRelatedArticles,
  getLatestArticles,
} from "@/lib/queries";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return {};
  return siteMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || "",
    path: `/articles/${article.slug}`,
    image: article.featuredImage,
    publishedAt: article.publishedAt,
    author: article.author?.name,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const [relatedArticles, sidebarArticles] = await Promise.all([
    article.categoryId
      ? getRelatedArticles(article.categoryId, article.id, 5)
      : Promise.resolve([]),
    getLatestArticles(article.id, 5),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <TrackView slug={article.slug} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          {article.category && (
            <Link
              href={`/categories/${article.category.slug}`}
              className="inline-block bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-4"
            >
              {article.category.name}
            </Link>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 leading-tight mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-zinc-500 mb-8 pb-6 border-b border-zinc-200">
            {article.author?.name && (
              <span className="font-medium text-zinc-700">By {article.author.name}</span>
            )}
            <span>&middot;</span>
            <time>{article.publishedAt && formatDateLong(article.publishedAt)}</time>
          </div>

          {article.featuredImage && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-lg bg-zinc-100">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          )}

          {article.excerpt && (
            <p className="mb-8 text-lg leading-relaxed text-zinc-600 border-l-4 border-primary pl-4 italic">
              {article.excerpt}
            </p>
          )}

          <ArticleContent html={article.content} />

          <AdSlot position="article_banner" className="my-8 py-4 border-y border-zinc-100" />

          <JsonLd data={articleJsonLd({
            title: article.title,
            description: article.excerpt || article.title,
            url: `${process.env.AUTH_URL || "http://localhost:3001"}/articles/${article.slug}`,
            image: article.featuredImage,
            publishedAt: article.publishedAt || article.createdAt,
            updatedAt: article.updatedAt,
            author: article.author?.name,
            category: article.category?.name,
          })} />

          <div className="mt-10 pt-6 border-t border-zinc-200">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {article.author?.name?.charAt(0) ?? "A"}
              </div>
              <div>
                <p className="font-semibold text-zinc-900">
                  {article.author?.name ?? "Anonymous"}
                </p>
                <p className="text-sm text-zinc-400">Staff Writer at Ezrafmonline</p>
              </div>
            </div>
          </div>
        </article>

        <aside className="lg:col-span-1">
          <div className="sticky top-[calc(72px+2rem)] space-y-6">
            <AdSlot position="article_sidebar" />

            {relatedArticles.length > 0 && (
              <div className="rounded-lg border border-zinc-100">
                <div className="border-b border-zinc-200 p-4">
                  <h3 className="text-lg font-bold text-zinc-900 flex items-center">
                    <span className="w-1 h-6 bg-primary mr-3 block shrink-0" />
                    Related Articles
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {relatedArticles.map((related) => (
                    <SidebarCard key={related.id} article={related} />
                  ))}
                </div>
              </div>
            )}

            {sidebarArticles.length > 0 && (
              <div className="rounded-lg border border-zinc-100">
                <div className="border-b border-zinc-200 p-4">
                  <h3 className="text-lg font-bold text-zinc-900 flex items-center">
                    <span className="w-1 h-6 bg-primary mr-3 block shrink-0" />
                    Latest News
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {sidebarArticles.map((a) => (
                    <SidebarCard key={a.id} article={a} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
