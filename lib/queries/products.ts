import { shopifyFetch } from "@/lib/shopify";
import type { Product } from "@/types/shopify";

export const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    id handle title description descriptionHtml vendor productType tags
    availableForSale
    featuredImage { url altText width height }
    options { id name values }
    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
    variants(first: 100) {
      edges {
        node {
          id title availableForSale sku
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText }
          selectedOptions { name value }
          unitPrice { amount currencyCode }
        }
      }
    }
    images(first: 10) { edges { node { url altText width height } } }
    seo { title description }
    metafields(identifiers: [
      { namespace: "custom", key: "nutrition" }
      { namespace: "custom", key: "origin" }
      { namespace: "custom", key: "season" }
      { namespace: "custom", key: "certifications" }
    ]) { key namespace value type }
    updatedAt
  }
`;

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const decodedHandle = decodeURIComponent(handle);
  console.log("[getProductByHandle] original handle:", handle, "decoded:", decodedHandle);
  const data = await shopifyFetch<{ product: Product | null }>(
    `query ProductByHandle($handle: String!) { product(handle: $handle) { ...ProductFields } } ${PRODUCT_FIELDS}`,
    { handle: decodedHandle },
    { revalidate: 60 }
  );
  console.log("[getProductByHandle] result:", data?.product ? "FOUND" : "NOT FOUND");
  return data?.product ?? null;
}

export async function getProducts({
  first = 24,
  after,
  sortKey = "RELEVANCE",
  reverse = false,
  query,
}: {
  first?: number;
  after?: string | null;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
} = {}): Promise<{ products: Product[]; hasNextPage: boolean; endCursor: string | null } | null> {
  const data = await shopifyFetch<{
    products: {
      edges: { node: Product; cursor: string }[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  }>(
    `query Products($first: Int!, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
        edges { node { ...ProductFields } cursor }
        pageInfo { hasNextPage endCursor }
      }
    } ${PRODUCT_FIELDS}`,
    { first, after: after ?? null, sortKey, reverse, query },
    { revalidate: 60 }
  );
  if (!data) return null;
  return {
    products: data.products.edges.map((e) => e.node),
    hasNextPage: data.products.pageInfo.hasNextPage,
    endCursor: data.products.pageInfo.endCursor,
  };
}

export async function getProductRecommendations(productId: string): Promise<Product[] | null> {
  const data = await shopifyFetch<{ productRecommendations: Product[] | null }>(
    `query Recommendations($productId: ID!) { productRecommendations(productId: $productId) { ...ProductFields } } ${PRODUCT_FIELDS}`,
    { productId },
    { revalidate: 60 }
  );
  return data?.productRecommendations ?? null;
}

export async function getAllProductHandles(): Promise<{ handle: string; updatedAt: string }[]> {
  const data = await shopifyFetch<{
    products: { edges: { node: { handle: string; updatedAt: string } }[] };
  }>(
    `query AllProductHandles { products(first: 250) { edges { node { handle updatedAt } } } }`,
    {},
    { revalidate: 3600 }
  );
  return data?.products.edges.map((e) => e.node) ?? [];
}
