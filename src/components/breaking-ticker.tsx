import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
}

export default function BreakingTicker({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="bg-red-600 text-white text-sm overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8 flex items-center h-9">
        <span className="shrink-0 bg-white text-red-600 font-bold text-xs uppercase px-2 py-0.5 mr-3">
          Breaking
        </span>
        <div className="overflow-hidden relative flex-1">
          <div className="flex animate-scroll-left gap-12 whitespace-nowrap">
            {[...articles, ...articles].map((article, i) => (
              <Link
                key={`${article.id}-${i}`}
                href={`/articles/${article.slug}`}
                className="hover:underline text-white/90 hover:text-white transition-colors"
              >
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
