"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Minus, Plus, Trash2, ShoppingBag, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "@/store/cartStore";
import { updateLineAction, removeLineAction, applyDiscountCodeAction } from "@/app/actions/cart";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import SaveCartToWhatsApp from "./SaveCartToWhatsApp";

export default function CartPageClient({ labels }: {
  labels: {
    title: string; empty: string; continueShopping: string; summary: string;
    subtotal: string; total: string; checkout: string; quantity: string; removeItem: string;
    discountCode: string; apply: string;
  };
}) {
  const [pending, startTransition] = useTransition();
  const { lines, totalQuantity, cost, discountCodes, checkoutUrl, setCart } = useCartStore(
    useShallow((s) => ({
      lines: s.lines,
      totalQuantity: s.totalQuantity,
      cost: s.cost,
      discountCodes: s.discountCodes,
      checkoutUrl: s.checkoutUrl,
      setCart: s.setCart,
    }))
  );
  const locale = useLocale();
  const router = useRouter();
  
  // Use the cart-level cost if available, otherwise fallback to computing it
  const currency = cost?.totalAmount?.currencyCode || lines[0]?.merchandise?.price?.currencyCode || "SAR";
  const subtotalAmount = cost?.subtotalAmount?.amount || lines.reduce((s, l) => s + Number(l.estimatedCost?.subtotalAmount?.amount || 0), 0);
  const totalAmount = cost?.totalAmount?.amount || subtotalAmount;
  
  // State for discount code
  const [discountCode, setDiscountCode] = useState("");

  function updateQty(lineId: string, qty: number) {
    startTransition(async () => {
      const cart = await updateLineAction(lineId, Math.max(0, qty));
      if (cart) setCart(cart);
    });
  }

  function removeLine(lineId: string) {
    startTransition(async () => {
      const cart = await removeLineAction(lineId);
      if (cart) setCart(cart);
    });
  }

  function applyDiscount(e: React.FormEvent) {
    e.preventDefault();
    if (!discountCode.trim()) return;
    
    startTransition(async () => {
      const cart = await applyDiscountCodeAction(discountCode);
      if (cart) {
        setCart(cart);
        const subAmount = cart.cost?.subtotalAmount?.amount || 0;
        const totAmount = cart.cost?.totalAmount?.amount || 0;
        
        if (Number(subAmount) <= Number(totAmount)) {
          toast.error("كود الخصم غير صالح أو لا ينطبق على هذه السلة");
        } else {
          toast.success(labels.apply + " ✓");
        }
        setDiscountCode("");
      }
    });
  }

  if (!lines.length) {
    return (
      <div className="section mt-10 flex flex-col items-center justify-center gap-5 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-ink-muted/40" />
        <p className="text-lg text-ink-muted">{labels.empty}</p>
        <Link href={locale === "en" ? "/en/shop" : "/shop"} className="btn-primary">
          {labels.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="section mt-6">
      <h1 className="mb-6 text-3xl font-bold text-ink-dark">{labels.title}</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="space-y-4">
            {lines.map((line) => (
              <li key={line.id} className="card flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
                {line.merchandise.image?.url && (
                  <img
                    src={line.merchandise.image.url}
                    alt={line.merchandise.image.altText || line.merchandise.product.title}
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-btn object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-ink-dark">{line.merchandise.product.title}</h3>
                  <p className="text-sm text-ink-muted">{line.merchandise.title}</p>
                  <p className="mt-1 font-bold text-brand-orange">
                    {formatCurrency(line.merchandise.price, locale)}
                  </p>
                  {line.discountAllocations && line.discountAllocations.length > 0 && (
                    <div className="mt-1 flex items-center gap-1 text-xs font-bold text-brand-orange">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>شمل الخصم</span>
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between sm:justify-start gap-3">
                    <div className="flex items-center rounded-btn border border-ink-dark/10">
                      <button onClick={() => updateQty(line.id, line.quantity - 1)} className="px-2.5 py-1.5 hover:bg-ink-dark/5" aria-label="decrease">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-sm">{line.quantity}</span>
                      <button onClick={() => updateQty(line.id, line.quantity + 1)} className="px-2.5 py-1.5 hover:bg-ink-dark/5" aria-label="increase">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button onClick={() => removeLine(line.id)} className="btn-ghost h-9 px-3 text-red-500" aria-label={labels.removeItem}>
                      <Trash2 className="h-4 w-4" /> <span className="text-xs">{labels.removeItem}</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="card h-fit p-6">
          <h2 className="text-lg font-bold text-ink-dark">{labels.summary}</h2>
          
          {discountCodes && discountCodes.length > 0 && (
            <div className={`mt-4 flex items-center justify-between text-sm ${Number(subtotalAmount) > Number(totalAmount) ? "text-brand-orange" : "text-red-500"}`}>
              <span>الخصم ({discountCodes[0].code})</span>
              <div className="flex items-center gap-1 font-medium">
                {Number(subtotalAmount) > Number(totalAmount) ? (
                  <>
                    <span>تم التطبيق</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>غير مطبق على هذه السلة</span>
                    <XCircle className="h-4 w-4" />
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-ink-muted">{labels.subtotal}</span>
            <span className="text-lg font-bold">{formatCurrency({ amount: String(subtotalAmount), currencyCode: currency }, locale)}</span>
          </div>

          {Number(subtotalAmount) > Number(totalAmount) && (
            <div className="mt-2 flex items-center justify-between text-brand-orange">
              <span className="text-sm font-bold">قيمة الخصم</span>
              <span className="text-sm font-bold">- {formatCurrency({ amount: String(Number(subtotalAmount) - Number(totalAmount)), currencyCode: currency }, locale)}</span>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-ink-dark/10 pt-4">
            <span className="text-base font-bold text-ink-dark">{labels.total}</span>
            <div className="flex flex-col items-end">
              {Number(subtotalAmount) > Number(totalAmount) && (
                <span className="text-xs text-ink-muted line-through">
                  {formatCurrency({ amount: String(subtotalAmount), currencyCode: currency }, locale)}
                </span>
              )}
              <span className="text-2xl font-bold text-brand-orange">
                {formatCurrency({ amount: String(totalAmount), currencyCode: currency }, locale)}
              </span>
            </div>
          </div>
          <form className="mt-4 flex gap-2" onSubmit={applyDiscount}>
            <input 
              placeholder={labels.discountCode} 
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="input-field h-10 flex-1 text-sm" 
              disabled={pending}
            />
            <button type="submit" className="btn-secondary h-10" disabled={pending}>{labels.apply}</button>
          </form>
          {/* Save Cart via WhatsApp */}
          <div className="mt-4">
            <SaveCartToWhatsApp locale={locale} />
          </div>

          <button
            onClick={() => {
              if (checkoutUrl) window.location.href = checkoutUrl;
            }}
            disabled={pending || !checkoutUrl}
            className="btn-primary mt-4 w-full"
          >
            {labels.checkout}
          </button>
        </aside>
      </div>
    </div>
  );
}
