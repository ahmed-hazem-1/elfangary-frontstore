"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
} from "@/lib/queries/cart";
import { CART_COOKIE, COOKIE_OPTS } from "@/lib/utils/cartCookie";
import type { Cart } from "@/types/shopify";

export async function ensureCart(): Promise<Cart | null> {
  const existing = cookies().get(CART_COOKIE)?.value;
  if (existing) {
    const { getCart } = await import("@/lib/queries/cart");
    const cart = await getCart(existing);
    if (cart) return cart;
  }
  const cart = await createCart([]);
  if (cart) cookies().set(CART_COOKIE, cart.id, COOKIE_OPTS);
  return cart;
}

export async function addToCartAction(merchandiseId: string, quantity: number): Promise<Cart | null> {
  const cart = await ensureCart();
  if (!cart) return null;
  const updated = await addCartLines(cart.id, [{ merchandiseId, quantity }]);
  if (updated) revalidatePath("/");
  return updated;
}

export async function updateLineAction(lineId: string, quantity: number): Promise<Cart | null> {
  const cart = await ensureCart();
  if (!cart) return null;
  const updated = await updateCartLines(cart.id, [{ id: lineId, quantity }]);
  return updated;
}

export async function removeLineAction(lineId: string): Promise<Cart | null> {
  const cart = await ensureCart();
  if (!cart) return null;
  const updated = await removeCartLines(cart.id, [lineId]);
  return updated;
}

export async function applyDiscountCodeAction(code: string): Promise<Cart | null> {
  const cart = await ensureCart();
  if (!cart) return null;
  const { applyDiscountCodes } = await import("@/lib/queries/cart");
  // Pass an empty array to remove codes if code is empty, otherwise apply it
  const updated = await applyDiscountCodes(cart.id, code ? [code] : []);
  return updated;
}

export async function buyNowAction(merchandiseId: string, quantity: number): Promise<string | null> {
  const { createCart } = await import("@/lib/queries/cart");
  const cart = await createCart([{ merchandiseId, quantity }]);
  return cart?.checkoutUrl ?? null;
}
