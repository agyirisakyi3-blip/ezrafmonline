import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PER_PAGE = 20;

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const { page: pageParam, filter } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const where = filter === "pending"
    ? { isApproved: false }
    : {};

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
      include: { article: { select: { title: true, slug: true } } },
    }),
    prisma.comment.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const pendingCount = await prisma.comment.count({ where: { isApproved: false } });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Comments</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Moderate reader comments
          </p>
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-sm text-amber-700 flex items-center gap-2">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {pendingCount} comment{pendingCount !== 1 ? "s" : ""} awaiting moderation
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="text-left px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider">Comment</th>
                <th className="text-left px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider hidden sm:table-cell">Article</th>
                <th className="text-left px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-900">{comment.authorName}</p>
                      <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{comment.content}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500 hidden sm:table-cell">
                    <a href={`/articles/${comment.article.slug}`} className="hover:text-primary line-clamp-1" target="_blank">
                      {comment.article.title}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500 hidden md:table-cell">
                    {comment.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-medium ${
                      comment.isApproved
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        comment.isApproved ? "bg-emerald-500" : "bg-amber-500"
                      }`} />
                      {comment.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!comment.isApproved && (
                        <form method="POST" action={`/api/admin/comments`}>
                          <input type="hidden" name="id" value={comment.id} />
                          <input type="hidden" name="action" value="approve" />
                          <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors">
                            Approve
                          </button>
                        </form>
                      )}
                      <form method="POST" action={`/api/admin/comments`}>
                        <input type="hidden" name="id" value={comment.id} />
                        <input type="hidden" name="action" value="delete" />
                        <button className="text-xs font-medium text-red-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {comments.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-zinc-400 text-sm">No comments yet</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {currentPage > 1 && (
            <a href={`/cms/comments?page=${currentPage - 1}${filter ? `&filter=${filter}` : ""}`}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
              Previous
            </a>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a key={p} href={`/cms/comments?page=${p}${filter ? `&filter=${filter}` : ""}`}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                p === currentPage ? "bg-primary text-white" : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}>
              {p}
            </a>
          ))}
          {currentPage < totalPages && (
            <a href={`/cms/comments?page=${currentPage + 1}${filter ? `&filter=${filter}` : ""}`}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
              Next
            </a>
          )}
        </div>
      )}
    </div>
  );
}
