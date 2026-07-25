import type { MetadataRoute } from "next";
import { getAllProductHandles } from "@/lib/queries/products";
import { getAllCollectionHandles } from "@/lib/queries/collections";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl().replace(/\/$/, "");
  const [products, collections] = await Promise.all([getAllProductHandles(), getAllCollectionHandles()]);

  const staticPages = ["", "shop", "about", "contact"];
  const locales = ["ar", "en"];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPages) {
    for (const locale of locales) {
      const prefix = locale === "ar" ? "" : `/${locale}`;
      entries.push({
        url: `${base}${prefix}${path ? "/" + path : ""}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.8,
        alternates: { languages: { ar: `${base}${path ? "/" + path : ""}`, en: `${base}/en${path ? "/" + path : ""}` } },
      });
    }
  }

  for (const handle of collections) {
    for (const locale of locales) {
      const prefix = locale === "ar" ? "" : `/${locale}`;
      entries.push({
        url: `${base}${prefix}/collections/${handle}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: { languages: { ar: `${base}/collections/${handle}`, en: `${base}/en/collections/${handle}` } },
      });
    }
  }

  for (const p of products) {
    for (const locale of locales) {
      const prefix = locale === "ar" ? "" : `/${locale}`;
      entries.push({
        url: `${base}${prefix}/products/${p.handle}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: { languages: { ar: `${base}/products/${p.handle}`, en: `${base}/en/products/${p.handle}` } },
      });
    }
  }

  return entries;
}
