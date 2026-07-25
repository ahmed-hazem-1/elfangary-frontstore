import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import HeroShell from "@/components/HeroShell";
import TrustStrip from "@/components/TrustStrip";
import ProductCard from "@/components/ProductCard";
import CollectionCard from "@/components/CollectionCard";
import BenefitCard from "@/components/BenefitCard";
import TestimonialCard from "@/components/TestimonialCard";
import SectionTitle from "@/components/SectionTitle";
import NewsletterForm from "@/components/NewsletterForm";
import { getCollections } from "@/lib/queries/collections";
import { getProducts } from "@/lib/queries/products";
import { getMetaobjects } from "@/lib/queries/metaobjects";
import { getPageByHandle } from "@/lib/queries/pages";
import { parseDescription } from "@/lib/utils/parseDescription";
import { localePath } from "@/lib/utils/urls";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import CategoryMarquee from "@/components/CategoryMarquee";
import SocialFab from "@/components/SocialFab";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Home" });
  return {
    title: params.locale === "ar" ? "الفنجري — عسل طبيعي فاخر" : "Elfangary — Premium Natural Honey",
    description: params.locale === "ar"
      ? "عسل طبيعي فاخر مختار بعناية. تسوّق أجود أنواع العسل الطبيعي."
      : "Carefully selected premium natural honey. Shop the finest natural honey.",
  };
}

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tTrust = await getTranslations({ locale, namespace: "Trust" });

  const [collections, bestSellers, benefits, testimonials, aboutPage] = await Promise.all([
    getCollections(6),
    getProducts({ first: 8, sortKey: "BEST_SELLING" }),
    getMetaobjects("benefits", 4),
    getMetaobjects("testimonials", 6),
    getPageByHandle("about-us"),
  ]);

  const trustBadges = [
    { icon: "natural", label: tTrust("natural") },
    { icon: "noAdditives", label: tTrust("noAdditives") },
    { icon: "premium", label: tTrust("premium") },
    { icon: "fastDelivery", label: tTrust("fastDelivery") },
    { icon: "labTested", label: tTrust("labTested") },
  ];

  return (
    <>
      <CategoryMarquee />
      <HeroShell locale={locale} />

      <TrustStrip badges={trustBadges} />

      {collections.length > 0 && (
        <section className="section mt-16 sm:mt-24 lg:mt-32">
          <SectionTitle title={t("featuredCollections")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {collections.map((c) => (
              <CollectionCard key={c.id} collection={c} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {bestSellers && bestSellers.products.length > 0 && (
        <section className="section mt-16 sm:mt-24 lg:mt-32">
          <div className="mb-8 flex items-center justify-between sm:mb-12">
            <SectionTitle title={t("bestSellers")} />
            <Link href={localePath(locale, "shop")} className="btn-secondary hidden sm:inline-flex">
              {tCommon("viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {bestSellers.products.slice(0, 8).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                locale={locale}
                labels={{ addToCart: tCommon("addToCart"), soldOut: tCommon("soldOut") }}
              />
            ))}
          </div>
        </section>
      )}

      {aboutPage?.body && (
        <section className="section mt-16 sm:mt-24 lg:mt-32">
          <div className="container-shell grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16 border-0 bg-transparent shadow-none">
            <div>
              <span className="pill mb-4 border-0 bg-brand-gold">{t("brandStory")}</span>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-dark sm:text-3xl lg:text-4xl">{aboutPage.title}</h2>
              <p className="mt-6 text-base leading-relaxed text-ink-muted line-clamp-6 sm:text-lg">
                {parseDescription(aboutPage.body)}
              </p>
              <Link href={localePath(locale, "about")} className="btn-primary mt-8">
                {tCommon("readMore")}
              </Link>
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-xl bg-brand-gold sm:h-80 lg:h-full lg:min-h-[360px]">
            </div>
          </div>
        </section>
      )}

      {benefits.length > 0 && (
        <section className="section mt-16 sm:mt-24 lg:mt-32" id="benefits">
          <SectionTitle title={t("benefitsTitle")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {benefits.map((b, i) => (
              <BenefitCard key={b.id} obj={b} index={i} />
            ))}
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="section mt-16 sm:mt-24 lg:mt-32" id="reviews">
          <SectionTitle title={t("testimonialsTitle")} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {testimonials.map((tst) => (
              <TestimonialCard key={tst.id} obj={tst} />
            ))}
          </div>
        </section>
      )}

      <section className="section my-16 sm:my-24 lg:my-32">
        <div className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-dark sm:text-3xl">{t("newsletterTitle")}</h2>
          <p className="max-w-md text-sm text-ink-muted">{t("newsletterText")}</p>
          <NewsletterForm
            labels={{
              placeholder: locale === "ar" ? "بريدك الإلكتروني" : "Your email",
              subscribe: locale === "ar" ? "اشترك" : "Subscribe",
              success: locale === "ar" ? "تم اشتراكك بنجاح!" : "Subscribed successfully!",
              error: locale === "ar" ? "حدث خطأ، حاول مرة أخرى." : "Something went wrong.",
            }}
          />
        </div>
      </section>

      <SocialFab />
    </>
  );
}
