import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

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
  ]);

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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Welcome back. Here&apos;s an overview of your content.</p>
        </div>
        <Link
          href="/cms/articles/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-primary/30"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Article
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group bg-white rounded-2xl border border-zinc-200/80 p-6 hover:shadow-xl hover:border-zinc-300 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-5">
              <span className={`inline-flex items-center justify-center h-11 w-11 rounded-xl ${stat.bg}`}>
                {stat.icon}
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-50 px-2.5 py-1 rounded-lg">{stat.label.split(" ")[0]}</span>
            </div>
            <p className="text-3xl font-bold text-zinc-900 tracking-tight mb-1">{stat.value}</p>
            <p className="text-sm text-zinc-500 mb-4">{stat.label}</p>
            <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-500`}
                style={{ width: `${Math.max(stat.pct, 4)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Analytics */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-7 w-1 rounded-full bg-gradient-to-b from-sky-500 to-sky-600" />
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Traffic Analytics</h2>
            <p className="text-xs text-zinc-500">Page views and popular content</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 mb-6">
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-sky-50 text-sky-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-50 px-2.5 py-1 rounded-lg">All time</span>
            </div>
            <p className="text-3xl font-bold text-zinc-900 tracking-tight mb-1">{totalViews._sum.viewCount ?? 0}</p>
            <p className="text-sm text-zinc-500">Total Article Views</p>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-50 px-2.5 py-1 rounded-lg">Today</span>
            </div>
            <p className="text-3xl font-bold text-zinc-900 tracking-tight mb-1">{todayViews._sum.count ?? 0}</p>
            <p className="text-sm text-zinc-500">Views Today</p>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-amber-50 text-amber-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-50 px-2.5 py-1 rounded-lg">7 Days</span>
            </div>
            <p className="text-3xl font-bold text-zinc-900 tracking-tight mb-1">{weekViews._sum.count ?? 0}</p>
            <p className="text-sm text-zinc-500">Views This Week</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Daily chart */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <h3 className="text-sm font-semibold text-zinc-900 mb-5">Daily Views (Last 14 days)</h3>
            {dailyStats.length > 0 ? (
              <div className="flex items-end gap-2 h-36">
                {(() => {
                  const maxDaily = Math.max(...dailyStats.map((d) => d._sum.count ?? 0), 1);
                  return dailyStats.map((d) => {
                    const h = ((d._sum.count ?? 0) / maxDaily) * 100;
                    const label = d.date.slice(5);
                    return (
                      <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <span className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">{d._sum.count}</span>
                        <div className="relative w-full rounded-lg bg-zinc-100 overflow-hidden" style={{ height: `${Math.max(h, 3)}%` }}>
                          <div
                            className="absolute bottom-0 w-full rounded-lg bg-gradient-to-t from-sky-500 to-sky-400 group-hover:from-sky-600 transition-all cursor-pointer"
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span className="text-[9px] text-zinc-400 font-mono">{label}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            ) : (
              <p className="text-sm text-zinc-400 text-center py-10">No view data yet</p>
            )}
          </div>

          {/* Most viewed */}
          {mostViewed.length > 0 && (
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
              <h3 className="text-sm font-semibold text-zinc-900 mb-5">Most Viewed Articles</h3>
              <div className="space-y-4">
                {mostViewed.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-4">
                    <span className={`text-xs font-mono w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
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
                    <span className="text-xs font-semibold text-sky-600 shrink-0 tabular-nums bg-sky-50 px-2.5 py-1 rounded-lg">{a.viewCount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary-light flex items-center justify-center">
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900">Recent Articles</h2>
              <p className="text-xs text-zinc-400">Latest 5 articles</p>
            </div>
          </div>
          <Link
            href="/cms/articles/new"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Article
          </Link>
        </div>

        <div className="divide-y divide-zinc-100">
          {recentArticles.map((article, i) => (
            <div
              key={article.id}
              className="flex items-center justify-between px-6 py-4.5 hover:bg-zinc-50/80 transition-colors group/item"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-xs font-mono text-zinc-300 w-6 h-6 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">{(i + 1)}</span>
                {article.featuredImage && (
                  <div className="relative h-12 w-18 shrink-0 overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200/50 group-hover/item:ring-primary/20 transition-all">
                    <Image
                      src={article.featuredImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="72px"
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
                  <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                    {article.author?.name && (
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        {article.author.name}
                      </span>
                    )}
                    {article.category?.name && (
                      <>
                        <span className="text-zinc-300">&middot;</span>
                        <span className="inline-flex items-center rounded-lg bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
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
                className="opacity-0 group-hover/item:opacity-100 text-xs font-medium text-primary hover:text-primary-dark transition-all shrink-0 px-3 py-1.5 rounded-xl bg-primary-light/50 hover:bg-primary-light"
              >
                Edit &rarr;
              </Link>
            </div>
          ))}
          {recentArticles.length === 0 && (
            <div className="px-6 py-16 text-center">
              <svg className="mx-auto h-14 w-14 text-zinc-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
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
