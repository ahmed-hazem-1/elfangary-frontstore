import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, MoneyV2, MediaImage } from "@/types/shopify";

export interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  vendor?: string | null;
  featuredImage?: MediaImage | null;
  priceRange?: {
    minVariantPrice: MoneyV2;
    maxVariantPrice?: MoneyV2;
  };
  compareAtPriceRange?: {
    minVariantPrice: MoneyV2;
  };
  variantId?: string;
  availableForSale: boolean;
  addedAt: number;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  toggleItem: (product: Product) => boolean;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export function extractWishlistItem(product: Product): WishlistItem {
  const variantId = product.variants?.edges?.[0]?.node?.id;
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    vendor: product.vendor,
    featuredImage: product.featuredImage,
    priceRange: product.priceRange,
    compareAtPriceRange: product.compareAtPriceRange,
    variantId: variantId,
    availableForSale: product.availableForSale ?? true,
    addedAt: Date.now(),
  };
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const item = extractWishlistItem(product);
        set((state) => {
          if (state.items.some((i) => i.id === product.id)) return state;
          return { items: [item, ...state.items] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      toggleItem: (product) => {
        const exists = get().items.some((i) => i.id === product.id);
        if (exists) {
          get().removeItem(product.id);
          return false;
        } else {
          get().addItem(product);
          return true;
        }
      },
      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "elfangary-wishlist",
    }
  )
);
