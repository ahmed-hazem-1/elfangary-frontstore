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

/**
 * ensureCart is ONLY used when we genuinely need to create a cart for the first time.
 * For mutations on an existing cart, read the cartId directly from the cookie.
 */
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

/**
 * Add item to cart.
 * If a cart already exists, add directly using its ID (no fetch).
 * Only create a new cart if there is no existing cartId.
 */
export async function addToCartAction(merchandiseId: string, quantity: number): Promise<Cart | null> {
  const existingCartId = cookies().get(CART_COOKIE)?.value;

  if (existingCartId) {
    // Add directly to the existing cart — no getCart() call, no risk of creating a new cart
    const updated = await addCartLines(existingCartId, [{ merchandiseId, quantity }]);
    if (updated) revalidatePath("/");
    return updated;
  }

  // No cart yet — create one with the item already in it
  const cart = await createCart([{ merchandiseId, quantity }]);
  if (cart) {
    cookies().set(CART_COOKIE, cart.id, COOKIE_OPTS);
    revalidatePath("/");
  }
  return cart;
}

/**
 * Update line quantity. Reads cartId directly — no ensureCart().
 * If cart becomes empty, clears discounts and signals client to reset.
 */
export async function updateLineAction(lineId: string, quantity: number): Promise<Cart | null> {
  const cartId = cookies().get(CART_COOKIE)?.value;
  if (!cartId) return null;

  const updated = await updateCartLines(cartId, [{ id: lineId, quantity }]);

  // If cart is now empty, clear discount codes and signal a full reset
  if (updated && updated.lines.edges.length === 0) {
    const { applyDiscountCodes } = await import("@/lib/queries/cart");
    await applyDiscountCodes(cartId, []);
    return null; // Signal client to reset store
  }

  return updated;
}

/**
 * Remove a line. Reads cartId directly — no ensureCart().
 * If cart becomes empty, clears discounts and signals client to reset.
 */
export async function removeLineAction(lineId: string): Promise<Cart | null> {
  const cartId = cookies().get(CART_COOKIE)?.value;
  if (!cartId) return null;

  const updated = await removeCartLines(cartId, [lineId]);

  // If cart is now empty, clear all discount codes on Shopify and signal a full reset
  if (updated && updated.lines.edges.length === 0) {
    const { applyDiscountCodes } = await import("@/lib/queries/cart");
    await applyDiscountCodes(cartId, []);
    return null; // Signal client to reset store
  }

  return updated;
}

/**
 * Apply or clear a discount code. Reads cartId directly — no ensureCart().
 */
export async function applyDiscountCodeAction(code: string): Promise<Cart | null> {
  const cartId = cookies().get(CART_COOKIE)?.value;
  if (!cartId) return null;
  const { applyDiscountCodes } = await import("@/lib/queries/cart");
  return await applyDiscountCodes(cartId, code ? [code] : []);
}

/**
 * Remove the active discount code from the cart.
 */
export async function removeDiscountCodeAction(): Promise<Cart | null> {
  const cartId = cookies().get(CART_COOKIE)?.value;
  if (!cartId) return null;
  const { applyDiscountCodes } = await import("@/lib/queries/cart");
  return await applyDiscountCodes(cartId, []);
}

export async function buyNowAction(merchandiseId: string, quantity: number): Promise<string | null> {
  const { createCart } = await import("@/lib/queries/cart");
  const cart = await createCart([{ merchandiseId, quantity }]);
  return cart?.checkoutUrl ?? null;
}
