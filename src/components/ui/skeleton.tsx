export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded ${className}`} />;
}

export function ArticleCardSkeleton() {
  return (
    <div className="block bg-white rounded-md shadow-xs border border-zinc-100">
      <Skeleton className="h-32 w-full rounded-t-md" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

export function SidebarCardSkeleton() {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-zinc-100 last:border-0">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="w-20 h-16 shrink-0 rounded-sm" />
    </div>
  );
}

export function HeroSliderSkeleton() {
  return (
    <section className="relative overflow-hidden rounded-none md:rounded-lg">
      <Skeleton className="h-[240px] md:h-[500px] w-full" />
    </section>
  );
}
