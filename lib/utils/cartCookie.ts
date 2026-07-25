import type { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const CART_COOKIE = "cart_id";
export const CUSTOMER_TOKEN_COOKIE = "customer_access_token";
export const CUSTOMER_REFRESH_COOKIE = "customer_refresh_token";

export const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 365,
};

export function getCartId(): string | undefined {
  return cookies().get(CART_COOKIE)?.value;
}

export function setCartCookie(res: NextResponse, id: string) {
  res.cookies.set(CART_COOKIE, id, COOKIE_OPTS);
}

export function getCartIdFromRequest(req: NextRequest): string | undefined {
  return req.cookies.get(CART_COOKIE)?.value;
}
