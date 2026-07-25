import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default async function LocaleNotFound() {
  const locale = routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "NotFound" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <div className="mx-auto mt-16 flex w-full max-w-lg flex-col items-center justify-center gap-6 px-5 py-20 text-center">
      <div className="rounded-shell border border-border-glass bg-white/70 p-10 shadow-card backdrop-blur-xl">
        <p className="text-6xl font-bold text-brand-orange">404</p>
        <h1 className="mt-4 text-2xl font-bold text-ink-dark">{t("title")}</h1>
        <p className="mt-2 text-sm text-ink-muted">{t("text")}</p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          {tCommon("backHome")}
        </Link>
      </div>
    </div>
  );
}
