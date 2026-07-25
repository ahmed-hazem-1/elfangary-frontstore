import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";
import { isShopifyConfigured } from "@/lib/shopify";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";

export const metadata = { robots: { index: false, follow: false } };

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { error?: string };
}) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Account" });
  const tContact = await getTranslations({ locale, namespace: "Contact" });
  const shopConfigured = isShopifyConfigured();

  async function handleRegister(formData: FormData) {
    "use server";
    await registerAction(formData, locale);
  }

  return (
    <div className="section mt-10 flex justify-center">
      <div className="card w-full max-w-md p-8">
        <h1 className="mb-6 text-2xl font-bold text-ink-dark">{t("register")}</h1>

        {searchParams.error && (
          <div className="mb-4 rounded-btn bg-red-50 p-3 text-sm text-red-600">
            {searchParams.error}
          </div>
        )}

        {!shopConfigured && (
          <div className="mb-4 rounded-btn bg-brand-gold p-3 text-sm text-ink-muted">
            {t("loginDisabled")}
          </div>
        )}

        <form action={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-dark">{tContact("name")}</label>
              <input name="firstName" className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-dark">{tContact("name")}</label>
              <input name="lastName" className="input-field" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-dark">{tContact("email")}</label>
            <input type="email" name="email" className="input-field" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-dark">{t("login")}</label>
            <input type="password" name="password" className="input-field" required minLength={5} />
          </div>
          <button type="submit" className="btn-primary w-full">{t("createAccount")}</button>
        </form>

        <p className="mt-6 text-center text-sm">
          {t("alreadyHave")}{" "}
          <Link href={localePath(locale, "account", "login")} className="font-semibold text-brand-orange hover:underline">
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
