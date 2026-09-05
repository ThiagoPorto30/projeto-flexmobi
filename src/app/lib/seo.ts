import type { Metadata } from "next";

function configuredOrigin() {
  const value = process.env.SITE_URL?.trim();
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("SITE_URL deve conter apenas o domínio HTTPS oficial, sem caminho, credenciais ou parâmetros.");
  }
  return url.origin;
}

export const siteOrigin = configuredOrigin();
export const indexable = Boolean(siteOrigin) && process.env.SITE_INDEXABLE === "true"
  && process.env.NODE_ENV === "production"
  && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");

export function absoluteUrl(path: string) {
  return siteOrigin ? new URL(path, siteOrigin).href : undefined;
}

export function pageMetadata(title: string, description: string, path: string, image = "/imagens/otimizadas/026_v20-brake-pro-cover.jpg.webp"): Metadata {
  const url = absoluteUrl(path);
  return {
    title, description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: { title, description, url, siteName: "flexmobi.rj", locale: "pt_BR", type: "website", images: [{ url: image, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
