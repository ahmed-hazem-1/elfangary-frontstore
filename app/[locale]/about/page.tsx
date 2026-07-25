import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/Breadcrumb";
import SectionTitle from "@/components/SectionTitle";
import BenefitCard from "@/components/BenefitCard";
import { getPageByHandle } from "@/lib/queries/pages";
import { getMetaobjects } from "@/lib/queries/metaobjects";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "About" });
  return { title: t("title") };
}

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "About" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const [page, values] = await Promise.all([
    getPageByHandle("about-us"),
    getMetaobjects("values", 4),
  ]);

  return (
    <div className="section mt-6">
      <Breadcrumb
        locale={locale}
        items={[{ name: tCommon("brand"), href: localePath(locale) }, { name: t("title") }]}
      />

      <section className="container-shell relative mb-12 overflow-hidden rounded-shell p-8 sm:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-brand-gold to-brand-amber/20" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold text-ink-dark sm:text-5xl">{t("title")}</h1>
          {page?.body && (
            <div
              className="prose prose-sm mt-4 max-w-none text-ink-muted"
              dangerouslySetInnerHTML={{ __html: page.body }}
            />
          )}
        </div>
      </section>

      {values.length > 0 && (
        <section className="mt-12">
          <SectionTitle title={t("values")} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <BenefitCard key={v.id} obj={v} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
