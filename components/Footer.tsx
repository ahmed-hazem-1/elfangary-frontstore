import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getMenu } from "@/lib/queries/menu";
import { getShop, shopMetafield } from "@/lib/queries/shop";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

export default async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Footer" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const items = await getMenu("footer");
  const shop = await getShop();

  const fallbackFooter = [
    { title: tNav("shop"), path: localePath(locale, "shop") },
    { title: tNav("contact"), path: localePath(locale, "contact") },
    { title: tCommon("backHome"), path: localePath(locale) },
  ];
  const footerNav = items.length
    ? items.map((it) => ({
        title: it.title,
        path: it.url?.startsWith("http") ? it.url : localePath(locale, it.url?.replace(/^\//, "")),
      }))
    : fallbackFooter;

  const fb = shopMetafield(shop, "social_facebook");
  const ig = shopMetafield(shop, "social_instagram");
  const tw = shopMetafield(shop, "social_twitter");
  const phone = shopMetafield(shop, "store_phone");
  const email = shopMetafield(shop, "store_email");
  const address = shopMetafield(shop, "store_address");

  return (
    <footer className="mt-16 bg-brand-amber text-white">
      <div className="section grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="rounded-btn bg-brand-orange px-3 py-1.5 font-arabic text-lg font-bold">
              {tCommon("brand")}
            </span>
            <span className="text-sm tracking-wide text-white/70">{tCommon("brandLatin")}</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">{t("statement")}</p>
          <div className="mt-5 flex gap-2">
            {fb && (
              <a href={fb} target="_blank" rel="noreferrer" className="btn-ghost h-10 w-10 p-0 text-white hover:bg-white/10" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {ig && (
              <a href={ig} target="_blank" rel="noreferrer" className="btn-ghost h-10 w-10 p-0 text-white hover:bg-white/10" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {tw && (
              <a href={tw} target="_blank" rel="noreferrer" className="btn-ghost h-10 w-10 p-0 text-white hover:bg-white/10" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">{t("followUs")}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {footerNav.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="text-white/80 transition-colors hover:text-brand-orange">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">{t("storeInfo")}</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            {phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> <a href={`tel:${phone}`}>{phone}</a>
              </li>
            )}
            {email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> <a href={`mailto:${email}`}>{email}</a>
              </li>
            )}
            {address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4" /> <span>{address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {tCommon("brand")} / {tCommon("brandLatin")}. {t("rights")}
          </p>
          <p>{t("paymentReassurance")}</p>
        </div>
      </div>
    </footer>
  );
}
