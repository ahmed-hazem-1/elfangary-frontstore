import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types/shopify";
import { formatPriceRange } from "@/lib/utils/formatCurrency";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import QuickAddToCart from "./QuickAddToCart";

export default function ProductCard({ product, locale, labels }: {
  product: Product;
  locale: Locale;
  labels: { addToCart: string; soldOut: string };
}) {
  const price = formatPriceRange(
    product.priceRange?.minVariantPrice,
    product.priceRange?.maxVariantPrice,
    locale
  );
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount = compareAt && Number(compareAt.amount) > Number(product.priceRange?.minVariantPrice?.amount || 0);
  const img = product.featuredImage;
  const variantId = product.variants?.edges?.[0]?.node?.id;

  return (
    <Link
      href={localePath(locale, "products", product.handle)}
      className="group card flex flex-col overflow-hidden transition-colors duration-400 ease-buttery hover:bg-brand-orange hover:text-white border-transparent hover:border-transparent"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-card bg-brand-gold">
        {img ? (
          <Image
            src={img.url}
            alt={img.altText || product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-buttery group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-muted">Elfangary</div>
        )}

        {/* Gradient Overlay for Title */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
          <h3 className="line-clamp-2 font-medium tracking-tight text-white drop-shadow-sm">{product.title}</h3>
          {product.vendor && <p className="mt-0.5 text-xs text-white/80">{product.vendor}</p>}
        </div>

        {product.tags?.includes("best-seller") && (
          <span className="absolute start-3 top-3 pill bg-gradient-to-r from-brand-orange to-brand-olive shadow-sm text-white border-0 backdrop-blur-md">
            <Star className="h-3.5 w-3.5 fill-white" /> {labels.soldOut === "Sold out" ? "Best Seller" : "الأكثر مبيعًا"}
          </span>
        )}
        {!product.availableForSale && (
          <span className="absolute end-3 top-3 pill bg-ink-dark/70 text-white border-0">{labels.soldOut}</span>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-5">
        <div className="flex flex-col">
          <span className="text-sm sm:text-lg font-bold text-brand-orange group-hover:text-white transition-colors">{price}</span>
          {hasDiscount && (
            <span className="text-sm text-ink-muted group-hover:text-white/80 line-through transition-colors">
              {formatPriceRange(compareAt, compareAt, locale)}
            </span>
          )}
        </div>
        
        {variantId && (
          <div className="shrink-0">
            <QuickAddToCart variantId={variantId} availableForSale={product.availableForSale} />
          </div>
        )}
      </div>
    </Link>
  );
}
