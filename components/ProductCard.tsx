import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types/shopify";
import { formatPriceRange } from "@/lib/utils/formatCurrency";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";

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

  return (
    <Link
      href={localePath(locale, "products", product.handle)}
      className="group card flex flex-col overflow-hidden transition-all duration-400 ease-buttery hover:-translate-y-1.5"
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
        {product.tags?.includes("best-seller") && (
          <span className="absolute start-3 top-3 pill bg-gradient-to-r from-brand-orange to-brand-olive shadow-sm text-white border-0 backdrop-blur-md">
            <Star className="h-3.5 w-3.5 fill-white" /> {labels.soldOut === "Sold out" ? "Best Seller" : "الأكثر مبيعًا"}
          </span>
        )}
        {!product.availableForSale && (
          <span className="absolute end-3 top-3 pill bg-ink-dark/70 text-white border-0">{labels.soldOut}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="line-clamp-2 font-medium tracking-tight text-ink-dark group-hover:text-brand-orange transition-colors duration-300">{product.title}</h3>
        {product.vendor && <p className="mt-1 text-sm text-ink-muted">{product.vendor}</p>}
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-lg font-bold text-brand-orange">{price}</span>
          {hasDiscount && (
            <span className="text-sm text-ink-muted line-through">
              {formatPriceRange(compareAt, compareAt, locale)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
