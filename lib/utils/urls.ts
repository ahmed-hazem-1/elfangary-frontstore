import type { Locale } from "@/i18n/routing";

export function localePath(locale: Locale, ...segments: string[]): string {
  const base = locale === "ar" ? "" : `/${locale}`;
  const path = segments.filter(Boolean).join("/").replace(/^\/+|\/+$/g, "");
  return path ? `${base}/${path}` : base || "/";
}

export function isLocale(value: string): value is Locale {
  return value === "ar" || value === "en";
}

export function oppositeLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}
