export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 bg-zinc-200 rounded mb-2" />
          <div className="h-4 w-60 bg-zinc-200 rounded" />
        </div>
        <div className="h-10 w-32 bg-zinc-200 rounded-xl" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <div className="h-11 w-11 bg-zinc-200 rounded-xl mb-5" />
            <div className="h-8 w-16 bg-zinc-200 rounded mb-1" />
            <div className="h-4 w-24 bg-zinc-200 rounded mb-4" />
            <div className="h-2 bg-zinc-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
