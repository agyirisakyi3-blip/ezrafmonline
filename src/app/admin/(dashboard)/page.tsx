import { prisma } from "@/lib/prisma";
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
      select: { title: true, slug: true, viewCount: true },
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
    {
      label: "Published",
      value: publishedCount,
      pct: (publishedCount / maxVal) * 100,
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      label: "Categories",
      value: totalCategories,
      pct: (totalCategories / maxVal) * 100,
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-accent" />
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
            <p className="text-sm text-zinc-500">Welcome back. Here&apos;s an overview of your content.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group bg-white rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-zinc-300 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${stat.bg} ${stat.gradient.split(" ")[0].replace("from-", "text-").replace("-500", "-600")}`}>
                {stat.icon}
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{stat.label.split(" ")[0]}</span>
            </div>
            <p className="text-3xl font-bold text-zinc-900 mb-1">{stat.value}</p>
            <p className="text-sm text-zinc-500 mb-3">{stat.label}</p>
            <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-500`}
                style={{ width: `${Math.max(stat.pct, 4)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Analytics */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-blue-600" />
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Traffic Analytics</h2>
            <p className="text-xs text-zinc-500">Page views and popular content</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3 mb-5">
          <div className="bg-white rounded-xl border border-zinc-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-blue-50 text-blue-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">All time</span>
            </div>
            <p className="text-3xl font-bold text-zinc-900 mb-1">{totalViews._sum.viewCount ?? 0}</p>
            <p className="text-sm text-zinc-500">Total Article Views</p>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-green-50 text-green-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Today</span>
            </div>
            <p className="text-3xl font-bold text-zinc-900 mb-1">{todayViews._sum.count ?? 0}</p>
            <p className="text-sm text-zinc-500">Views Today</p>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-amber-50 text-amber-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">7 Days</span>
            </div>
            <p className="text-3xl font-bold text-zinc-900 mb-1">{weekViews._sum.count ?? 0}</p>
            <p className="text-sm text-zinc-500">Views This Week</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Daily chart */}
          <div className="bg-white rounded-xl border border-zinc-200 p-5">
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">Daily Views (Last 14 days)</h3>
            {dailyStats.length > 0 ? (
              <div className="flex items-end gap-1.5 h-32">
                {(() => {
                  const maxDaily = Math.max(...dailyStats.map((d) => d._sum.count ?? 0), 1);
                  return dailyStats.map((d) => {
                    const h = ((d._sum.count ?? 0) / maxDaily) * 100;
                    const label = d.date.slice(5);
                    return (
                      <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
                        <span className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">{d._sum.count}</span>
                        <div
                          className="w-full rounded-sm bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 transition-all cursor-pointer"
                          style={{ height: `${Math.max(h, 2)}%` }}
                        />
                        <span className="text-[9px] text-zinc-400 font-mono">{label}</span>
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
            <div className="bg-white rounded-xl border border-zinc-200 p-5">
              <h3 className="text-sm font-semibold text-zinc-900 mb-4">Most Viewed Articles</h3>
              <div className="space-y-3">
                {mostViewed.map((a, i) => (
                  <div key={a.slug} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-300 w-4 shrink-0">{(i + 1).toString().padStart(2, "0")}</span>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/articles/${a.slug}`}
                        className="text-sm text-zinc-700 hover:text-primary transition-colors line-clamp-1 font-medium"
                      >
                        {a.title}
                      </Link>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 shrink-0 tabular-nums">{a.viewCount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-gradient-to-r from-white to-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary-light flex items-center justify-center">
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900">Recent Articles</h2>
              <p className="text-xs text-zinc-400">Latest 5 articles</p>
            </div>
          </div>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-md hover:from-primary-dark hover:to-primary-dark transition-all duration-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Article
          </Link>
        </div>

        <div className="divide-y divide-zinc-100">
          {recentArticles.map((article, i) => (
            <div
              key={article.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50/80 transition-colors group/item"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-xs font-mono text-zinc-300 w-5 shrink-0">{(i + 1).toString().padStart(2, "0")}</span>
                {article.featuredImage && (
                  <div className="h-11 w-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0 ring-1 ring-zinc-200/50 group-hover/item:ring-primary/30 transition-all">
                    <img
                      src={article.featuredImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="font-medium text-zinc-900 hover:text-primary transition-colors text-sm line-clamp-1"
                  >
                    {article.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                    {article.author?.name && (
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {article.author.name}
                      </span>
                    )}
                    {article.category?.name && (
                      <>
                        <span className="text-zinc-300">&middot;</span>
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                          {article.category.name}
                        </span>
                      </>
                    )}
                    <span className="text-zinc-300">&middot;</span>
                    <span className={`flex items-center gap-1 ${
                      article.status === "published" ? "text-green-600" : "text-amber-600"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        article.status === "published" ? "bg-green-500" : "bg-amber-500"
                      }`} />
                      {article.status}
                    </span>
                    <span className="text-zinc-300">&middot;</span>
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/admin/articles/${article.id}/edit`}
                className="opacity-0 group-hover/item:opacity-100 text-xs font-medium text-primary hover:text-primary-dark transition-all shrink-0 px-3 py-1.5 rounded-lg bg-primary-light/50 hover:bg-primary-light"
              >
                Edit &rarr;
              </Link>
            </div>
          ))}
          {recentArticles.length === 0 && (
            <div className="px-6 py-16 text-center">
              <svg className="mx-auto h-12 w-12 text-zinc-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-zinc-400 text-sm mb-1">No articles yet</p>
              <Link href="/admin/articles/new" className="text-primary text-sm font-medium hover:underline">
                Create your first article
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
