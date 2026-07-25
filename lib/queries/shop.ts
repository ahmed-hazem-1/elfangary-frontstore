import { shopifyFetch } from "@/lib/shopify";
import type { Shop } from "@/types/shopify";

export async function getShop(): Promise<Shop | null> {
  const data = await shopifyFetch<{ shop: Shop }>(
    `query Shop {
      shop {
        id name description
        primaryDomain { url host }
        paymentSettings { currencyCode }
        brand { logo { image { url altText width height } } }
        metafields(identifiers: [
          { namespace: "custom", key: "hero_image" }
          { namespace: "custom", key: "hero_title_ar" }
          { namespace: "custom", key: "hero_title_en" }
          { namespace: "custom", key: "hero_subtext" }
          { namespace: "custom", key: "hero_cta_primary" }
          { namespace: "custom", key: "hero_cta_secondary" }
          { namespace: "custom", key: "featured_product_handle" }
          { namespace: "custom", key: "social_facebook" }
          { namespace: "custom", key: "social_instagram" }
          { namespace: "custom", key: "social_twitter" }
          { namespace: "custom", key: "social_whatsapp" }
          { namespace: "custom", key: "store_phone" }
          { namespace: "custom", key: "store_email" }
          { namespace: "custom", key: "store_address" }
          { namespace: "custom", key: "store_maps" }
        ]) { key value type }
      }
    }`,
    {},
    { revalidate: 3600 }
  );
  return data?.shop ?? null;
}

export function shopMetafield(shop: Shop | null, key: string): string | null {
  return shop?.metafields?.find((m) => m?.key === key)?.value ?? null;
}
