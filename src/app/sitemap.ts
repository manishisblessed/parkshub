import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/text";
import { sitemapEntries } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticPaths = ["", "/about", "/business", "/products", "/services", "/farmers", "/buyers", "/sustainability", "/insights", "/contact", "/faqs", "/privacy", "/terms", "/cookies", "/disclaimer", "/sitemap", "/register"];
  const { verticals, services, products, posts } = await sitemapEntries();
  return [
    ...staticPaths.map((path) => ({ url: `${base}${path || "/"}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...verticals.map((item) => ({ url: `${base}/business/${item.slug}`, lastModified: item.updatedAt })),
    ...services.map((item) => ({ url: `${base}/services/${item.slug}`, lastModified: item.updatedAt })),
    ...products.map((item) => ({ url: `${base}/products/${item.slug}`, lastModified: item.updatedAt })),
    ...posts.map((item) => ({ url: `${base}/insights/${item.slug}`, lastModified: item.updatedAt })),
  ];
}
