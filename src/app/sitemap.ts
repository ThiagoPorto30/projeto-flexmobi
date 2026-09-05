import type { MetadataRoute } from "next";
import { getAllBikes } from "./lib/catalog";
import { absoluteUrl, indexable } from "./lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];
  return ["/", "/modelos", "/privacidade", ...getAllBikes().map((bike) => `/modelos/${bike.slug}`)].map((path) => ({ url: absoluteUrl(path)! }));
}
