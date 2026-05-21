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
import ShareButtons from "@/components/share-buttons";
import NewsletterForm from "@/components/newsletter-form";
import Comments from "@/components/comments";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import ReadingProgress from "@/components/reading-progress";
import { getReadingTime, imageUrl } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import {
  getPublishedArticleBySlug,
  getRelatedArticles,
  getLatestArticles,
} from "@/lib/queries";

export const revalidate = 60;

const articleInclude = {
  category: true,
  author: { select: { id: true, name: true } },
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true,
} as const;

async function getArticle(slug: string, preview = false) {
  if (preview) {
    return prisma.article.findUnique({
      where: { slug },
      include: articleInclude,
    });
  }
  return getPublishedArticleBySlug(slug);
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const article = await getArticle(slug, sp.preview === "1");
  if (!article) return {};
  return siteMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || "",
    path: `/articles/${article.slug}`,
    image: imageUrl(article.featuredImage),
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    author: article.author?.name,
  });
}

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const preview = sp.preview === "1";

  const article = await getArticle(slug, preview);
  if (!article) notFound();

  const [relatedArticles, sidebarArticles] = await Promise.all([
    article.categoryId
      ? getRelatedArticles(article.categoryId, article.id, 5)
      : Promise.resolve([]),
    getLatestArticles(article.id, 5),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {preview && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Preview Mode — this article may not be published yet.
        </div>
      )}
      <TrackView slug={article.slug} />
      <ReadingProgress />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          <Breadcrumbs
            crumbs={[
              ...(article.category
                ? [{ label: article.category.name, href: `/categories/${article.category.slug}` }]
                : []),
              { label: article.title },
            ]}
          />
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

          <div className="flex items-center gap-3 text-sm text-zinc-500 mb-6 pb-6 border-b border-zinc-200 flex-wrap">
            {article.author?.name && (
              <Link href={`/authors/${article.author.id}`} className="font-medium text-zinc-700 hover:text-primary transition-colors">
                By {article.author.name}
              </Link>
            )}
            <span>&middot;</span>
            <time>{article.publishedAt && formatDateLong(article.publishedAt)}</time>
            <span>&middot;</span>
            <span>{getReadingTime(article.content)} min read</span>
            <span>&middot;</span>
            <span>{article.viewCount.toLocaleString()} views</span>
          </div>

          {article.featuredImage && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-lg bg-zinc-100">
              <Image
                src={article.featuredImage.replace(/^\/uploads\//, "/api/uploads/")}
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

          <div className="mb-6">
            <ShareButtons
              url={`${process.env.AUTH_URL || "http://localhost:3001"}/articles/${article.slug}`}
              title={article.title}
            />
          </div>

          <ArticleContent html={article.content} />

          <AdSlot position="article_banner" className="my-8 py-4 border-y border-zinc-100" />

          <JsonLd data={articleJsonLd({
            title: article.title,
            description: article.excerpt || article.title,
            url: `${process.env.AUTH_URL || "http://localhost:3001"}/articles/${article.slug}`,
            image: imageUrl(article.featuredImage),
            publishedAt: article.publishedAt || article.createdAt,
            updatedAt: article.updatedAt,
            author: article.author?.name,
            category: article.category?.name,
          })} />

          <div className="mt-10 pt-6 border-t border-zinc-200">
            <Link href={`/authors/${article.author?.id ?? "#"}`} className="flex items-center gap-4 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shrink-0">
                {article.author?.name?.charAt(0) ?? "A"}
              </div>
              <div>
                <p className="font-semibold text-zinc-900 group-hover:text-primary transition-colors">
                  {article.author?.name ?? "Anonymous"}
                </p>
                <p className="text-sm text-zinc-400">Staff Writer at Ezrafmonline</p>
              </div>
            </Link>
          </div>

          {(relatedArticles.length > 0 || sidebarArticles.length > 0) && (
            <div className="mt-10 pt-6 border-t border-zinc-200">
              <h2 className="text-xl font-bold text-zinc-900 border-l-4 border-primary pl-3 mb-6">
                More Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...relatedArticles, ...sidebarArticles].slice(0, 4).map((a) => (
                  <Link key={a.id} href={`/articles/${a.slug}`} className="group flex gap-4">
                    {a.featuredImage && (
                      <div className="relative w-24 h-20 shrink-0 overflow-hidden rounded bg-zinc-100">
                        <img src={imageUrl(a.featuredImage)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-zinc-900 line-clamp-3 group-hover:text-primary transition-colors">
                        {a.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-zinc-200">
            <h2 className="text-xl font-bold text-zinc-900 border-l-4 border-primary pl-3 mb-4">
              Stay Updated
            </h2>
            <p className="text-sm text-zinc-500 mb-4">
              Get the latest news delivered to your inbox.
            </p>
            <NewsletterForm />
          </div>

          <div className="mt-10 pt-6 border-t border-zinc-200">
            <Comments slug={article.slug} />
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
