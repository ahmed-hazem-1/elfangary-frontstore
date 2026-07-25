import { ShopifyError } from "@/types/shopify";

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN?.trim();
const ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
const API_VERSION = process.env.SHOPIFY_API_VERSION?.trim() || "2024-10";

export function isShopifyConfigured(): boolean {
  return Boolean(STORE_DOMAIN && ACCESS_TOKEN);
}

export function storefrontApiUrl(): string {
  const host = STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `https://${host}/api/${API_VERSION}/graphql.json`;
}

export interface ShopifyFetchOptions {
  revalidate?: number;
  cache?: RequestCache;
  headers?: Record<string, string>;
}

export class ShopifyApiError extends Error {
  errors: ShopifyError[];
  constructor(message: string, errors: ShopifyError[] = []) {
    super(message);
    this.name = "ShopifyApiError";
    this.errors = errors;
  }
}

async function fetchStorefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: ShopifyFetchOptions = {}
): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new ShopifyApiError("Shopify Storefront API is not configured.");
  }
  const endpoint = storefrontApiUrl();
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN!,
      ...options.headers,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: options.revalidate ?? 60 },
    cache: options.cache,
  });
  if (!res.ok) {
    throw new ShopifyApiError(`Storefront API HTTP ${res.status}`);
  }
  const json = await res.json();
  if (json.errors?.length) {
    throw new ShopifyApiError("GraphQL errors", json.errors as ShopifyError[]);
  }
  return json.data as T;
}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: ShopifyFetchOptions = {}
): Promise<T | null> {
  try {
    return await fetchStorefront<T>(query, variables, options);
  } catch (err) {
    if (!isShopifyConfigured()) return null;
    console.error("[shopifyFetch]", err instanceof Error ? err.message : err);
    return null;
  }
}

// Customer Account API (OAuth bearer)
export function isCustomerApiConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID?.trim());
}

export function customerAccountApiUrl(): string {
  return (
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL?.trim() ||
    storefrontApiUrl().replace("/graphql.json", "/customer/api/2024-10/graphql")
  );
}

export async function customerAccountFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  accessToken?: string | null
): Promise<T | null> {
  if (!accessToken || !isCustomerApiConfigured()) return null;
  try {
    const res = await fetch(customerAccountApiUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
        origin: process.env.SHOPIFY_APP_URL?.trim() || "http://localhost:3000",
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
    if (!res.ok) throw new ShopifyApiError(`Customer API HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors?.length) throw new ShopifyApiError("Customer GraphQL errors", json.errors);
    return json.data as T;
  } catch (err) {
    console.error("[customerAccountFetch]", err instanceof Error ? err.message : err);
    return null;
  }
}
