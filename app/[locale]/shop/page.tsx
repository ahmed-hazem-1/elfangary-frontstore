import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import Pagination from "@/components/Pagination";
import SkeletonLoader from "@/components/SkeletonLoader";
import { getProducts } from "@/lib/queries/products";
import { getCollections } from "@/lib/queries/collections";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Shop" });
  return { title: t("title") };
}

const SORT_MAP: Record<string, string> = {
  featured: "RELEVANCE",
  price_low: "PRICE",
  price_high: "PRICE",
  newest: "CREATED",
};

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { 
    cursor?: string; 
    sort?: string; 
    type?: string; 
    available?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    offers?: string;
  };
}) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Shop" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const sortKey = SORT_MAP[searchParams.sort || "featured"] || "RELEVANCE";
  const reverse = searchParams.sort === "price_high";
  const conditions = [];
  if (searchParams.type) conditions.push(`product_type:${searchParams.type}`);
  if (searchParams.available === "true") conditions.push(`available_for_sale:true`);
  if (searchParams.q) conditions.push(`title:*${searchParams.q}*`);
  if (searchParams.minPrice) conditions.push(`variants.price:>=${searchParams.minPrice}`);
  if (searchParams.maxPrice) conditions.push(`variants.price:<=${searchParams.maxPrice}`);
  if (searchParams.offers === "true") conditions.push(`is_price_reduced:true`);

  const query = conditions.length > 0 ? conditions.join(" AND ") : undefined;

  const data = await getProducts({
    first: 24,
    after: searchParams.cursor || null,
    sortKey,
    reverse,
    query,
  });
  const collections = await getCollections(20);
  const types = Array.from(
    new Set(
      (data?.products || []).map((p) => p.productType).filter(Boolean) as string[]
    )
  );

  return (
    <div className="section mt-6">
      <Breadcrumb
        locale={locale}
        items={[
          { name: tCommon("brand"), href: localePath(locale) },
          { name: t("title") },
        ]}
      />
      <h1 className="mb-6 text-3xl font-bold text-ink-dark">{t("title")}</h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <FilterSidebar
          labels={{
            filters: t("filters"),
            filterType: t("filterType"),
            filterPrice: t("filterPrice"),
            filterAvailability: t("filterAvailability"),
            inStock: tCommon("inStock"),
            all: locale === "ar" ? "الكل" : "All",
            apply: t("sort"),
            search: locale === "ar" ? "بحث عن منتج..." : "Search products...",
            minPrice: locale === "ar" ? "الحد الأدنى" : "Min",
            maxPrice: locale === "ar" ? "الحد الأقصى" : "Max",
            offersOnly: locale === "ar" ? "العروض فقط" : "Offers Only",
            sortBy: locale === "ar" ? "الترتيب" : "Sort By",
            featured: locale === "ar" ? "المميزة" : "Featured",
            priceLow: locale === "ar" ? "السعر: الأقل للأعلى" : "Price: Low to High",
            priceHigh: locale === "ar" ? "السعر: الأعلى للأقل" : "Price: High to Low",
            newest: locale === "ar" ? "الأحدث" : "Newest",
          }}
          types={types}
        />

        <div className="flex-1">
          {data && data.products.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-ink-muted">
                {t("resultsCount", { count: data.products.length })}
              </p>
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {data.products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    locale={locale}
                    labels={{ addToCart: tCommon("addToCart"), soldOut: tCommon("soldOut") }}
                  />
                ))}
              </div>
              <Pagination nextCursor={data.hasNextPage ? data.endCursor : null} loadMoreLabel={tCommon("loadMore")} />
            </>
          ) : data ? (
            <div className="card flex flex-col items-center justify-center gap-4 p-12 text-center">
              <p className="text-ink-muted">{tCommon("noResults")}</p>
            </div>
          ) : (
            <SkeletonLoader className="grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" count={8} />
          )}

          {collections.length > 0 && !data && (
            <div className="mt-8">
              <p className="text-sm text-ink-muted">{t("filterType")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
