import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import CollectionCard from "@/components/CollectionCard";
import Breadcrumb from "@/components/Breadcrumb";
import { getCollections } from "@/lib/queries/collections";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Home" });
  return {
    title: params.locale === "ar" ? "مجموعات العسل — الفنجري" : "Our Honey Collections — Elfangary",
  };
}

export default async function CollectionsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });

  const collections = await getCollections(100);

  return (
    <div className="section mt-6 mb-16 min-h-[60vh]">
      <Breadcrumb
        locale={locale}
        items={[
          { name: tCommon("brand"), href: localePath(locale) },
          { name: tNav("ourHoney") as string },
        ]}
      />

      <div className="mb-10 mt-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-dark sm:text-4xl">{tNav("ourHoney")}</h1>
        <p className="mt-3 text-ink-muted">
          {locale === "ar" ? "تصفح جميع أنواع مجموعات العسل الطبيعي لدينا." : "Browse all of our natural honey collections."}
        </p>
      </div>

      {collections.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {collections.map((c) => (
            <CollectionCard key={c.id} collection={c} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="text-center text-ink-muted mt-10">{tCommon("noResults")}</p>
      )}
    </div>
  );
}
