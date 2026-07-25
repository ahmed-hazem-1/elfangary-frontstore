import type { Product, Collection, Shop } from "@/types/shopify";
import { shopMetafield } from "@/lib/queries/shop";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || "http://localhost:3000";

export function siteUrl(): string {
  return SITE_URL;
}

export function canonical(locale: string, path = ""): string {
  const base = locale === "ar" ? SITE_URL : `${SITE_URL}/${locale}`;
  return `${base}${path ? "/" + path.replace(/^\/+/, "") : ""}`;
}

export interface SeoMeta {
  title?: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
}

export function baseMetadata(meta: SeoMeta) {
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    robots: meta.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  };
}

export function productJsonLd(product: Product, locale: string, url: string) {
  const price = product.priceRange?.minVariantPrice;
  const image = product.featuredImage?.url;
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image,
    sku: product.variants?.edges?.[0]?.node?.sku || undefined,
    brand: { "@type": "Brand", name: product.vendor || "Elfangary" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: price?.currencyCode,
      price: price?.amount,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function organizationJsonLd(shop: Shop | null) {
  const name = shop?.name || "Elfangary / الفنجري";
  const logo = shop?.brand?.logo?.image?.url;
  return {
    "@context": "https://schema.org/",
    "@type": "Organization",
    name,
    url: SITE_URL,
    logo: logo || undefined,
    sameAs: [
      shopMetafield(shop, "social_facebook"),
      shopMetafield(shop, "social_instagram"),
      shopMetafield(shop, "social_twitter"),
    ].filter(Boolean) as string[],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: shopMetafield(shop, "store_phone") || undefined,
      email: shopMetafield(shop, "store_email") || undefined,
      contactType: "customer service",
    },
  };
}
