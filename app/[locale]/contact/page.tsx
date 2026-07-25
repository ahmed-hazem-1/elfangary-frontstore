import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";
import { getShop, shopMetafield } from "@/lib/queries/shop";
import { localePath } from "@/lib/utils/urls";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Twitter } from "lucide-react";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Contact" });
  return { title: t("title") };
}

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Contact" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const shop = await getShop();

  const phone = shopMetafield(shop, "store_phone");
  const email = shopMetafield(shop, "store_email");
  const address = shopMetafield(shop, "store_address");
  const whatsapp = shopMetafield(shop, "social_whatsapp");
  const maps = shopMetafield(shop, "store_maps");
  const fb = shopMetafield(shop, "social_facebook");
  const ig = shopMetafield(shop, "social_instagram");
  const tw = shopMetafield(shop, "social_twitter");

  return (
    <div className="section mt-6">
      <Breadcrumb
        locale={locale}
        items={[{ name: tCommon("brand"), href: localePath(locale) }, { name: t("title") }]}
      />
      <h1 className="mb-8 text-3xl font-bold text-ink-dark sm:text-4xl">{t("title")}</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <ContactForm
          labels={{
            name: t("name"),
            email: t("email"),
            message: t("message"),
            send: t("send"),
            sent: t("sent"),
            error: locale === "ar" ? "حدث خطأ، حاول مرة أخرى." : "Something went wrong.",
          }}
        />

        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-bold text-ink-dark">{t("storeInfo")}</h2>
            <ul className="space-y-4 text-sm">
              {phone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-brand-orange" />
                  <a href={`tel:${phone}`} className="text-ink-dark hover:text-brand-orange">{phone}</a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-brand-orange" />
                  <a href={`mailto:${email}`} className="text-ink-dark hover:text-brand-orange">{email}</a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-brand-orange" />
                  <span className="text-ink-dark">{address}</span>
                </li>
              )}
              {whatsapp && (
                <li className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-brand-orange" />
                  <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="text-ink-dark hover:text-brand-orange">
                    {t("whatsapp")}
                  </a>
                </li>
              )}
            </ul>

            <div className="mt-5 flex gap-2">
              {fb && <a href={fb} target="_blank" rel="noreferrer" className="btn-ghost h-10 w-10 p-0" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>}
              {ig && <a href={ig} target="_blank" rel="noreferrer" className="btn-ghost h-10 w-10 p-0" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>}
              {tw && <a href={tw} target="_blank" rel="noreferrer" className="btn-ghost h-10 w-10 p-0" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>}
            </div>
          </div>

          {maps && (
            <div className="card overflow-hidden p-0">
              <iframe
                src={maps}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map"
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
