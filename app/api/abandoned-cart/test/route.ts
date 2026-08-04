import { NextResponse } from "next/server";
import { sendAbandonedCartNotification } from "@/lib/abandonedCart/notifier";
import type { AbandonedCartPayload } from "@/lib/abandonedCart/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone") || "+966501234567";
  const name = searchParams.get("name") || "أحمد حازم";
  const locale = searchParams.get("locale") || "ar";

  const samplePayload: AbandonedCartPayload = {
    cartId: "gid://shopify/Cart/test-sample-cart-12345",
    checkoutUrl: "https://elfangary.myshopify.com/checkouts/cn/c1-sample-checkout-url",
    customer: {
      phone,
      name,
      locale,
    },
    items: [
      {
        id: "gid://shopify/ProductVariant/111",
        title: "عسل سدر دوعني ملكي فاخر",
        variantTitle: "500 جرام",
        quantity: 2,
        price: "240 SAR",
        currencyCode: "SAR",
      },
      {
        id: "gid://shopify/ProductVariant/222",
        title: "عسل حبة البركة الطبيعي",
        variantTitle: "250 جرام",
        quantity: 1,
        price: "110 SAR",
        currencyCode: "SAR",
      },
    ],
    totalAmount: "590.00",
    currencyCode: "SAR",
    totalQuantity: 3,
    lastActiveAt: Date.now(),
  };

  const result = await sendAbandonedCartNotification(samplePayload);

  return NextResponse.json({
    test: "abandoned_cart_sample",
    payload: samplePayload,
    notificationResult: result,
  });
}
