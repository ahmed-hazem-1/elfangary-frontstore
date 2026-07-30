import { getTranslations } from "next-intl/server";
import { getShop, shopMetafield } from "@/lib/queries/shop";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import HeroCarousel from "./HeroCarousel";

export default async function HeroShell({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Hero" });
  const shop = await getShop();
  const heroImage = shopMetafield(shop, "hero_image");
  const title = shopMetafield(shop, locale === "ar" ? "hero_title_ar" : "hero_title_en") || t("title");
  const subtitle = shopMetafield(shop, "hero_subtext") || t("subtitle");
  const ctaPrimary = shopMetafield(shop, "hero_cta_primary") || t("ctaPrimary");
  const ctaSecondary = shopMetafield(shop, "hero_cta_secondary") || t("ctaSecondary");

  const slides = [
    {
      id: "main",
      image: "https://static.vecteezy.com/system/resources/thumbnails/055/593/016/small/honey-jar-with-a-wooden-dipper-resting-on-a-wooden-stump-surrounded-by-wildflowers-at-sunset-free-photo.jpeg",
      pill: t("ctaPrimary") === "Shop Now" ? "100% Natural Honey" : "عسل طبيعي ١٠٠٪",
      title: title,
      subtitle: subtitle,
      ctaPrimary: { label: ctaPrimary, href: localePath(locale, "shop") },
      ctaSecondary: { label: locale === "ar" ? "كل الأصناف" : "All Categories", href: localePath(locale, "shop") },
      bgColorClass: "bg-gradient-to-br from-brand-orange/20 via-brand-gold to-brand-amber/20"
    },
    {
      id: "offer1",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpW4-oRHFfc_165xrPngEDYbuTQyXr8F1HpvD-WXszxkcOM8GC5KZLdPg7&s=10",
      pill: locale === "ar" ? "عروض خاصة" : "Special Offers",
      title: locale === "ar" ? "عرض الأسبوع: خصم مميز" : "Offer of the Week: Special Discount",
      subtitle: locale === "ar" ? "اكتشف أفضل الخصومات على تشكيلة العسل الطبيعي الفاخر لدينا. جودة عالية بأسعار لا تفوت!" : "Discover the best discounts on our premium natural honey collection. Top quality at unmissable prices!",
      ctaPrimary: { label: locale === "ar" ? "تسوق العروض" : "Shop Offers", href: localePath(locale, "shop") },
      bgColorClass: "bg-brand-gold"
    },
    {
      id: "benefits",
      image: "https://thumbs.dreamstime.com/b/honey-bee-beautiful-yellow-flower-spring-summer-season-wild-nature-landscape-banner-background-collect-pollen-287564683.jpg",
      pill: locale === "ar" ? "جودة مضمونة" : "Guaranteed Quality",
      title: locale === "ar" ? "عسل طبيعي ومختبري" : "Natural & Lab Tested",
      subtitle: locale === "ar" ? "جميع منتجاتنا مفحوصة مخبرياً لضمان خلوها من الإضافات ومطابقتها لأعلى معايير الجودة." : "All our products are lab-tested to ensure they are free of additives and meet the highest quality standards.",
      ctaPrimary: { label: locale === "ar" ? "اكتشف الجودة" : "Discover Quality", href: localePath(locale, "about") },
      bgColorClass: "bg-brand-orange/10"
    }
  ];

  return <HeroCarousel slides={slides} locale={locale} />;
}
