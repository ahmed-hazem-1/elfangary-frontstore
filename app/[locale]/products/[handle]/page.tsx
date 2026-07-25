import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import Accordion from "@/components/Accordion";
import SectionTitle from "@/components/SectionTitle";
import { getProductByHandle, getProductRecommendations, getAllProductHandles } from "@/lib/queries/products";
import { getPageByHandle } from "@/lib/queries/pages";
import { getMetaobjects, metaobjectField } from "@/lib/queries/metaobjects";
import { localePath } from "@/lib/utils/urls";
import { productJsonLd, breadcrumbJsonLd, canonical } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const handles = await getAllProductHandles();
  return [{ locale: "ar" }, { locale: "en" }].flatMap((l) =>
    handles.map((p) => ({ ...l, handle: p.handle }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; handle: string };
}): Promise<Metadata> {
  const product = await getProductByHandle(params.handle);
  if (!product) return {};
  const url = canonical(params.locale, `products/${params.handle}`);
  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description,
    alternates: { canonical: url },
    openGraph: {
      title: product.seo?.title || product.title,
      description: product.seo?.description || product.description,
      images: product.featuredImage?.url ? [{ url: product.featuredImage.url }] : [],
      url,
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { locale: Locale; handle: string };
}) {
  const { locale, handle } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Product" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const [recommendations, shippingPage, faqs] = await Promise.all([
    getProductRecommendations(product.id),
    getPageByHandle("shipping-policy"),
    getMetaobjects("product_faqs", 10),
  ]);

  const metafieldVal = (key: string) => product.metafields?.find((m) => m?.key === key)?.value;
  const nutrition = metafieldVal("nutrition");
  const origin = metafieldVal("origin");
  const season = metafieldVal("season");
  const certifications = metafieldVal("certifications");

  const faqItems = faqs.map((f) => ({
    question: metaobjectField(f, "question") || metaobjectField(f, "title"),
    answer: metaobjectField(f, "answer") || metaobjectField(f, "content"),
  }));
  if (shippingPage?.body) {
    faqItems.unshift({ question: t("shipping"), answer: shippingPage.body });
  }

  const url = canonical(locale, `products/${handle}`);

  return (
    <div className="section mt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, locale, url)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: tCommon("brand"), url: canonical(locale) },
              { name: t("description"), url: canonical(locale, "shop") },
              { name: product.title, url },
            ])
          ),
        }}
      />

      <Breadcrumb
        locale={locale}
        items={[
          { name: tCommon("brand"), href: localePath(locale) },
          { name: t("description") as string, href: localePath(locale, "shop") },
          { name: product.title },
        ]}
      />

      <ProductDetail
        product={product}
        locale={locale}
        labels={{
          addToCart: tCommon("addToCart"),
          buyNow: tCommon("buyNow"),
          selectVariant: t("selectVariant"),
          vendor: t("vendor"),
          outOfStock: tCommon("soldOut"),
        }}
      />

      {(nutrition || origin || season || certifications) && (
        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {nutrition && <MetaTile label={t("nutrition")} value={nutrition} />}
          {origin && <MetaTile label={t("origin")} value={origin} />}
          {season && <MetaTile label={t("season")} value={season} />}
          {certifications && <MetaTile label={t("certifications")} value={certifications} />}
        </section>
      )}

      {faqItems.length > 0 && (
        <section className="mt-12" id="faq">
          <SectionTitle title={t("faqs")} />
          <Accordion items={faqItems} />
        </section>
      )}

      {recommendations && recommendations.length > 0 && (
        <section className="mt-16">
          <SectionTitle title={t("recommendations")} />
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {recommendations.slice(0, 4).map((p) => (
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
    </div>
  );
}

function MetaTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-2 text-sm text-ink-dark">{value}</p>
    </div>
  );
}
