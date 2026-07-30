"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "@/store/cartStore";
import { updateLineAction, removeLineAction, applyDiscountCodeAction, removeDiscountCodeAction } from "@/app/actions/cart";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default function CartDrawerInner({ locale, labels }: {
  locale: string;
  labels: { subtotal: string; checkout: string; empty: string; title: string; quantity: string; remove: string; discountCode: string; apply: string };
}) {
  const [pending, startTransition] = useTransition();
  const { lines, totalQuantity, cost, discountCodes, checkoutUrl, setCart, closeDrawer, reset } = useCartStore(
    useShallow((s) => ({
      lines: s.lines,
      totalQuantity: s.totalQuantity,
      cost: s.cost,
      discountCodes: s.discountCodes,
      checkoutUrl: s.checkoutUrl,
      setCart: s.setCart,
      closeDrawer: s.closeDrawer,
      reset: s.reset,
    }))
  );
  const currency = cost?.totalAmount?.currencyCode || lines[0]?.merchandise?.price?.currencyCode || "SAR";
  // Sum prices × quantities from line items for the true "before discount" total
  const beforeDiscount = lines.reduce(
    (sum, l) => sum + Number(l.merchandise?.price?.amount ?? 0) * (l.quantity ?? 1),
    0
  );

  // Sum all per-line discount allocations — this is the actual discount applied
  const totalDiscountFromLines = lines.reduce(
    (sum, l) =>
      sum + (l.discountAllocations?.reduce((s, d) => s + Number(d.discountedAmount?.amount ?? 0), 0) ?? 0),
    0
  );

  const isApplicable = discountCodes && discountCodes.length > 0 && discountCodes.some((d) => d.applicable);
  const discountAmount = isApplicable ? totalDiscountFromLines : 0;
  const afterDiscount = Math.max(0, beforeDiscount - discountAmount);
  const router = useRouter();
  const [discountCode, setDiscountCode] = useState("");

  function updateQty(lineId: string, qty: number) {
    startTransition(async () => {
      const cart = await updateLineAction(lineId, Math.max(0, qty));
      if (cart) {
        setCart(cart);
      } else {
        // null = cart is now empty — full reset
        reset();
        closeDrawer();
      }
    });
  }

  function removeLine(lineId: string) {
    startTransition(async () => {
      const cart = await removeLineAction(lineId);
      if (cart) {
        // Cart still has items — update state normally
        setCart(cart);
      } else {
        // Server returned null → cart is now empty, do a full reset
        reset();
        closeDrawer();
      }
    });
  }

  function applyDiscount(e: React.FormEvent) {
    e.preventDefault();
    if (!discountCode.trim()) return;
    
    startTransition(async () => {
      const cart = await applyDiscountCodeAction(discountCode);
      if (cart) {
        setCart(cart);
        const isApplicable = cart.discountCodes?.some((d) => d.applicable);
        if (isApplicable) {
          toast.success(labels.apply + " ✓");
        }
        setDiscountCode("");
      }
    });
  }

  if (!lines.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-ink-muted">{labels.empty}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <ul className="space-y-4">
          {lines.map((line) => (
            <li key={line.id} className="flex gap-3">
              {line.merchandise.image?.url && (
                <img
                  src={line.merchandise.image.url}
                  alt={line.merchandise.image.altText || line.merchandise.title}
                  className="h-20 w-20 rounded-btn object-cover shrink-0"
                />
              )}
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-sm font-semibold">{line.merchandise.product.title}</p>
                <p className="text-xs text-ink-muted">{line.merchandise.title}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="text-sm font-medium text-brand-orange">
                    {formatCurrency(line.merchandise.price, locale)}
                  </p>
                  {line.merchandise.compareAtPrice && Number(line.merchandise.compareAtPrice.amount) > Number(line.merchandise.price.amount) && (
                    <p className="text-xs text-ink-muted line-through">
                      {formatCurrency(line.merchandise.compareAtPrice, locale)}
                    </p>
                  )}
                </div>
                {line.discountAllocations && line.discountAllocations.length > 0 ? (
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-brand-orange">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>شمل الخصم</span>
                  </div>
                ) : discountCodes && discountCodes.length > 0 ? (
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-red-500">
                    <XCircle className="h-3 w-3" />
                    <span>الكود غير مطبق على هذا المنتج</span>
                  </div>
                ) : null}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center rounded-btn border border-ink-dark/10">
                    <button
                      onClick={() => updateQty(line.id, line.quantity - 1)}
                      className="px-2 py-1.5 hover:bg-ink-dark/5"
                      aria-label="decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-7 text-center text-sm">{line.quantity}</span>
                    <button
                      onClick={() => updateQty(line.id, line.quantity + 1)}
                      className="px-2 py-1.5 hover:bg-ink-dark/5"
                      aria-label="increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeLine(line.id)}
                    className="btn-ghost h-8 w-8 p-0 text-ink-muted hover:text-red-500"
                    aria-label={labels.remove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-ink-dark/5 bg-white/80 p-5">
        {/* Total before discount */}
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm text-ink-muted">
            {locale === "ar" ? "الإجمالي قبل الخصم" : "Total before discount"}
          </span>
          <span className="text-base font-bold">
            {formatCurrency({ amount: String(beforeDiscount), currencyCode: currency }, locale)}
          </span>
        </div>

        {/* Discount code row — only when truly applicable */}
        {isApplicable && (
          <div className="mb-2 flex items-center justify-between text-sm text-brand-orange">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>كود الخصم ({discountCodes![0].code})</span>
            </span>
            <span className="font-bold">
              - {formatCurrency({ amount: String(discountAmount), currencyCode: currency }, locale)}
            </span>
          </div>
        )}

        {/* Total after discount */}
        <div className="mb-4 flex items-center justify-between border-t border-ink-dark/10 pt-3">
          <span className="text-base font-bold text-ink-dark">
            {locale === "ar" ? "الإجمالي بعد الخصم" : "Total after discount"}
          </span>
          <span className="text-xl font-bold text-brand-orange">
            {formatCurrency({ amount: String(afterDiscount), currencyCode: currency }, locale)}
          </span>
        </div>
        
        {/* Discount code section */}
        {discountCodes && discountCodes.length > 0 ? (
          // Code already applied — show badge with remove button, block adding another
          <div className="mb-4 flex items-center justify-between rounded-btn border border-brand-orange/30 bg-brand-orange/5 px-3 py-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0" />
              <div>
                <p className="text-xs font-bold text-brand-orange">{discountCodes[0].code}</p>
                <p className="text-[10px] text-ink-muted">
                  {isApplicable
                    ? (locale === "ar" ? "الكود مفعّل على بعض المنتجات" : "Code applied to eligible items")
                    : (locale === "ar" ? "الكود غير مطبق على منتجات السلة" : "Code not applicable to cart items")}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                startTransition(async () => {
                  const cart = await removeDiscountCodeAction();
                  if (cart) setCart(cart);
                });
              }}
              disabled={pending}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              <XCircle className="h-3.5 w-3.5" />
              {locale === "ar" ? "إزالة" : "Remove"}
            </button>
          </div>
        ) : (
          // No code applied — show input form
          <form className="mb-4 flex gap-2" onSubmit={applyDiscount}>
            <input
              placeholder={labels.discountCode}
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="input-field h-10 flex-1 text-sm"
              disabled={pending}
            />
            <button type="submit" className="btn-secondary h-10" disabled={pending}>
              {labels.apply}
            </button>
          </form>
        )}

        <button
          onClick={() => {
            if (checkoutUrl) window.location.href = checkoutUrl;
          }}
          className="btn-primary w-full"
          disabled={pending || !checkoutUrl}
        >
          {labels.checkout}
        </button>
      </div>
    </div>
  );
}
