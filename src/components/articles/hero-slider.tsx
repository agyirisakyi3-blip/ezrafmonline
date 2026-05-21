"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { imageUrl } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  viewCount?: number;
  category?: { name: string; slug: string } | null;
  author?: { name: string } | null;
}

function Slide({ article, priority }: { article: Article; priority: boolean }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="relative h-[240px] md:h-[500px] w-full block overflow-hidden bg-zinc-800"
    >
      {article.featuredImage ? (
        <Image
          src={imageUrl(article.featuredImage)}
          alt={article.title}
          fill
          className="object-cover object-top"
          priority={priority}
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
          <h1 className="text-lg md:text-2xl lg:text-4xl font-bold mb-2 text-white leading-tight line-clamp-3 md:line-clamp-none">
            {article.title}
          </h1>
          <p className="hidden md:block text-sm text-white/70 line-clamp-2 max-w-2xl">
            {article.excerpt}
          </p>
          <div className="hidden md:flex items-center gap-3 mt-2 text-xs text-white/50">
            {article.viewCount !== undefined && (
              <span>{article.viewCount.toLocaleString()} views</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HeroSlider({
  articles,
}: {
  articles: Article[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (articles.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-none md:rounded-lg">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        loop={articles.length > 1}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="hero-slider"
      >
        {articles.map((article, i) => (
          <SwiperSlide key={article.id}>
            <Slide article={article} priority={i < 2} />
          </SwiperSlide>
        ))}
      </Swiper>
      {articles.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 hidden md:block">
          <span className="text-white/60 text-sm font-mono">
            {activeIndex + 1} / {articles.length}
          </span>
        </div>
      )}
    </section>
  );
}
