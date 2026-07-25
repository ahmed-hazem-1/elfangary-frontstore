"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CUSTOMER_TOKEN_COOKIE, CUSTOMER_REFRESH_COOKIE } from "@/lib/utils/cartCookie";
import type { Locale } from "@/i18n/routing";

export async function signOutAction(locale: Locale) {
  cookies().delete(CUSTOMER_TOKEN_COOKIE);
  cookies().delete(CUSTOMER_REFRESH_COOKIE);
  redirect(`/${locale === "en" ? "en" : ""}/account/login`);
}
