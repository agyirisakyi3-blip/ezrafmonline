export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between cms-animate-fade-in-up">
        <div>
          <div className="h-8 w-40 skeleton rounded mb-2" />
          <div className="h-4 w-60 skeleton rounded" />
        </div>
        <div className="h-10 w-32 skeleton rounded-xl" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`cms-animate-fade-in-up cms-delay-${i + 1} bg-white rounded-2xl border border-zinc-200/80 p-6`}>
            <div className="h-11 w-11 skeleton rounded-xl mb-5" />
            <div className="h-8 w-16 skeleton rounded mb-1" />
            <div className="h-4 w-24 skeleton rounded mb-4" />
            <div className="h-2 skeleton rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
