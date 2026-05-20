import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { AnimatedCounter } from "@/components/animated-counter";
import { DeviceBreakdown, SourceBreakdown } from "@/components/traffic-sources";

export const dynamic = "force-dynamic";

function getDateRange(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export default async function AdminDashboard() {
  const today = getDateRange(0);
  const weekAgo = getDateRange(7);

  const [
    totalArticles,
    totalCategories,
    publishedCount,
    draftCount,
    totalViews,
    todayViews,
    weekViews,
    mostViewed,
    dailyStats,
    deviceTraffic,
    sourceTraffic,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.category.count(),
    prisma.article.count({ where: { status: "published" } }),
    prisma.article.count({ where: { status: "draft" } }),
    prisma.article.aggregate({ _sum: { viewCount: true } }),
    prisma.dailyView.aggregate({
      where: { date: today },
      _sum: { count: true },
    }),
    prisma.dailyView.aggregate({
      where: { date: { gte: weekAgo } },
      _sum: { count: true },
    }),
    prisma.article.findMany({
      where: { viewCount: { gt: 0 } },
      orderBy: { viewCount: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, viewCount: true },
    }),
    prisma.dailyView.groupBy({
      by: ["date"],
      _sum: { count: true },
      orderBy: { date: "asc" },
      take: 14,
    }),
    prisma.dailyTraffic.groupBy({
      by: ["device"],
      _sum: { count: true },
      where: { date: { gte: weekAgo } },
    }),
    prisma.dailyTraffic.groupBy({
      by: ["source"],
      _sum: { count: true },
      where: { date: { gte: weekAgo } },
    }),
  ]);

  const deviceMap: Record<string, number> = {};
  for (const d of deviceTraffic) deviceMap[d.device] = d._sum.count ?? 0;
  const sourceMap: Record<string, number> = {};
  for (const s of sourceTraffic) sourceMap[s.source] = s._sum.count ?? 0;

  const recentArticles = await prisma.article.findMany({
    include: { category: true, author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const maxVal = Math.max(totalArticles, 1);

  const stats = [
    {
      label: "Total Articles",
      value: totalArticles,
      pct: (totalArticles / maxVal) * 100,
      gradient: "from-primary to-primary-dark",
      bg: "bg-primary-light",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      label: "Published",
      value: publishedCount,
      pct: (publishedCount / maxVal) * 100,
      gradient: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Drafts",
      value: draftCount,
      pct: (draftCount / maxVal) * 100,
      gradient: "from-amber-500 to-amber-600",
      bg: "bg-amber-50",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      ),
    },
    {
      label: "Categories",
      value: totalCategories,
      pct: (totalCategories / maxVal) * 100,
      gradient: "from-violet-500 to-violet-600",
      bg: "bg-violet-50",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
    },
  ];

  const weekGrowth = weekViews._sum.count ?? 0;
  const todayVal = todayViews._sum.count ?? 0;
  const weekAvg = weekGrowth > 0 ? Math.round((todayVal / (weekGrowth / 7)) * 100 - 100) : 0;

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Welcome back. Here&apos;s an overview of your content.</p>
        </div>
        <Link
          href="/cms/articles/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Article
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`cms-animate-fade-in-up cms-delay-${i + 1} bg-white rounded-xl border border-zinc-200/70 p-5 hover:shadow-sm hover:border-zinc-300 hover:-translate-y-0.5 transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center justify-center h-9 w-9 rounded-lg ${stat.bg}`}>
                <span className={stat.label === "Total Articles" ? "text-primary" : stat.label === "Published" ? "text-emerald-600" : stat.label === "Drafts" ? "text-amber-600" : "text-violet-600"}>
                  {stat.icon}
                </span>
              </span>
              <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-md ${
                stat.label === "Total Articles" ? "bg-primary-light text-primary" :
                stat.label === "Published" ? "bg-emerald-50 text-emerald-600" :
                stat.label === "Drafts" ? "bg-amber-50 text-amber-600" :
                "bg-violet-50 text-violet-600"
              }`}>
                {stat.label.split(" ")[0]}
              </span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">
              <AnimatedCounter value={stat.value} />
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-500">{stat.label}</span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
                {Math.round(stat.pct)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Analytics */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-6 w-0.5 rounded-full bg-gradient-to-b from-sky-500 to-sky-600" />
          <div>
            <h2 className="text-base font-bold text-zinc-900">Traffic</h2>
            <p className="text-xs text-zinc-500">Page views and popular content</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3 mb-5">
          <div className="cms-animate-fade-in-up cms-delay-5 bg-white rounded-xl border border-zinc-200/70 p-5 hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-sky-50 text-sky-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 tracking-wider">All time</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 tracking-tight mb-1"><AnimatedCounter value={totalViews._sum.viewCount ?? 0} /></p>
            <p className="text-xs text-zinc-500">Total Article Views</p>
          </div>

          <div className="cms-animate-fade-in-up cms-delay-6 bg-white rounded-xl border border-zinc-200/70 p-5 hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 tracking-wider">Today</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 tracking-tight mb-1"><AnimatedCounter value={todayViews._sum.count ?? 0} /></p>
            <p className="text-xs text-zinc-500">Views Today</p>
          </div>

          <div className="cms-animate-fade-in-up cms-delay-7 bg-white rounded-xl border border-zinc-200/70 p-5 hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-amber-50 text-amber-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 tracking-wider">7 Days</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900 tracking-tight mb-1"><AnimatedCounter value={weekViews._sum.count ?? 0} /></p>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-zinc-500">Views this week</p>
              {weekAvg !== 0 && (
                <span className={`text-[10px] font-medium flex items-center gap-0.5 ${
                  weekAvg > 0 ? "text-emerald-600" : "text-red-500"
                }`}>
                  <svg className={`h-3 w-3 ${weekAvg < 0 ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                  {Math.abs(weekAvg)}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Daily chart */}
          <div className="cms-animate-fade-in-up cms-delay-8 bg-white rounded-xl border border-zinc-200/70 p-5">
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">Daily Views</h3>
            {dailyStats.length > 0 ? (
              <div className="flex items-end gap-2 h-32">
                {(() => {
                  const maxDaily = Math.max(...dailyStats.map((d) => d._sum.count ?? 0), 1);
                  return dailyStats.map((d, i) => {
                    const h = ((d._sum.count ?? 0) / maxDaily) * 100;
                    const label = d.date.slice(5);
                    return (
                      <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
                        <span className="text-[9px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">{d._sum.count}</span>
                        <div
                          className="cms-animate-bar-grow relative w-full rounded-md bg-zinc-100 overflow-hidden"
                          style={{ animationDelay: `${i * 0.04}s`, height: `${Math.max(h, 3)}%` }}
                        >
                          <div
                            className="absolute bottom-0 w-full rounded-md bg-gradient-to-t from-sky-500 to-sky-400 group-hover:from-sky-600 transition-all"
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span className="text-[8px] text-zinc-400 font-mono">{label}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            ) : (
              <p className="text-sm text-zinc-400 text-center py-8">No view data yet</p>
            )}
          </div>

          {/* Most viewed */}
          {mostViewed.length > 0 && (
            <div className="cms-animate-fade-in-up cms-delay-9 bg-white rounded-xl border border-zinc-200/70 p-5">
              <h3 className="text-sm font-semibold text-zinc-900 mb-4">Most Viewed</h3>
              <div className="space-y-3">
                {mostViewed.map((a, i) => (
                  <div key={a.id} className={`cms-animate-slide-in-right cms-delay-${Math.min(i + 1, 10)} flex items-center gap-3`}>
                    <span className={`text-xs font-mono w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                      i === 0 ? "bg-amber-100 text-amber-700 font-bold" :
                      i === 1 ? "bg-zinc-100 text-zinc-500 font-semibold" :
                      i === 2 ? "bg-orange-100 text-orange-700 font-semibold" :
                      "bg-zinc-50 text-zinc-400"
                    }`}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/cms/articles/${a.id}/edit`}
                        className="text-sm text-zinc-700 hover:text-primary transition-colors line-clamp-1 font-medium"
                      >
                        {a.title}
                      </Link>
                    </div>
                    <span className="text-[10px] font-semibold text-sky-600 shrink-0 tabular-nums bg-sky-50 px-2 py-0.5 rounded">{a.viewCount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Device & Source breakdown */}
      <div className="grid gap-5 sm:grid-cols-2">
        <DeviceBreakdown
          mobile={deviceMap.mobile ?? 0}
          desktop={deviceMap.desktop ?? 0}
          tablet={deviceMap.tablet ?? 0}
        />
        <SourceBreakdown
          direct={sourceMap.direct ?? 0}
          google={sourceMap.google ?? 0}
          facebook={sourceMap.facebook ?? 0}
          twitter={sourceMap.twitter ?? 0}
          other={sourceMap.other ?? 0}
        />
      </div>

      {/* Recent Articles */}
      <div className="cms-animate-fade-in-up cms-delay-10 bg-white rounded-xl border border-zinc-200/70 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary-light flex items-center justify-center">
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-sm text-zinc-900">Recent Articles</h2>
              <p className="text-xs text-zinc-400">Latest 5 articles</p>
            </div>
          </div>
          <Link
            href="/cms/articles/new"
            className="inline-flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-dark transition-all"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Article
          </Link>
        </div>

        <div className="divide-y divide-zinc-100">
          {recentArticles.map((article, i) => (
            <div
              key={article.id}
              className="cms-animate-fade-in px-5 py-3.5 hover:bg-zinc-50/80 transition-colors group/item"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-zinc-300 w-5 h-5 rounded bg-zinc-50 flex items-center justify-center shrink-0">{(i + 1)}</span>
                {article.featuredImage && (
                  <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100 ring-1 ring-zinc-200/50 group-hover/item:ring-primary/20 transition-all">
                    <Image
                      src={article.featuredImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <Link
                    href={`/cms/articles/${article.id}/edit`}
                    className="font-medium text-zinc-900 hover:text-primary transition-colors text-sm line-clamp-1"
                  >
                    {article.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                    {article.author?.name && (
                      <span>{article.author.name}</span>
                    )}
                    {article.category?.name && (
                      <>
                        <span className="text-zinc-300">&middot;</span>
                        <span className="inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600">
                          {article.category.name}
                        </span>
                      </>
                    )}
                    <span className="text-zinc-300">&middot;</span>
                    <span className={`flex items-center gap-1 ${
                      article.status === "published" ? "text-emerald-600" : "text-amber-600"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        article.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                      }`} />
                      {article.status}
                    </span>
                    <span className="text-zinc-300">&middot;</span>
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/cms/articles/${article.id}/edit`}
                className="opacity-0 group-hover/item:opacity-100 text-[10px] font-medium text-primary hover:text-primary-dark transition-all shrink-0 px-2.5 py-1 rounded-lg bg-primary-light/50 hover:bg-primary-light"
              >
                Edit &rarr;
              </Link>
            </div>
          ))}
          {recentArticles.length === 0 && (
            <div className="px-5 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-zinc-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="text-zinc-400 text-sm mb-1">No articles yet</p>
              <Link href="/cms/articles/new" className="text-primary text-sm font-semibold hover:underline">
                Create your first article
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
