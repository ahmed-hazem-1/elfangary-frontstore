import type { AbandonedCartPayload } from "./types";

export function buildAbandonedCartMessage(payload: AbandonedCartPayload): string {
  const isArabic = payload.customer?.locale !== "en";
  const customerName = payload.customer?.name?.trim() || "";

  const itemsList = payload.items
    .map(
      (item) =>
        `▫️ *${item.title}${item.variantTitle && item.variantTitle !== "Default Title" ? ` (${item.variantTitle})` : ""}* × ${item.quantity}`
    )
    .join("\n");

  if (isArabic) {
    const greeting = customerName
      ? `مرحبًا بك يا *${customerName}* 🍯`
      : "مرحبًا بك يا غالي 🍯";

    return `${greeting}

لاحظنا أنك تركت بعض منتجات *عسل الفنجري الفاخر* في سلتك ولم تكمل طلبك بعد:

${itemsList}

💰 *الإجمالي:* ${payload.totalAmount} ${payload.currencyCode}

✨ المنتجات محجوزة لك خصيصاً، وبإمكانك إتمام طلبك بضغطة زر واحدة عبر الرابط المباشر التالي:
👉 ${payload.checkoutUrl}

نسعد دائماً بخدمتك ونتمنى لك يومًا عطرًا كالعسل! 🌿
*الفنجري — عسل طبيعي بطابع فاخر*`;
  }

  // English Template
  const greeting = customerName
    ? `Hello *${customerName}* 🍯`
    : "Hello there 🍯";

  return `${greeting}

We noticed you left some pure luxury honey items in your *Elfangary* cart:

${itemsList}

💰 *Total:* ${payload.totalAmount} ${payload.currencyCode}

✨ Your cart is saved! You can complete your order directly with one click using the link below:
👉 ${payload.checkoutUrl}

We are always delighted to serve you!
*Elfangary — Premium Natural Honey*`;
}
