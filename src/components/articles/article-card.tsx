import Image from "next/image";
import Link from "next/link";
import { getReadingTime, imageUrl } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  publishedAt: Date | null;
  viewCount?: number;
  category?: { name: string; slug: string } | null;
  author?: { name: string } | null;
}

export function HeroCard({ article }: { article: Article }) {
  return (
    <section className="relative h-[240px] md:h-[500px] w-full overflow-hidden rounded-none md:rounded-lg bg-zinc-800">
      {article.featuredImage ? (
        <Image
          src={imageUrl(article.featuredImage)}
          alt={article.title}
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-accent to-accent-dark" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <div className="max-w-4xl">
          {article.category && (
            <span className="mb-2 inline-block bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              {article.category.name}
            </span>
          )}
          <h1 className="text-lg md:text-4xl font-bold mb-2 text-white leading-tight line-clamp-3 md:line-clamp-none">
            {article.title}
          </h1>
          <p className="hidden md:block text-sm text-white/70 line-clamp-2 max-w-2xl">
            {article.excerpt}
          </p>
          <div className="hidden md:flex items-center gap-3 mt-2 text-xs text-white/50">
            <span>{getReadingTime(article.content)} min read</span>
            {article.viewCount !== undefined && (
              <span>&middot; {article.viewCount.toLocaleString()} views</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TopStoryCard({ article, priority }: { article: Article; priority?: boolean }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group flex space-x-4">
      <div className="relative w-24 h-20 shrink-0 overflow-hidden rounded-sm bg-zinc-100">
        {article.featuredImage ? (
          <Image
            src={imageUrl(article.featuredImage)}
            alt={article.title}
            fill
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            sizes="96px"
            priority={priority}
          />
        ) : (
          <div className="h-full w-full bg-zinc-200" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-zinc-900 line-clamp-3 group-hover:text-primary transition-colors duration-300">
          {article.title}
        </h3>
        <p className="mt-0.5 text-[10px] text-zinc-400">
          {getReadingTime(article.content)} min read
          {article.viewCount !== undefined && ` · ${article.viewCount.toLocaleString()} views`}
        </p>
      </div>
    </Link>
  );
}

export function GridCard({ article, priority }: { article: Article; priority?: boolean }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block bg-white rounded-md shadow-xs hover:shadow-md transition-all duration-300 border border-zinc-100 relative"
    >
      <div className="relative h-32 w-full overflow-hidden rounded-t-md bg-zinc-100">
        {article.featuredImage ? (
          <Image
            src={imageUrl(article.featuredImage)}
            alt={article.title}
            fill
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-100 to-zinc-200" />
        )}
      </div>
      <div className="p-3">
        {article.category && (
          <span className="mb-1 inline-block bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5">
            {article.category.name}
          </span>
        )}
        <h3 className="font-semibold text-zinc-900 line-clamp-4 text-sm group-hover:text-primary transition-colors duration-300">
          {article.title}
        </h3>
        <p className="mt-1 text-[10px] text-zinc-400">
          {getReadingTime(article.content)} min read
          {article.viewCount !== undefined && ` · ${article.viewCount.toLocaleString()} views`}
        </p>
      </div>
    </Link>
  );
}

export function SidebarCard({
  article,
  rank,
}: {
  article: Article;
  rank?: number;
}) {
  return (
    <Link href={`/articles/${article.slug}`} className="group flex items-start gap-3 pb-4 border-b border-zinc-100 last:border-0">
      {rank !== undefined && (
        <div className="shrink-0 w-6 text-center">
          <span className="text-base font-semibold text-zinc-400">{rank}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-zinc-900 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {article.title}
        </h4>
        {article.category && (
          <span className="mt-0.5 inline-block text-[10px] font-semibold uppercase tracking-wider text-primary">
            {article.category.name}
          </span>
        )}
        <p className="text-[10px] text-zinc-400">
          {getReadingTime(article.content)} min read
          {article.viewCount !== undefined && ` · ${article.viewCount.toLocaleString()} views`}
        </p>
      </div>
      <div className="relative w-20 h-16 shrink-0 overflow-hidden rounded-sm bg-zinc-100">
        {article.featuredImage ? (
          <Image
            src={imageUrl(article.featuredImage)}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="80px"
          />
        ) : (
          <div className="h-full w-full bg-zinc-200" />
        )}
      </div>
    </Link>
  );
}
