"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types/shopify";
import WishlistButton from "./WishlistButton";

export interface GalleryImage {
  url: string;
  altText?: string | null;
}

export default function ProductGallery({
  images,
  title,
  product,
}: {
  images: GalleryImage[];
  title: string;
  product?: Product;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  if (!images.length) {
    return <div className="card flex aspect-square items-center justify-center text-ink-muted">Elfangary</div>;
  }
  const current = images[active];
  return (
    <div className="flex flex-col gap-3">
      <div
        className="card relative aspect-square overflow-hidden"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
      >
        <Image
          src={current.url}
          alt={current.altText || title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-transform duration-300 ease-buttery ${zoom ? "scale-110" : "scale-100"}`}
        />
        {product && (
          <WishlistButton product={product} variant="floating" className="end-3 top-3" />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto snap-x pb-2 w-full">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 snap-center overflow-hidden rounded-btn border-2 transition-colors ${
                i === active ? "border-brand-orange" : "border-transparent"
              }`}
            >
              <Image src={img.url} alt={img.altText || title} fill sizes="(max-width: 640px) 64px, 80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
