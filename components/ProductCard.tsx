"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Plus, Minus } from "lucide-react";
import type { Product, CartLine } from "@/types/shopify";
import { formatPriceRange } from "@/lib/utils/formatCurrency";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import { useCartStore } from "@/store/cartStore";
import { addToCartAction, updateLineAction, removeLineAction } from "@/app/actions/cart";
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

  const setCart = useCartStore((s) => s.setCart);
  const lines = useCartStore((s) => s.lines);
  const cartLine = lines.find((l) => l.merchandise.id === variantId);
  const quantity = cartLine ? cartLine.quantity : 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.availableForSale || !variantId) return;

    // Optimistic store update
    const prevLines = [...lines];
    useCartStore.getState().setLines([...prevLines, { 
      id: "temp-" + variantId, 
      quantity: 1, 
      merchandise: { 
        id: variantId,
        title: product.title,
        product: { title: product.title },
        image: img,
        price: product.priceRange?.minVariantPrice || { amount: "0", currencyCode: "SAR" }
      }
    } as unknown as CartLine]);

    const updatedCart = await addToCartAction(variantId, 1);
    if (updatedCart) {
      setCart(updatedCart);
    } else {
      useCartStore.getState().setLines(prevLines);
    }
  };

  const handleUpdate = async (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartLine) return;

    // Optimistic store update
    const prevLines = [...lines];
    const newLines = [...lines];
    const lineIndex = newLines.findIndex(l => l.id === cartLine.id);
    if (newQuantity === 0) {
      newLines.splice(lineIndex, 1);
    } else {
      newLines[lineIndex] = { ...newLines[lineIndex], quantity: newQuantity };
    }
    useCartStore.getState().setLines(newLines);

    let updatedCart;
    if (newQuantity === 0) {
      updatedCart = await removeLineAction(cartLine.id);
    } else {
      updatedCart = await updateLineAction(cartLine.id, newQuantity);
    }
    
    if (updatedCart) {
      setCart(updatedCart);
    } else {
      useCartStore.getState().setLines(prevLines);
    }
  };

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
        
        {variantId && product.availableForSale && (
          <div className="shrink-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            {quantity > 0 ? (
              <div className="flex items-center justify-between rounded-full bg-brand-orange text-white p-1 shadow-premium w-24 h-9 relative z-20 transition-all duration-300 group-hover:bg-white group-hover:text-brand-orange">
                <button 
                  onClick={(e) => handleUpdate(e, quantity - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 group-hover:bg-brand-orange/10 group-hover:hover:bg-brand-orange/20 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold w-6 text-center">
                  {quantity}
                </span>
                <button 
                  onClick={(e) => handleUpdate(e, quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 group-hover:bg-brand-orange/10 group-hover:hover:bg-brand-orange/20 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="flex h-9 items-center justify-center rounded-full bg-brand-orange px-4 text-sm font-semibold text-white shadow-premium transition-colors relative z-20 group-hover:bg-white group-hover:text-brand-orange"
                aria-label={labels.addToCart}
              >
                {labels.addToCart || "Add"}
              </button>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
