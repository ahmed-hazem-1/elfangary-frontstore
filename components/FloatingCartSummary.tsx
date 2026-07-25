"use client";

import { useCartStore } from "@/store/cartStore";
import { ShoppingBag } from "lucide-react";
import { useLocale } from "next-intl";

export default function FloatingCartSummary() {
  const { totalQuantity, cost, isOpen, openDrawer } = useCartStore();
  const locale = useLocale();

  // If drawer is open, or cart is empty, hide the floating bar
  if (isOpen || totalQuantity === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[45] w-full max-w-xs px-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <button 
        onClick={openDrawer}
        className="w-full flex items-center justify-between gap-4 rounded-full bg-ink-dark/95 backdrop-blur-md px-5 py-3 text-white shadow-premium hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[11px] font-bold">
              {totalQuantity}
            </span>
          </div>
          <span className="text-sm font-medium">{locale === "ar" ? "إتمام الشراء" : "Checkout"}</span>
        </div>
        
        {cost?.totalAmount && (
          <div className="flex items-center font-bold text-brand-orange tracking-tight">
            <span>{cost.totalAmount.amount} {locale === "ar" && cost.totalAmount.currencyCode === "EGP" ? "ج.م" : cost.totalAmount.currencyCode}</span>
          </div>
        )}
      </button>
    </div>
  );
}
