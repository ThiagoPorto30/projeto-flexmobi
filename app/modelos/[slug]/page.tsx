import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bikes } from "../../data/catalog";
import { productDetails } from "../../data/product-details";
import ProductView from "./product-view";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return bikes.map((bike) => ({ slug: bike.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bike = bikes.find((item) => item.id === slug);

  if (!bike) {
    return { title: "Modelo não encontrado · flexmobi.rj" };
  }

  return {
    title: `${bike.name} · flexmobi.rj`,
    description: `${bike.feature} ${bike.detail}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const bike = bikes.find((item) => item.id === slug);
  const details = productDetails[slug];

  if (!bike || !details) notFound();

  const related = [
    ...bikes.filter((item) => item.id !== slug && item.category === bike.category),
    ...bikes.filter((item) => item.id !== slug && item.category !== bike.category),
  ].slice(0, 3);

  return <ProductView bike={bike} details={details} related={related} />;
}
