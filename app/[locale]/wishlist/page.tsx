import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import WishlistPageClient from "@/components/WishlistPageClient";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Wishlist" });
  return { title: t("title") };
}

export default async function WishlistPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Wishlist" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <WishlistPageClient
      locale={locale}
      labels={{
        title: t("title"),
        emptyTitle: t("emptyTitle"),
        emptySubtitle: t("emptySubtitle"),
        exploreShop: t("exploreShop"),
        moveToCart: t("moveToCart"),
        moveAllToCart: t("moveAllToCart"),
        allMovedToCart: t("allMovedToCart"),
        clearAll: t("clearAll"),
        confirmClear: t("confirmClear"),
        itemsCount: t("itemsCount"),
        shareWishlist: t("shareWishlist"),
        copiedLink: t("copiedLink"),
        soldOut: tCommon("soldOut"),
        remove: tCommon("remove"),
      }}
    />
  );
}
