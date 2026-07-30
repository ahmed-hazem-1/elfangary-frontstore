"use server";

import { getProducts } from "@/lib/queries/products";

export async function searchProductsAction(query: string) {
  if (!query) return [];
  const result = await getProducts({ query, first: 5 });
  return result?.products || [];
}
