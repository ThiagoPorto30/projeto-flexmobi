import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBikes, getBikeBySlug, getRelatedBikes } from "../../lib/catalog";
import { getBikeDetails, validateCatalogImages } from "../../lib/catalog-server";
import ProductView from "./product-view";
import StructuredData from "../../components/structured-data";
import { absoluteUrl, pageMetadata, siteOrigin } from "../../lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  validateCatalogImages();
  return getAllBikes().map((bike) => ({ slug: bike.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bike = getBikeBySlug(slug);

  if (!bike) {
    return { title: "Modelo não encontrado · flexmobi.rj" };
  }

  return pageMetadata(`${bike.name} · flexmobi.rj`, `${bike.feature} Veja a ficha técnica e consulte o test ride em Icaraí ou Ipanema.`, `/modelos/${bike.slug}`, bike.image);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const bike = getBikeBySlug(slug);
  const details = bike ? getBikeDetails(slug) : undefined;

  if (!bike || !details) notFound();

  const related = getRelatedBikes(slug);

  return <>{siteOrigin ? <StructuredData data={{ "@context": "https://schema.org", "@graph": [
    { "@type": "Product", "@id": absoluteUrl(`/modelos/${bike.slug}#produto`), name: bike.name, description: `${bike.feature} ${bike.detail}`, image: details.gallery.map((image) => absoluteUrl(image)), brand: { "@type": "Brand", name: "INOW" }, model: bike.name, url: absoluteUrl(`/modelos/${bike.slug}`) },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Modelos", item: absoluteUrl("/modelos") },
      { "@type": "ListItem", position: 3, name: bike.name, item: absoluteUrl(`/modelos/${bike.slug}`) },
    ] },
  ] }} /> : null}<ProductView bike={bike} details={details} related={related} /></>;
}
