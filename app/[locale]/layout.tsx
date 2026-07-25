import type { Metadata } from "next";
import { Tajawal, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { unstable_setRequestLocale, getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";
import CartDrawerClient from "@/components/CartDrawerClient";

const arabicFont = Tajawal({
  subsets: ["arabic"],
  variable: "--font-ar",
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

const latinFont = Inter({
  subsets: ["latin"],
  variable: "--font-en",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "الفنجري — Elfangary | عسل طبيعي فاخر", template: "%s | الفنجري" },
  description: "عسل طبيعي فاخر مختار بعناية. Natural premium honey, carefully selected.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  const active = locale as Locale;
  unstable_setRequestLocale(active);
  const messages = await getMessages();
  const dir = active === "ar" ? "rtl" : "ltr";

  return (
    <html lang={active} dir={dir} className={`${arabicFont.variable} ${latinFont.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={active} messages={messages}>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Header locale={active} />
              <main className="flex-1">{children}</main>
              <Footer locale={active} />
            </div>
            <CartDrawerClient />
            <Toaster position="top-center" dir={dir} />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

