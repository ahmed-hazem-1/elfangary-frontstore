"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createCustomer } from "@/lib/queries/customer";
import type { Locale } from "@/i18n/routing";

export async function registerAction(formData: FormData, locale: Locale) {
  const input = {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
    firstName: String(formData.get("firstName") || undefined),
    lastName: String(formData.get("lastName") || undefined),
    acceptsMarketing: true,
  };
  const result = await createCustomer(input);
  const errors = result?.customerUserErrors || [];
  if (errors.length) {
    const msg = errors.map((e) => e.message).join(", ");
    redirect(`/${locale}/account/register?error=${encodeURIComponent(msg)}`);
  }
  revalidatePath("/");
  redirect(`/${locale}/account/login?registered=1`);
}
