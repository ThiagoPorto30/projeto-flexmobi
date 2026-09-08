import { Suspense } from "react";
import Link from "next/link";
import CatalogView from "./catalog-view";
import SiteFooter from "../components/site-footer";
import BrandLogo from "../components/brand-logo";
import BikeCard from "../components/bike-card";
import { getAllBikes } from "../lib/catalog";
import { pageMetadata } from "../lib/seo";
import styles from "./catalog.module.css";

export const metadata = pageMetadata("Catálogo de bikes elétricas · flexmobi.rj", "Encontre sua INOW por uso, preço e autonomia. Explore os modelos e consulte um test ride no Rio ou em Niterói.", "/modelos");

export default function ModelsPage() {
  return <main className={styles.page}>
    <header className={styles.header}><BrandLogo href="/" priority /><nav aria-label="Navegação do catálogo"><Link href="/">Início</Link><Link href="/#lojas">Lojas</Link><Link href="/#test-ride">Agendar test ride</Link></nav></header>
    <section className={styles.intro}><p className={styles.eyebrow}>INOW × FLEXMOBI.RJ / CATÁLOGO</p><div><h1>Encontre o<br /><i>seu ritmo.</i></h1><p>Mais cidade, mais possibilidades. Escolha pelo que importa na sua rotina e conheça cada bike de perto.<Link href="/#quiz">Precisa de ajuda para escolher?</Link></p></div></section>
    <Suspense fallback={<section className={styles.catalog} aria-label="Modelos"><p>Explore os modelos. Os filtros estarão disponíveis assim que a página carregar.</p><div className={styles.grid}>{getAllBikes().slice(0, 12).map(bike => <BikeCard key={bike.id} bike={bike} />)}</div></section>}><CatalogView /></Suspense>
    <SiteFooter />
  </main>;
}
