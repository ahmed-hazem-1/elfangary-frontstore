import { getTranslations } from "next-intl/server";
import { getMenu } from "@/lib/queries/menu";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import HeaderClient from "./HeaderClient";

export default async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Nav" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const items = await getMenu("main-menu");

  const fallbackNav = [
    { title: t("home"), path: localePath(locale) },
    { title: t("shop"), path: localePath(locale, "shop") },
    { title: t("ourHoney"), path: localePath(locale, "collections") },
    { title: t("benefits"), path: `${localePath(locale)}#benefits` },
    { title: t("reviews"), path: `${localePath(locale)}#reviews` },
    { title: t("faq"), path: `${localePath(locale)}#faq` },
    { title: t("contact"), path: localePath(locale, "contact") },
  ];

  const nav = items.length
    ? items.map((it) => ({
        title: it.title,
        path: it.url?.startsWith("http")
          ? it.url
          : localePath(locale, it.url?.replace(/^\//, "")),
      }))
    : fallbackNav;

  return (
    <HeaderClient
      locale={locale}
      brand={"الفنجري"}
      brandLatin={"Elfangary"}
      nav={nav}
      labels={{
        account: t("account"),
        cart: t("cart"),
        wishlist: t("wishlist"),
        search: t("search"),
        searchPlaceholder: tCommon("searchPlaceholder"),
      }}
    />
  );
}
