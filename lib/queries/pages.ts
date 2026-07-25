import { shopifyFetch } from "@/lib/shopify";
import type { Page } from "@/types/shopify";

export async function getPageByHandle(handle: string): Promise<Page | null> {
  const decodedHandle = decodeURIComponent(handle);
  const data = await shopifyFetch<{ page: Page | null }>(
    `query PageByHandle($handle: String!) {
      page(handle: $handle) {
        id handle title body bodySummary url seo { title description } updatedAt
      }
    }`,
    { handle: decodedHandle },
    { revalidate: 3600 }
  );
  return data?.page ?? null;
}
