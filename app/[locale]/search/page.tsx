import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import CollectionCard from "@/components/CollectionCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import { getProducts } from "@/lib/queries/products";
import { getCollections } from "@/lib/queries/collections";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params, searchParams }: { params: { locale: string }; searchParams: { q?: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Search" });
  return { title: `${t("title")}: ${searchParams.q || ""}` };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { q?: string };
}) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Search" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const q = searchParams.q?.trim() || "";
  const query = q ? `title:*${q}* OR description:*${q}* OR tag:${q}` : undefined;
  const [data, collections] = await Promise.all([
    getProducts({ first: 24, query }),
    getCollections(6),
  ]);

  return (
    <div className="section mt-6">
      <Breadcrumb
        locale={locale}
        items={[{ name: tCommon("brand"), href: localePath(locale) }, { name: t("title") }]}
      />
      <h1 className="mb-2 text-3xl font-bold text-ink-dark">{t("title")}</h1>
      {q && <p className="mb-6 text-sm text-ink-muted">{t("query")}: “{q}”</p>}

      {data && data.products.length > 0 ? (
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
      ) : data ? (
        <div className="space-y-8">
          <div className="card flex flex-col items-center justify-center gap-4 p-12 text-center">
            <p className="text-ink-muted">{t("noResults")}</p>
          </div>
          {collections.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-ink-dark">{t("suggested")}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {collections.map((c) => (
                  <CollectionCard key={c.id} collection={c} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <SkeletonLoader className="grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" count={8} />
      )}
    </div>
  );
}
