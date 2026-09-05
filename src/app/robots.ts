import type { MetadataRoute } from "next";
import { absoluteUrl, indexable } from "./lib/seo";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: indexable ? absoluteUrl("/sitemap.xml") : undefined };
}
