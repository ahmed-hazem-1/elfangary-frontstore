"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { getCart } from "@/lib/queries/cart";

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const cartId = useCartStore((s) => s.cartId);
  const setCart = useCartStore((s) => s.setCart);

  useEffect(() => {
    if (!cartId) return;
    let active = true;
    getCart(cartId).then((cart) => {
      if (active && cart) {
        setCart(cart);
      }
    });
    return () => {
      active = false;
    };
  }, [cartId, setCart]);

  return <>{children}</>;
}
