"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types/shopify";
import { formatPriceRange } from "@/lib/utils/formatCurrency";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import { useAddToCart } from "./AddToCartClient";

export default function FloatingProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const [qty, setQty] = useState(1);
  const { add, pending } = useAddToCart();
  const variant = product.variants?.edges?.[0]?.node;
  const price = formatPriceRange(
    product.priceRange?.minVariantPrice,
    product.priceRange?.maxVariantPrice,
    locale
  );
  const images = (product.images as any)?.edges?.map((e: any) => e.node) || [];
  const thumbs = (images.length ? images : product.featuredImage ? [product.featuredImage] : []).slice(0, 3);

  function handleAdd() {
    if (!variant) return;
    add(variant.id, qty);
  }

  return (
    <div className="cream-card w-full max-w-sm p-5 shadow-card">
      <div className="mb-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-brand-orange text-brand-orange" />
        ))}
      </div>
      <h3 className="text-xl font-bold text-ink-dark">{product.title}</h3>
      <p className="mt-1 text-sm text-ink-muted">
        {product.tags?.includes("best-seller") ? (locale === "ar" ? "الأكثر مبيعًا" : "Best Seller") : (product.productType || "")}
      </p>

      {thumbs.length > 0 && (
        <div className="mt-4 flex gap-2">
          {thumbs.map((img: any, i: number) => (
            <Image
              key={i}
              src={img.url}
              alt={img.altText || product.title}
              width={64}
              height={64}
              className="h-16 w-16 rounded-btn border border-border-glass object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-brand-orange">{price}</span>
        <div className="flex items-center rounded-btn border border-ink-dark/10 bg-white">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-2.5 py-1.5" aria-label="decrease">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-7 text-center text-sm font-medium">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="px-2.5 py-1.5" aria-label="increase">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={handleAdd} disabled={pending || !product.availableForSale} className="btn-primary flex-1">
          {locale === "ar" ? "أضف إلى السلة" : "Add to Cart"}
        </button>
        <Link href={localePath(locale, "products", product.handle)} className="btn-secondary">
          {locale === "ar" ? "تفاصيل" : "Details"}
        </Link>
      </div>
    </div>
  );
}
