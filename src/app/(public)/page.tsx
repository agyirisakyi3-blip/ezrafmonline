import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { TopStoryCard, GridCard, SidebarCard } from "@/components/articles/article-card";
import HeroSlider from "@/components/articles/hero-slider";
import { siteMetadata, organizationJsonLd } from "@/lib/seo";
import { getHomepageData, getPopularArticles } from "@/lib/queries";
import AdSlot from "@/components/ads/ad-slot";
import NewsletterForm from "@/components/newsletter-form";
import JsonLd from "@/components/ui/json-ld";

export const metadata: Metadata = siteMetadata({
  title: "Home",
  description: "Latest breaking news, top stories and updates",
  path: "/",
});

export const revalidate = 60;

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { name: "asc" },
  });
}

export default async function HomePage() {
  const [{ articles, deeplyRead, editorPicks }, categories, popularArticles] = await Promise.all([
    getHomepageData(),
    getCategories(),
    getPopularArticles(3),
  ]);

  const sliderArticles = articles.slice(0, 5);
  const remaining = articles.slice(5);

  let topStories: typeof articles = [];
  let sidebarArticles: typeof articles = [];

  if (remaining.length <= 3) {
    sidebarArticles = remaining;
  } else {
    topStories = remaining.slice(0, Math.min(6, remaining.length - 3));
    sidebarArticles = remaining.slice(topStories.length).slice(0, 6);
  }

  const categoryArticles: Record<string, typeof articles> = {};
  for (const cat of categories.slice(0, 3)) {
    categoryArticles[cat.name] = articles.filter(
      (a) => a.category?.name === cat.name
    ).slice(0, 4);
  }

  const mostViewedLeft = popularArticles;
  const deeplyReadMiddle = deeplyRead;
  const editorPicksRight = editorPicks.length > 0 ? editorPicks : articles.slice(3, 6);

  return (
    <div>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Ezrafmonline",
        url: process.env.AUTH_URL || "https://ezrafmonline.vercel.app",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${process.env.AUTH_URL || "https://ezrafmonline.vercel.app"}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }} />
      <JsonLd data={organizationJsonLd()} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <HeroSlider articles={sliderArticles} />

            {topStories.length > 0 && (
              <section className="border-b border-zinc-200">
                <div className="py-6">
                  <h2 className="text-xl font-bold text-zinc-900 border-l-4 border-primary pl-3 mb-6">
                    Top Stories
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {topStories.map((article) => (
                      <TopStoryCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            <AdSlot position="homepage_leaderboard" className="py-4 border-y border-zinc-100" />
          </div>

          <aside className="lg:col-span-1 space-y-6">
            <div className="sticky top-[calc(72px+2rem)] space-y-6">
              {sidebarArticles.length > 0 && (
                <div className="rounded-lg border border-zinc-100">
                  <div className="border-b border-zinc-200 p-4">
                    <h3 className="text-lg font-bold text-zinc-900 flex items-center">
                      <span className="w-1 h-6 bg-primary mr-3 block shrink-0" />
                      Most Popular
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {sidebarArticles.map((article, i) => (
                      <SidebarCard key={article.id} article={article} rank={i + 1} />
                    ))}
                  </div>
                </div>
              )}
              <AdSlot position="homepage_sidebar" />
            </div>
          </aside>
        </div>
      </div>

      {Object.entries(categoryArticles).map(
        ([name, cats]) =>
          cats.length > 0 && (
            <section
              key={name}
              className="bg-zinc-50 border-y border-zinc-100 py-8"
            >
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-zinc-900 border-l-4 border-primary pl-3">
                    {name}
                  </h2>
                  <Link
                    href={`/categories/${categories.find((c) => c.name === name)?.slug ?? ""}`}
                    className="text-primary text-sm font-semibold hover:opacity-80"
                  >
                    More
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {cats.slice(0, 4).map((article) => (
                    <GridCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </section>
          )
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="border border-zinc-200 rounded-lg overflow-hidden">
          <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200">
            <h2 className="text-xl font-bold text-zinc-900">Popular Content</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="p-6 md:border-r border-zinc-200 border-b md:border-b-0">
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h3 className="font-bold text-sm text-zinc-700">Most viewed</h3>
              </div>
              <div className="space-y-3">
                {mostViewedLeft.map((article, i) => (
                  <SidebarCard key={article.id} article={article} rank={i + 1} />
                ))}
              </div>
            </div>
            <div className="p-6 md:border-r border-zinc-200 border-b md:border-b-0">
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-sm text-zinc-700">Deeply read</h3>
              </div>
              <div className="space-y-3">
                {deeplyReadMiddle.length > 0 ? deeplyReadMiddle.map((article, i) => (
                  <SidebarCard key={article.id} article={article} rank={i + 1} />
                )) : <p className="text-sm text-zinc-400">No articles yet</p>}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <h3 className="font-bold text-sm text-zinc-700">Editors&apos; picks</h3>
              </div>
              <div className="space-y-3">
                {editorPicksRight.map((article, i) => (
                  <SidebarCard key={article.id} article={article} rank={i + 1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-zinc-50 border-y border-zinc-100 py-12">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Never Miss a Story</h2>
          <p className="text-sm text-zinc-500 mb-6">Subscribe to our newsletter and get the latest news delivered to your inbox.</p>
          <NewsletterForm />
        </div>
      </section>

      {articles.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-zinc-400 text-lg">No articles published yet.</p>
          <p className="text-zinc-300 text-sm mt-2">
            Visit the admin panel to create your first article.
          </p>
        </div>
      )}
    </div>
  );
}
