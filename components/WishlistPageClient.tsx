"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, ArrowRight, Share2, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore, WishlistItem } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { addToCartAction } from "@/app/actions/cart";
import { formatPriceRange } from "@/lib/utils/formatCurrency";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";

export default function WishlistPageClient({
  locale,
  labels,
}: {
  locale: Locale;
  labels: {
    title: string;
    emptyTitle: string;
    emptySubtitle: string;
    exploreShop: string;
    moveToCart: string;
    moveAllToCart: string;
    allMovedToCart: string;
    clearAll: string;
    confirmClear: string;
    itemsCount: string;
    shareWishlist: string;
    copiedLink: string;
    soldOut: string;
    remove: string;
  };
}) {
  const [mounted, setMounted] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isMovingAll, setIsMovingAll] = useState(false);
  const [copied, setCopied] = useState(false);

  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  const setCart = useCartStore((s) => s.setCart);
  const openDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="section min-h-[50vh] py-16 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-orange border-t-transparent"></div>
      </div>
    );
  }

  const handleAddToCart = async (item: WishlistItem) => {
    if (!item.variantId) {
      toast.error(labels.soldOut);
      return;
    }

    setPendingId(item.id);
    try {
      const updatedCart = await addToCartAction(item.variantId, 1);
      if (updatedCart) {
        setCart(updatedCart);
        toast.success(labels.moveToCart + " ✓");
        openDrawer();
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الإضافة للسلة");
    } finally {
      setPendingId(null);
    }
  };

  const handleAddAllToCart = async () => {
    if (!items.length) return;
    setIsMovingAll(true);
    try {
      for (const item of items) {
        if (item.variantId && item.availableForSale) {
          const updated = await addToCartAction(item.variantId, 1);
          if (updated) setCart(updated);
        }
      }
      toast.success(labels.allMovedToCart || "تمت إضافة جميع المنتجات للسلة");
      openDrawer();
    } catch (err) {
      console.error(err);
    } finally {
      setIsMovingAll(false);
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: labels.title,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success(labels.copiedLink);
    setTimeout(() => setCopied(false), 2500);
  };

  if (items.length === 0) {
    return (
      <div className="section min-h-[60vh] py-16 flex flex-col items-center justify-center text-center">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-brand-orange/10 via-brand-gold/20 to-brand-olive/10 shadow-inner">
          <Heart className="h-12 w-12 text-brand-orange/60" />
          <Sparkles className="absolute -top-1 -end-1 h-6 w-6 text-brand-gold animate-pulse" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-dark">{labels.emptyTitle}</h1>
        <p className="mt-3 max-w-md text-sm sm:text-base text-ink-muted leading-relaxed">
          {labels.emptySubtitle}
        </p>
        <Link
          href={localePath(locale, "shop")}
          className="btn-primary mt-8 inline-flex items-center gap-2 px-8 py-3.5 shadow-premium hover:scale-105 transition-all"
        >
          <span>{labels.exploreShop}</span>
          <ArrowRight className={`h-4 w-4 ${locale === "ar" ? "rotate-180" : ""}`} />
        </Link>
      </div>
    );
  }

  return (
    <div className="section py-8 sm:py-12">
      {/* Header Bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ink-dark/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-dark tracking-tight">
            {labels.title}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {labels.itemsCount.replace("{count}", String(items.length))}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleShare}
            className="btn-secondary h-10 px-3 sm:px-4 text-xs sm:text-sm flex items-center gap-2"
          >
            {copied ? <Check className="h-4 w-4 text-brand-olive" /> : <Share2 className="h-4 w-4" />}
            <span>{copied ? labels.copiedLink : labels.shareWishlist}</span>
          </button>

          <button
            onClick={handleAddAllToCart}
            disabled={isMovingAll}
            className="btn-primary h-10 px-4 sm:px-5 text-xs sm:text-sm flex items-center gap-2 shadow-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{isMovingAll ? "..." : labels.moveAllToCart}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm(labels.confirmClear)) {
                clearWishlist();
                toast.info("تم إفراغ قائمة المفضلة");
              }
            }}
            className="btn-ghost h-10 px-3 text-xs sm:text-sm text-red-500 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">{labels.clearAll}</span>
          </button>
        </div>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const price = item.priceRange
            ? formatPriceRange(item.priceRange.minVariantPrice, item.priceRange.maxVariantPrice, locale)
            : "";
          const compareAt = item.compareAtPriceRange?.minVariantPrice;
          const hasDiscount =
            compareAt &&
            item.priceRange &&
            Number(compareAt.amount) > Number(item.priceRange.minVariantPrice.amount);

          return (
            <div
              key={item.id}
              className="group card flex flex-col justify-between overflow-hidden p-3 sm:p-4 border border-ink-dark/10 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-btn bg-brand-gold/10">
                <Link href={localePath(locale, "products", item.handle)} className="block h-full w-full">
                  {item.featuredImage?.url ? (
                    <Image
                      src={item.featuredImage.url}
                      alt={item.featuredImage.altText || item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-muted text-sm">
                      Elfangary
                    </div>
                  )}
                </Link>

                <button
                  onClick={() => {
                    removeItem(item.id);
                    toast.info(labels.remove + " ✓");
                  }}
                  className="absolute end-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md text-ink-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                  aria-label={labels.remove}
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {!item.availableForSale && (
                  <span className="absolute start-2.5 top-2.5 pill bg-ink-dark/80 text-white text-[11px] border-0">
                    {labels.soldOut}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-1 flex-col justify-between">
                <div>
                  {item.vendor && (
                    <p className="text-[11px] font-medium text-ink-muted">{item.vendor}</p>
                  )}
                  <Link
                    href={localePath(locale, "products", item.handle)}
                    className="mt-0.5 line-clamp-2 text-sm sm:text-base font-semibold text-ink-dark hover:text-brand-orange transition-colors"
                  >
                    {item.title}
                  </Link>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-base font-bold text-brand-orange">{price}</span>
                  {hasDiscount && (
                    <span className="text-xs text-ink-muted line-through">
                      {formatPriceRange(compareAt, compareAt, locale)}
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-2 border-t border-ink-dark/5 flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.availableForSale || pendingId === item.id}
                    className="btn-primary flex-1 h-9 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>{pendingId === item.id ? "..." : labels.moveToCart}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
