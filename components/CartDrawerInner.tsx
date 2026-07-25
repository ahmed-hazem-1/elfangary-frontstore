"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "@/store/cartStore";
import { updateLineAction, removeLineAction } from "@/app/actions/cart";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default function CartDrawerInner({ locale, labels }: {
  locale: string;
  labels: { subtotal: string; checkout: string; empty: string; title: string; quantity: string; remove: string };
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
  const currency = cost?.totalAmount?.currencyCode || lines[0]?.merchandise?.price?.currencyCode || "SAR";
  const subtotalAmount = cost?.subtotalAmount?.amount || lines.reduce((sum, l) => sum + Number(l.estimatedCost?.subtotalAmount?.amount || 0), 0);
  const totalAmount = cost?.totalAmount?.amount || subtotalAmount;
  const router = useRouter();

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
                  className="h-16 w-16 rounded-btn object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold">{line.merchandise.product.title}</p>
                <p className="text-xs text-ink-muted">{line.merchandise.title}</p>
                <p className="mt-1 text-sm font-medium text-brand-orange">
                  {formatCurrency(line.merchandise.price, locale)}
                </p>
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
        {discountCodes && discountCodes.length > 0 && (
          <div className="mb-2 flex items-center justify-between text-sm text-brand-orange">
            <span>الخصم ({discountCodes[0].code})</span>
            <span>مُطبق ✅</span>
          </div>
        )}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-ink-muted">{labels.subtotal}</span>
          <span className="text-lg font-bold">
            {formatCurrency({ amount: String(totalAmount), currencyCode: currency }, locale)}
          </span>
        </div>
        <button
          onClick={() => router.push(`${locale === "en" ? "/en" : ""}/cart`)}
          className="btn-primary w-full"
          disabled={pending}
        >
          {labels.title}
        </button>
      </div>
    </div>
  );
}
