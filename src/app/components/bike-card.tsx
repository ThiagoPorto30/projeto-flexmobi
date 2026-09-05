import Image from "next/image";
import Link from "next/link";
import type { Bike } from "../data/catalog";
import styles from "./bike-card.module.css";

export default function BikeCard({ bike }: { bike: Bike }) {
  return <article className={styles.card}>
    <Link href={`/modelos/${bike.slug}`} className={styles.link} aria-label={`Conhecer ${bike.name}`}>
      <div className={styles.visual}><span className={styles.badge}>{bike.badge}</span><Image src={bike.image} alt={bike.name} width={800} height={600} sizes="(max-width: 600px) 90vw, (max-width: 1100px) 44vw, 28vw" /></div>
      <div className={styles.copy}><p className={styles.category}>{bike.category}</p><h3>{bike.name.replace("INOW ", "")}</h3><p className={styles.feature}>{bike.feature}</p>
        <dl className={styles.specs}><div><dt>Autonomia estimada</dt><dd>{bike.range}</dd></div><div><dt>Motor</dt><dd>{bike.motor}</dd></div></dl>
        <p className={styles.status}>{bike.available ? "● Disponibilidade sob consulta" : "◌ Em breve"}</p>
        <div className={styles.bottom}><div><small>Preço de catálogo</small><strong>{bike.price}</strong></div></div>
        <span className={styles.details}>Conhecer modelo <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  </article>;
}
