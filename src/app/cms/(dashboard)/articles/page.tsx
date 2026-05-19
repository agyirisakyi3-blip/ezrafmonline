import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    include: { category: true, author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const draftCount = articles.filter((a) => a.status === "draft").length;
  const publishedCount = articles.filter((a) => a.status === "published").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Articles</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your news content
          </p>
        </div>
        <Link
          href="/cms/articles/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Article
        </Link>
      </div>

      {/* Summary chips */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-zinc-200/80 text-sm">
          <span className="font-semibold text-zinc-900">{articles.length}</span>
          <span className="text-zinc-500">Total</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-sm">
          <span className="font-semibold text-emerald-700">{publishedCount}</span>
          <span className="text-emerald-600">Published</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200/80 text-sm">
          <span className="font-semibold text-amber-700">{draftCount}</span>
          <span className="text-amber-600">Drafts</span>
        </div>
      </div>

      {/* Articles table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="text-left px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider">
                  Article
                </th>
                <th className="text-left px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th className="text-left px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider hidden md:table-cell">
                  Author
                </th>
                <th className="text-left px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
                <th className="text-left px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-zinc-50/80 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      {article.featuredImage && (
                        <div className="h-11 w-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0 hidden sm:block ring-1 ring-zinc-200/50 group-hover:ring-primary/20 transition-all">
                          <img
                            src={article.featuredImage}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/cms/articles/${article.id}/edit`}
                          className="font-medium text-zinc-900 hover:text-primary transition-colors line-clamp-1"
                        >
                          {article.title}
                        </Link>
                        <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                          {article.excerpt || article.content.replace(/<[^>]*>/g, "").substring(0, 80)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-500 hidden sm:table-cell">
                    {article.category ? (
                      <span className="inline-block bg-zinc-100 text-zinc-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                        {article.category.name}
                      </span>
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-zinc-500 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-medium text-zinc-500">
                        {article.author?.name?.charAt(0) ?? "?"}
                      </div>
                      <span className="text-sm">{article.author?.name ?? "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-500 hidden lg:table-cell text-xs">
                    <div className="flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {formatDate(article.createdAt)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-medium ${
                        article.status === "published"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          article.status === "published"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {article.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/cms/articles/${article.id}/edit`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-primary transition-colors px-3 py-1.5 rounded-xl hover:bg-primary-light/50"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {articles.length === 0 && (
          <div className="py-16 text-center">
            <svg className="mx-auto h-14 w-14 text-zinc-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-zinc-400 text-sm mb-1">No articles yet</p>
            <p className="text-zinc-300 text-xs">Create your first article to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
