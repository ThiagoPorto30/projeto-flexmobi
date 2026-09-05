import Home from "./home-view";
import StructuredData from "./components/structured-data";
import { stores, business } from "./data/business";
import { absoluteUrl, pageMetadata, siteOrigin } from "./lib/seo";

export const metadata = pageMetadata("Bikes elétricas no Rio e em Niterói · flexmobi.rj", "Conheça os modelos INOW, compare as fichas técnicas e planeje seu test ride nas lojas flexmobi.rj de Icaraí e Ipanema.", "/");

export default function Page() {
  return <>{siteOrigin ? <StructuredData data={{ "@context": "https://schema.org", "@graph": stores.map((store) => ({
    "@type": "BikeStore", "@id": absoluteUrl(`/#loja-${store.id}`), name: `flexmobi.rj — ${store.name}`,
    url: absoluteUrl("/#lojas"), hasMap: store.map,
    ...(business.whatsapp ? { telephone: `+${business.whatsapp}` } : {}),
    address: { "@type": "PostalAddress", streetAddress: store.address, addressLocality: store.locality, addressRegion: "RJ", addressCountry: "BR" },
  })) }} /> : null}<Home /></>;
}
