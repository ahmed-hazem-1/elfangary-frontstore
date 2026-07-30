import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = intlMiddleware(req);

  // Protect /:locale/account pages when no customer token cookie present.
  const accountMatch = pathname.match(/^\/(ar|en)\/account(\/|$)/);
  if (accountMatch && !pathname.includes("/login") && !pathname.includes("/register") && !pathname.includes("/callback")) {
    const token = req.cookies.get("customer_access_token")?.value;
    if (!token) {
      const locale = accountMatch[1];
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/account/login`;
      return NextResponse.redirect(url);
    }
  }

  // Redirect /cart to / since cart is now drawer-only
  const cartMatch = pathname.match(/^\/(ar|en)\/cart(\/|$)/);
  if (cartMatch) {
    const locale = cartMatch[1];
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
