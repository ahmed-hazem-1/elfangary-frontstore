"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import { addToCartAction } from "@/app/actions/cart";
import type { Cart } from "@/types/shopify";

export function useAddToCart() {
  const [pending, startTransition] = useTransition();
  const setCart = useCartStore((s) => s.setCart);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const t = useTranslations("Common");

  const add = (merchandiseId: string, quantity = 1) => {
    startTransition(async () => {
      const cart: Cart | null = await addToCartAction(merchandiseId, quantity);
      if (cart) {
        setCart(cart);
        openDrawer();
        toast.success(t("addToCart"));
      } else {
        toast.error("Failed to add to cart");
      }
    });
  };

  return { add, pending };
}
