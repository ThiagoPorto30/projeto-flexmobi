import Image from "next/image";
import { Bike, bikeUses } from "../data/catalog";
import styles from "./featured-catalog.module.css";

type FeaturedCatalogProps = {
  bikes: Bike[];
};

export default function FeaturedCatalog({ bikes }: FeaturedCatalogProps) {
  return (
    <div className={styles.catalog}>
      <div className={styles.intro} data-reveal>
        <div>
          <p className="eyebrow eyebrow--dark"><span /> Curadoria INOW</p>
          <h2>Uma bike<br />para o <i>seu caminho.</i></h2>
        </div>
        <div>
          <p>Uma primeira seleção para sentir a diferença na rua. O catálogo completo reúne todas as versões e detalhes de cada modelo.</p>
          <a className="button button--dark" href="/modelos">Explorar todos os modelos</a>
        </div>
      </div>

      <div className={styles.grid} data-reveal>
        {bikes.map((bike) => (
          <article className={styles.card} key={bike.id}>
            <div className={styles.cardHead}>
              <span>{bike.category}</span>
              <span className={bike.available ? styles.available : styles.soon}>{bike.available ? "na loja" : "em breve"}</span>
            </div>
            <div className={styles.imageWrap}>
              <Image src={bike.image} alt={`${bike.name} — bicicleta elétrica INOW`} fill sizes="(max-width: 720px) 120px, (max-width: 980px) 50vw, 25vw" className={styles.image} />
            </div>
            <p className={styles.badge}>{bike.badge}</p>
            <h3>{bike.name}</h3>
            <p className={styles.detail}>{bike.detail}</p>
            <div className={styles.price}><span>a partir de</span><strong>{bike.price}</strong></div>
            <a className={styles.cardLink} href={`/modelos/${bike.slug}`}>Ver ficha <span aria-hidden="true">→</span></a>
          </article>
        ))}
      </div>

      <div className={styles.uses} data-reveal>
        <div><p className="micro-label">Encontre pelo seu uso</p><p>Prefere começar pelo caminho, e não pelo modelo? Veja as opções que combinam com sua rotina.</p></div>
        <div className={styles.useLinks}>{bikeUses.map((use) => <a key={use.id} href={`/modelos?uso=${encodeURIComponent(use.id)}`}><span>{use.label}</span><small>{use.description}</small></a>)}</div>
      </div>
    </div>
  );
}
