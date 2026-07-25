import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import CartPageClient from "@/components/CartPageClient";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Cart" });
  return { title: t("title") };
}

export default async function CartPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Cart" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <CartPageClient
      labels={{
        title: t("title"),
        empty: t("empty"),
        continueShopping: t("continueShopping"),
        summary: t("summary"),
        subtotal: tCommon("subtotal"),
        total: tCommon("total"),
        checkout: tCommon("checkout"),
        quantity: tCommon("quantity"),
        removeItem: t("removeItem"),
        discountCode: tCommon("discountCode"),
        apply: tCommon("apply"),
      }}
    />
  );
}
