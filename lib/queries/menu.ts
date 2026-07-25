import { shopifyFetch } from "@/lib/shopify";
import type { Menu } from "@/types/shopify";

export async function getMenu(handle: string): Promise<Menu["items"]> {
  const data = await shopifyFetch<{ menu: Menu | null }>(
    `query Menu($handle: String!) {
      menu(handle: $handle) {
        items {
          id title type url
          items { id title type url }
        }
      }
    }`,
    { handle },
    { revalidate: 3600 }
  );
  return data?.menu?.items ?? [];
}
