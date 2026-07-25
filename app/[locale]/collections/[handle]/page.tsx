import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { getCollectionByHandle, getAllCollectionHandles } from "@/lib/queries/collections";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const handles = await getAllCollectionHandles();
  return [{ locale: "ar" }, { locale: "en" }].flatMap((l) =>
    handles.map((handle) => ({ ...l, handle }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; handle: string };
}): Promise<Metadata> {
  const collection = await getCollectionByHandle(params.handle, 1);
  return {
    title: collection?.title || params.handle,
    description: collection?.description || "",
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { locale: Locale; handle: string };
  searchParams: { cursor?: string };
}) {
  const { locale, handle } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Collection" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const collection = await getCollectionByHandle(handle, 24, searchParams.cursor || null);
  if (!collection) notFound();

  const products = collection.products.edges.map((e) => e.node);

  return (
    <div className="section mt-6">
      <Breadcrumb
        locale={locale}
        items={[
          { name: tCommon("brand"), href: localePath(locale) },
          { name: t("products") as string, href: localePath(locale, "shop") },
          { name: collection.title },
        ]}
      />

      <div className="container-shell relative mb-8 overflow-hidden rounded-shell p-8">
        {collection.image && (
          <Image
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/40" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-ink-dark sm:text-4xl">{collection.title}</h1>
          {collection.description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{collection.description}</p>
          )}
        </div>
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                locale={locale}
                labels={{ addToCart: tCommon("addToCart"), soldOut: tCommon("soldOut") }}
              />
            ))}
          </div>
          <Pagination
            nextCursor={collection.products.pageInfo.hasNextPage ? (collection.products.pageInfo.endCursor ?? null) : null}
            loadMoreLabel={tCommon("loadMore")}
          />
        </>
      ) : (
        <p className="text-center text-ink-muted">{tCommon("noResults")}</p>
      )}
    </div>
  );
}
