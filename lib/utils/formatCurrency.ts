import type { MoneyV2 } from "@/types/shopify";

export function formatCurrency(money: MoneyV2 | null | undefined, locale = "ar"): string {
  if (!money) return "";
  try {
    const amount = Number(money.amount);
    const currency = money.currencyCode;
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${money.amount} ${money.currencyCode}`;
  }
}

export function formatPriceRange(
  min: MoneyV2 | null | undefined,
  max: MoneyV2 | null | undefined,
  locale = "ar"
): string {
  if (!min && !max) return "";
  if (!max || min?.amount === max?.amount) return formatCurrency(min, locale);
  return `${formatCurrency(min, locale)} – ${formatCurrency(max, locale)}`;
}
