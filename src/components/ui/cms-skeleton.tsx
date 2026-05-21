export function CmsPageSkeleton() {
  return (
    <div className="space-y-7 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 bg-zinc-200 rounded-lg" />
          <div className="h-4 w-56 bg-zinc-100 rounded" />
        </div>
        <div className="h-10 w-32 bg-zinc-200 rounded-xl" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-zinc-200/70 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 bg-zinc-100 rounded-lg" />
              <div className="h-5 w-12 bg-zinc-100 rounded-md" />
            </div>
            <div className="h-8 w-20 bg-zinc-200 rounded" />
            <div className="h-3 w-24 bg-zinc-100 rounded" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <div className="h-5 w-28 bg-zinc-200 rounded" />
        </div>
        <div className="divide-y divide-zinc-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <div className="h-10 w-16 bg-zinc-100 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-zinc-200 rounded" />
                <div className="h-3 w-1/3 bg-zinc-100 rounded" />
              </div>
              <div className="h-6 w-16 bg-zinc-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CmsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={i} className="px-5 py-4">
                  <div className="h-3 w-16 bg-zinc-200 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                {Array.from({ length: 5 }).map((_, c) => (
                  <td key={c} className="px-5 py-4">
                    <div className="h-4 bg-zinc-100 rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
