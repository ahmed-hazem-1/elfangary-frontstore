import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import FloatingProductCard from "./FloatingProductCard";
import { getShop, shopMetafield } from "@/lib/queries/shop";
import { getProductByHandle } from "@/lib/queries/products";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";

export default async function HeroShell({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Hero" });
  const shop = await getShop();
  const heroImage = shopMetafield(shop, "hero_image");
  const title = shopMetafield(shop, locale === "ar" ? "hero_title_ar" : "hero_title_en") || t("title");
  const subtitle = shopMetafield(shop, "hero_subtext") || t("subtitle");
  const ctaPrimary = shopMetafield(shop, "hero_cta_primary") || t("ctaPrimary");
  const ctaSecondary = shopMetafield(shop, "hero_cta_secondary") || t("ctaSecondary");
  const featuredHandle = shopMetafield(shop, "featured_product_handle");
  const featuredProduct = featuredHandle ? await getProductByHandle(featuredHandle) : null;

  return (
    <section className="section mt-4 sm:mt-6 lg:mt-8">
      <div className="container-shell relative overflow-hidden rounded-shell p-6 sm:p-10 lg:p-16">
        {heroImage ? (
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 mix-blend-overlay"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-brand-gold to-brand-amber/20" />
        )}
        <div className="absolute inset-0 bg-white/40" />

        <div className="relative z-10 grid items-center gap-12 py-12 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <span className="pill mb-6 text-brand-orange border-brand-orange/20">
              {t("ctaPrimary") === "Shop Now" ? "100% Natural Honey" : "عسل طبيعي ١٠٠٪"}
            </span>
            <h1 className="text-3xl font-semibold tracking-tight leading-tight text-ink-dark sm:text-4xl lg:text-5xl">{title}</h1>
            <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">{subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={localePath(locale, "shop")} className="btn-primary">{ctaPrimary}</Link>
              <Link href={localePath(locale, "collections")} className="btn-secondary">{ctaSecondary}</Link>
            </div>
          </div>

          {featuredProduct && (
            <div className="flex justify-center lg:justify-end">
              <FloatingProductCard product={featuredProduct} locale={locale} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
