"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import type { AbandonedCartPayload } from "@/lib/abandonedCart/types";

export default function AbandonedCartTracker({ locale }: { locale: string }) {
  const cartId = useCartStore((s) => s.cartId);
  const checkoutUrl = useCartStore((s) => s.checkoutUrl);
  const totalQuantity = useCartStore((s) => s.totalQuantity);
  const lines = useCartStore((s) => s.lines);
  const cost = useCartStore((s) => s.cost);
  const customerPhone = useCartStore((s) => s.customerPhone);
  const customerName = useCartStore((s) => s.customerName);

  const lastTrackedRef = useRef<number>(0);

  useEffect(() => {
    if (!cartId || !checkoutUrl || totalQuantity === 0) return;

    const buildPayload = (): AbandonedCartPayload => {
      const items = lines.map((line) => ({
        id: line.merchandise.id,
        title: line.merchandise.product.title,
        variantTitle: line.merchandise.title,
        quantity: line.quantity,
        price: `${line.merchandise.price.amount} ${line.merchandise.price.currencyCode}`,
        currencyCode: line.merchandise.price.currencyCode,
        imageUrl: line.merchandise.image?.url,
      }));

      return {
        cartId,
        checkoutUrl,
        customer: {
          phone: customerPhone || undefined,
          name: customerName || undefined,
          locale,
        },
        items,
        totalAmount: cost?.totalAmount?.amount || "0.00",
        currencyCode: cost?.totalAmount?.currencyCode || "SAR",
        totalQuantity,
        lastActiveAt: Date.now(),
      };
    };

    const sendBeaconTrack = () => {
      // Throttle: don't track more than once every 10 seconds
      if (Date.now() - lastTrackedRef.current < 10000) return;
      lastTrackedRef.current = Date.now();

      const payload = buildPayload();
      const body = JSON.stringify(payload);

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/abandoned-cart/track", blob);
      } else {
        fetch("/api/abandoned-cart/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendBeaconTrack();
      }
    };

    const handleBeforeUnload = () => {
      sendBeaconTrack();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cartId, checkoutUrl, totalQuantity, lines, cost, customerPhone, customerName, locale]);

  return null;
}
