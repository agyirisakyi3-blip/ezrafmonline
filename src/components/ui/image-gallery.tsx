"use client";

import { useState } from "react";
import ImageLightbox from "./image-lightbox";

interface GalleryImage {
  src: string;
  alt: string;
}

export default function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightbox(img)}
            className={`relative overflow-hidden rounded-lg bg-zinc-100 group ${
              i === 0 && images.length > 2 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        ))}
      </div>
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
