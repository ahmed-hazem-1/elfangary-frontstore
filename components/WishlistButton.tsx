"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types/shopify";

interface WishlistButtonProps {
  product: Product;
  variant?: "floating" | "icon" | "button" | "pill";
  labels?: {
    add?: string;
    remove?: string;
    inWishlist?: string;
    addToWishlist?: string;
  };
  className?: string;
}

export default function WishlistButton({
  product,
  variant = "floating",
  labels,
  className = "",
}: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((s) => s.items);
  const toggleItem = useWishlistStore((s) => s.toggleItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFavorited = mounted ? items.some((i) => i.id === product.id) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const added = toggleItem(product);
    if (added) {
      toast.success(labels?.add || "تمت إضافة المنتج إلى المفضلة ❤️");
    } else {
      toast.info(labels?.remove || "تمت إزالة المنتج من المفضلة");
    }
  };

  if (variant === "button" || variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`group relative flex items-center justify-center gap-2 rounded-btn px-4 py-3 text-sm font-semibold transition-all duration-300 ${
          isFavorited
            ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300"
            : "border border-ink-dark/15 bg-white text-ink-dark hover:border-brand-orange hover:bg-brand-orange/5 hover:text-brand-orange"
        } ${className}`}
        aria-label={isFavorited ? labels?.inWishlist || "في المفضلة" : labels?.addToWishlist || "إضافة للمفضلة"}
      >
        <Heart
          className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${
            isFavorited ? "fill-red-500 text-red-500" : "text-current"
          }`}
        />
        <span>
          {isFavorited
            ? labels?.inWishlist || "في المفضلة"
            : labels?.addToWishlist || "إضافة للمفضلة"}
        </span>
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`group flex h-10 w-10 items-center justify-center rounded-btn border transition-all duration-300 ${
          isFavorited
            ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
            : "border-ink-dark/10 bg-white text-ink-muted hover:border-brand-orange hover:text-brand-orange"
        } ${className}`}
        aria-label={isFavorited ? labels?.remove || "إزالة من المفضلة" : labels?.add || "إضافة للمفضلة"}
      >
        <Heart
          className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${
            isFavorited ? "fill-red-500 text-red-500" : "text-current"
          }`}
        />
      </button>
    );
  }

  // Default: floating glassmorphism circular badge for product cards and gallery
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group/heart absolute z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md border border-white/60 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 ${
        isFavorited
          ? "text-red-500 shadow-red-500/10"
          : "text-ink-dark/70 hover:text-red-500"
      } ${className}`}
      aria-label={isFavorited ? labels?.remove || "إزالة من المفضلة" : labels?.add || "إضافة للمفضلة"}
    >
      <Heart
        className={`h-4 w-4 transition-all duration-300 group-hover/heart:scale-110 ${
          isFavorited
            ? "fill-red-500 text-red-500 scale-105"
            : "text-current stroke-[2] fill-transparent"
        }`}
      />
    </button>
  );
}
