import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    include: { category: true, author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Articles</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your news content ({articles.length} total)
          </p>
        </div>
        <Link
          href="/cms/articles/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors shadow-xs"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Article
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wider">
                  Article
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wider hidden md:table-cell">
                  Author
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {article.featuredImage && (
                        <div className="h-10 w-14 rounded overflow-hidden bg-zinc-100 shrink-0 hidden sm:block">
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
                      <span className="inline-block bg-zinc-100 text-zinc-600 text-xs font-medium px-2 py-0.5 rounded">
                        {article.category.name}
                      </span>
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-zinc-500 hidden md:table-cell">
                    {article.author?.name ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-zinc-500 hidden lg:table-cell text-xs">
                    {formatDate(article.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        article.status === "published"
                          ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          article.status === "published"
                            ? "bg-green-500"
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
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-100"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
            <svg className="mx-auto h-12 w-12 text-zinc-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-zinc-400 text-sm mb-1">No articles yet</p>
            <p className="text-zinc-300 text-xs">Create your first article to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
