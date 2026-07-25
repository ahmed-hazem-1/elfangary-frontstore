import { shopifyFetch } from "@/lib/shopify";
import type { Collection } from "@/types/shopify";

export async function getCollections(first = 100): Promise<Collection[]> {
  const data = await shopifyFetch<{
    collections: { edges: { node: Collection }[] };
  }>(
    `query Collections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id handle title description descriptionHtml
            image { url altText width height }
          }
        }
      }
    }`,
    { first },
    { revalidate: 60 }
  );
  return data?.collections.edges.map((e) => e.node) ?? [];
}

export async function getCollectionByHandle(handle: string, first = 24, after?: string | null): Promise<Collection | null> {
  const decodedHandle = decodeURIComponent(handle);
  const data = await shopifyFetch<{ collection: Collection | null }>(
    `query CollectionByHandle($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        id handle title description descriptionHtml
        image { url altText width height }
        products(first: $first, after: $after) {
          edges {
            node {
              id handle title descriptionHtml vendor productType tags availableForSale
              featuredImage { url altText width height }
              priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
              variants(first: 10) { edges { node { id title availableForSale price { amount currencyCode } image { url altText } } } }
              options { id name values }
            }
            cursor
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    }`,
    { handle: decodedHandle, first, after: after ?? null },
    { revalidate: 60 }
  );
  return data?.collection ?? null;
}

export async function getAllCollectionHandles(): Promise<string[]> {
  const data = await shopifyFetch<{
    collections: { edges: { node: { handle: string } }[] };
  }>(
    `query AllCollectionHandles { collections(first: 250) { edges { node { handle } } } }`,
    {},
    { revalidate: 3600 }
  );
  return data?.collections.edges.map((e) => e.node.handle) ?? [];
}
