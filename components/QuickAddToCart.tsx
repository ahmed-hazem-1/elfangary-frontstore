"use client";

import { useTransition } from "react";
import { Plus, Minus, Loader2 } from "lucide-react";
import { addToCartAction, updateLineAction, removeLineAction } from "@/app/actions/cart";
import { useCartStore } from "@/store/cartStore";

export default function QuickAddToCart({ variantId, availableForSale }: { variantId: string; availableForSale: boolean }) {
  const [isPending, startTransition] = useTransition();
  const setCart = useCartStore((s) => s.setCart);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const lines = useCartStore((s) => s.lines);
  
  const cartLine = lines.find((l) => l.merchandise.id === variantId);
  const quantity = cartLine ? cartLine.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!availableForSale || isPending) return;

    startTransition(async () => {
      const updatedCart = await addToCartAction(variantId, 1);
      if (updatedCart) {
        setCart(updatedCart);
      }
    });
  };

  const handleUpdate = (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartLine || isPending) return;

    startTransition(async () => {
      let updatedCart;
      if (newQuantity === 0) {
        updatedCart = await removeLineAction(cartLine.id);
      } else {
        updatedCart = await updateLineAction(cartLine.id, newQuantity);
      }
      if (updatedCart) setCart(updatedCart);
    });
  };

  if (!availableForSale) return null;

  if (quantity > 0) {
    return (
      <div 
        className="flex items-center justify-between rounded-full bg-brand-orange text-white p-1 shadow-premium w-20 h-8 sm:w-24 sm:h-9 relative z-20 transition-all duration-300"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        <button 
          onClick={(e) => handleUpdate(e, quantity - 1)}
          className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          disabled={isPending}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold w-4 text-center">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : quantity}
        </span>
        <button 
          onClick={(e) => handleUpdate(e, quantity + 1)}
          className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          disabled={isPending}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={isPending}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange text-white shadow-premium hover:scale-105 transition-transform relative z-20"
      aria-label="Add to cart"
    >
      {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
    </button>
  );
}
