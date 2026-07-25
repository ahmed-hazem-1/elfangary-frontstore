import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { exchangeCodeForTokens } from "@/lib/auth";
import { CUSTOMER_TOKEN_COOKIE, CUSTOMER_REFRESH_COOKIE, COOKIE_OPTS } from "@/lib/utils/cartCookie";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") || "ar";
  const error = url.searchParams.get("error");

  if (error || !code) {
    redirect(`/${state}/account/login?error=${encodeURIComponent(error || "no_code")}`);
  }

  const tokens = await exchangeCodeForTokens(code, state);
  if (!tokens?.access_token) {
    redirect(`/${state}/account/login?error=token_exchange_failed`);
  }

  const res = NextResponse.redirect(new URL(`/${state}/account`, req.url));
  res.cookies.set(CUSTOMER_TOKEN_COOKIE, tokens.access_token, COOKIE_OPTS);
  if (tokens.refresh_token) {
    res.cookies.set(CUSTOMER_REFRESH_COOKIE, tokens.refresh_token, COOKIE_OPTS);
  }
  return res;
}
