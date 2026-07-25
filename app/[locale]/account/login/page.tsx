import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buildAuthorizeUrl, isAuthConfigured } from "@/lib/auth";
import { isShopifyConfigured } from "@/lib/shopify";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";

export const metadata = { robots: { index: false, follow: false } };

export default async function LoginPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Account" });

  const authConfigured = isAuthConfigured();
  const shopConfigured = isShopifyConfigured();

  async function handleLogin() {
    "use server";
    const url = await buildAuthorizeUrl(locale);
    if (url) redirect(url);
  }

  return (
    <div className="section mt-10 flex justify-center">
      <div className="card w-full max-w-md p-8">
        <h1 className="mb-6 text-2xl font-bold text-ink-dark">{t("login")}</h1>

        {authConfigured ? (
          <form action={handleLogin}>
            <button type="submit" className="btn-primary w-full">{t("loginWithShopify")}</button>
          </form>
        ) : (
          <div className="rounded-btn bg-brand-gold p-4 text-sm text-ink-muted">
            {t("loginDisabled")}
          </div>
        )}

        <div className="mt-6 space-y-2 text-center text-sm">
          <p>
            <Link href={localePath(locale, "account", "register")} className="font-semibold text-brand-orange hover:underline">
              {t("createAccount")}
            </Link>
          </p>
          <p className="text-ink-muted">
            {shopConfigured ? t("forgotPassword") : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
