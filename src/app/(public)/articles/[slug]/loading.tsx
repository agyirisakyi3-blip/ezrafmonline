export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-5 w-20 bg-zinc-200 rounded mb-4" />
          <div className="h-10 w-3/4 bg-zinc-200 rounded mb-4" />
          <div className="h-4 w-1/3 bg-zinc-200 rounded mb-8" />
          <div className="aspect-video bg-zinc-200 rounded-lg mb-8" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-zinc-200 rounded" />
            <div className="h-4 w-5/6 bg-zinc-200 rounded" />
            <div className="h-4 w-4/5 bg-zinc-200 rounded" />
            <div className="h-4 w-full bg-zinc-200 rounded" />
            <div className="h-4 w-3/4 bg-zinc-200 rounded" />
          </div>
        </div>
        <div className="hidden lg:block space-y-6">
          <div className="h-60 bg-zinc-200 rounded-lg" />
          <div className="h-80 bg-zinc-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
