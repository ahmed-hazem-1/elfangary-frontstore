import { shopifyFetch } from "@/lib/shopify";
import type { Metaobject } from "@/types/shopify";

export async function getMetaobjects(type: string, first = 20): Promise<Metaobject[]> {
  type Response = { metaobjects: { edges: Array<{ node: Metaobject }> } | null };
  const data = await shopifyFetch<Response>(
    `query Metaobjects($type: String!, $first: Int!) {
      metaobjects(type: $type, first: $first) {
        edges {
          node {
            id type handle
            fields { key value type reference { ... on MediaImage { image { url altText } } } }
          }
        }
      }
    }`,
    { type, first },
    { revalidate: 3600 }
  );
  return data?.metaobjects?.edges.map((e) => e.node) ?? [];
}

export function metaobjectField(obj: Metaobject | undefined | null, key: string): string {
  return obj?.fields.find((f) => f.key === key)?.value ?? "";
}

export function metaobjectImage(obj: Metaobject | undefined | null, key: string): { url: string; altText?: string | null } | null {
  const f = obj?.fields.find((x) => x.key === key);
  return f?.reference?.image ?? null;
}
