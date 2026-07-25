import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { getCustomer, getCustomerOrders, getCustomerAddresses } from "@/lib/queries/customer";
import { CUSTOMER_TOKEN_COOKIE } from "@/lib/utils/cartCookie";
import { isAuthConfigured } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import { signOutAction } from "@/app/actions/signOut";
import { User, Package, MapPin, LogOut } from "lucide-react";

export const metadata = { robots: { index: false, follow: false } };

export default async function AccountPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Account" });

  const token = cookies().get(CUSTOMER_TOKEN_COOKIE)?.value;
  const authConfigured = isAuthConfigured();

  if (!authConfigured) {
    return (
      <div className="section mt-10 flex justify-center">
        <div className="card w-full max-w-md p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-ink-dark">{t("dashboard")}</h1>
          <p className="text-sm text-ink-muted">{t("loginDisabled")}</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="section mt-10 flex justify-center">
        <div className="card w-full max-w-md p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-ink-dark">{t("dashboard")}</h1>
          <Link href={localePath(locale, "account", "login")} className="btn-primary">{t("login")}</Link>
        </div>
      </div>
    );
  }

  const [customer, orders, addresses] = await Promise.all([
    getCustomer(token),
    getCustomerOrders(token, 20),
    getCustomerAddresses(token, 10),
  ]);

  return (
    <div className="section mt-6">
      <h1 className="mb-2 text-3xl font-bold text-ink-dark">{t("dashboard")}</h1>
      <p className="mb-8 text-sm text-ink-muted">
        {t("welcome")}{customer?.displayName || customer?.firstName ? `, ${customer?.displayName || customer?.firstName}` : ""}
      </p>

      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="card h-fit p-4">
          <nav className="space-y-1 text-sm">
            <div className="flex items-center gap-2 rounded-btn bg-brand-orange/10 px-3 py-2 font-semibold text-brand-orange">
              <User className="h-4 w-4" /> {t("profile")}
            </div>
            <div className="flex items-center gap-2 rounded-btn px-3 py-2 text-ink-dark">
              <Package className="h-4 w-4" /> {t("orders")}
            </div>
            <div className="flex items-center gap-2 rounded-btn px-3 py-2 text-ink-dark">
              <MapPin className="h-4 w-4" /> {t("addresses")}
            </div>
            <form action={() => signOutAction(locale)}>
              <button type="submit" className="flex w-full items-center gap-2 rounded-btn px-3 py-2 text-red-500 hover:bg-red-50">
                <LogOut className="h-4 w-4" /> {t("signOut")}
              </button>
            </form>
          </nav>
        </aside>

        <div className="space-y-8 lg:col-span-3">
          <section className="card p-6">
            <h2 className="mb-4 text-lg font-bold text-ink-dark">{t("profile")}</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-ink-muted">{t("profile")}</dt>
                <dd className="font-medium text-ink-dark">{customer?.displayName || customer?.firstName || "—"}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">{t("login")}</dt>
                <dd className="font-medium text-ink-dark">{customer?.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">{t("addresses")}</dt>
                <dd className="font-medium text-ink-dark">{customer?.phone || "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="card p-6">
            <h2 className="mb-4 text-lg font-bold text-ink-dark">{t("orderHistory")}</h2>
            {orders && orders.length > 0 ? (
              <ul className="divide-y divide-ink-dark/5">
                {orders.map((o) => (
                  <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-semibold text-ink-dark">{o.name}</p>
                      <p className="text-ink-muted">{new Date(o.processedAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}</p>
                    </div>
                    <div className="text-end">
                      <p className="font-bold text-brand-orange">{formatCurrency(o.totalPrice, locale)}</p>
                      <p className="text-xs text-ink-muted">{o.fulfillmentStatus || ""}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-muted">{t("noOrders")}</p>
            )}
          </section>

          {addresses && addresses.length > 0 && (
            <section className="card p-6">
              <h2 className="mb-4 text-lg font-bold text-ink-dark">{t("addresses")}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <li key={a.id} className="rounded-btn border border-ink-dark/5 p-4 text-sm text-ink-dark">
                    {a.formatted ? a.formatted.join(" ") : [a.address1, a.city, a.zone, a.zip, a.country].filter(Boolean).join(", ")}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
