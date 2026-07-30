"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartDrawerInner from "./CartDrawerInner";
import { useLocale } from "next-intl";

export default function CartDrawerClient() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const locale = useLocale();
  const [labels, setLabels] = useState<any>(null);

  useEffect(() => {
    import(`@/i18n/messages/${locale}.json`).then((m) => {
      setLabels({
        subtotal: m.default.Cart.subtotal,
        checkout: m.default.Common.checkout,
        empty: m.default.Cart.empty,
        title: m.default.Cart.title,
        quantity: m.default.Common.quantity,
        remove: m.default.Common.remove,
        discountCode: m.default.Common.discountCode,
        apply: m.default.Common.apply,
      });
    });
  }, [locale]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!labels) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink-dark/40 backdrop-blur-sm transition-opacity duration-250 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
      />
      <aside
        className={`fixed end-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-card transition-transform duration-300 ease-buttery ${
          isOpen ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-dark/5 px-5 py-4">
          <h2 className="text-lg font-bold">{labels.title}</h2>
          <button onClick={closeDrawer} className="btn-ghost h-9 w-9 p-0" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <CartDrawerInner locale={locale} labels={labels} />
      </aside>
    </>
  );
}
