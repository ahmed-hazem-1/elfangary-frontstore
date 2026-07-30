import { shopifyFetch } from "@/lib/shopify";
import type { Cart } from "@/types/shopify";

const CART_FIELDS = `
  fragment CartFields on Cart {
    id checkoutUrl totalQuantity
    lines(first: 100) {
      edges {
        node {
          id quantity
          merchandise {
            ... on ProductVariant {
              id title
              image { url altText }
              product { handle title }
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              selectedOptions { name value }
            }
          }
          estimatedCost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
          discountAllocations { discountedAmount { amount currencyCode } }
        }
      }
    }
    cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } checkoutChargeAmount { amount currencyCode } totalTaxAmount { amount currencyCode } }
    discountCodes { code applicable }
  }
`;

export async function createCart(lineItems: { merchandiseId: string; quantity: number }[] = []): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartCreate: { cart: Cart | null } }>(
    `mutation CartCreate($input: CartInput!) { cartCreate(input: $input) { cart { ...CartFields } } } ${CART_FIELDS}`,
    { input: { lines: lineItems } },
    { cache: "no-store" }
  );
  return data?.cartCreate.cart ?? null;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: Cart | null }>(
    `query GetCart($id: ID!) { cart(id: $id) { ...CartFields } } ${CART_FIELDS}`,
    { id: cartId },
    { cache: "no-store" }
  );
  return data?.cart ?? null;
}

export async function addCartLines(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart | null } }>(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
    } ${CART_FIELDS}`,
    { cartId, lines },
    { cache: "no-store" }
  );
  return data?.cartLinesAdd.cart ?? null;
}

export async function updateCartLines(cartId: string, lines: { id: string; quantity: number }[]): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: Cart | null } }>(
    `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
    } ${CART_FIELDS}`,
    { cartId, lines },
    { cache: "no-store" }
  );
  return data?.cartLinesUpdate.cart ?? null;
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: Cart | null } }>(
    `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } }
    } ${CART_FIELDS}`,
    { cartId, lineIds },
    { cache: "no-store" }
  );
  return data?.cartLinesRemove.cart ?? null;
}

export async function applyDiscountCodes(cartId: string, discountCodes: string[]): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartDiscountCodesUpdate: { cart: Cart | null } }>(
    `mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) { cart { ...CartFields } }
    } ${CART_FIELDS}`,
    { cartId, discountCodes },
    { cache: "no-store" }
  );
  return data?.cartDiscountCodesUpdate.cart ?? null;
}
