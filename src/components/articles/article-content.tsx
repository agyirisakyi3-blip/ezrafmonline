"use client";

import { useRef, useState } from "react";
import ImageLightbox from "@/components/ui/image-lightbox";

export default function ArticleContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG" && target.parentElement?.tagName !== "PICTURE") {
      setLightbox({ src: (target as HTMLImageElement).src, alt: (target as HTMLImageElement).alt });
    }
  };

  return (
    <>
      <div
        ref={ref}
        onClick={handleClick}
        className="prose prose-zinc max-w-none prose-headings:font-bold prose-headings:text-zinc-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:cursor-pointer prose-img:transition-opacity hover:prose-img:opacity-90"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
