"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Bike } from "../../data/catalog";
import type { ProductDetail } from "../../data/product-details";
import styles from "./product.module.css";

type ProductViewProps = {
  bike: Bike;
  details: ProductDetail;
  related: Bike[];
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Brand() {
  return (
    <Link className={styles.brand} href="/#top" aria-label="flexmobi.rj — página inicial">
      <span className={styles.brandMark}>f</span>
      <span className={styles.brandName}>flexmobi</span>
      <span className={styles.brandSuffix}>.rj</span>
    </Link>
  );
}

export default function ProductView({ bike, details, related }: ProductViewProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const testRideHref = `/?model=${encodeURIComponent(bike.id)}#test-ride`;

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  const baseSpecs = [
    { label: "Motor", value: bike.motor },
    { label: "Autonomia estimada", value: bike.range },
    { label: "Bateria", value: bike.battery },
    { label: "Capacidade", value: bike.support },
  ];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Brand />
        <nav className={styles.nav} aria-label="Navegação do produto">
          <Link href="/#catalogo">Modelos</Link>
          <a href="#desempenho">Destaques</a>
          <a href="#ficha">Ficha técnica</a>
          <Link href="/#lojas">Lojas</Link>
        </nav>
        <Link className={styles.headerCta} href={testRideHref}>
          Agendar test ride <Arrow />
        </Link>
        <button className={styles.mobileMenuTrigger} type="button" aria-expanded={mobileMenuOpen} aria-controls="product-mobile-navigation" aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMobileMenuOpen((open) => !open)}><span /><span /></button>
      </header>
      <div className={styles.mobileMenuShell}><div id="product-mobile-navigation" className={`${styles.mobileMenu} t-panel-slide`} data-open={mobileMenuOpen} aria-hidden={!mobileMenuOpen}><nav aria-label="Navegação móvel do produto"><Link href="/#catalogo" onClick={() => setMobileMenuOpen(false)}>Modelos</Link><a href="#desempenho" onClick={() => setMobileMenuOpen(false)}>Destaques</a><a href="#ficha" onClick={() => setMobileMenuOpen(false)}>Ficha técnica</a><Link href="/#lojas" onClick={() => setMobileMenuOpen(false)}>Lojas</Link></nav><Link className={styles.mobileMenuCta} href={testRideHref}>Agendar test ride <Arrow /></Link></div></div>

      <section className={styles.hero}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Início</Link><span>/</span><Link href="/#catalogo">Modelos</Link><span>/</span><b>{bike.name.replace("INOW ", "")}</b>
        </div>

        <div className={styles.gallery}>
          <div className={styles.galleryMeta}>
            <span>{String(activeImage + 1).padStart(2, "0")} / {String(details.gallery.length).padStart(2, "0")}</span>
            <span>arraste o olhar</span>
          </div>
          <div className={styles.mainImage}>
            <Image
              key={details.gallery[activeImage]}
              src={details.gallery[activeImage]}
              alt={`${bike.name} — vista ${activeImage + 1}`}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
            />
            <span className={styles.imageWord} aria-hidden="true">{bike.name.replace("INOW ", "")}</span>
          </div>
          <div className={styles.thumbnails} aria-label="Galeria do modelo">
            {details.gallery.map((image, index) => (
              <button
                type="button"
                key={image}
                aria-label={`Mostrar vista ${index + 1}`}
                aria-pressed={activeImage === index}
                className={activeImage === index ? styles.thumbnailActive : ""}
                onClick={() => setActiveImage(index)}
              >
                <Image src={image} alt="" fill sizes="92px" priority={index === 0} />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.productIntro}>
          <div className={styles.introTopline}>
            <span>{bike.category}</span>
            <span className={bike.available ? styles.available : styles.soon}>
              {bike.available ? "Disponível na loja" : "Disponível em breve"}
            </span>
          </div>
          <p className={styles.badge}>{bike.badge}</p>
          <h1><small>INOW</small>{bike.name.replace("INOW ", "")}</h1>
          <p className={styles.feature}>{bike.feature}</p>
          <p className={styles.detail}>{bike.detail}</p>

          <div className={styles.colorBlock}>
            <span>Cores apresentadas</span>
            <div>{details.colors.map((color, index) => <i key={color}><b className={styles[`color${index + 1}`]} />{color}</i>)}</div>
          </div>

          <div className={styles.priceBlock}>
            <div>
              <span>Preço de catálogo</span>
              <strong>{bike.price}</strong>
              <del>{bike.originalPrice}</del>
            </div>
            <small>Confirme disponibilidade, cores e condições diretamente na loja.</small>
          </div>

          <div className={styles.actions}>
            <Link className={styles.primaryButton} href={testRideHref}>
              {bike.available ? "Testar esta bike" : "Quero saber quando chegar"} <Arrow />
            </Link>
            <Link className={styles.secondaryButton} href="/#lojas">Ver as lojas <Arrow /></Link>
          </div>

          <div className={styles.serviceNotes}>
            <span><b>01</b> Atendimento presencial</span>
            <span><b>02</b> Assistência especializada</span>
            <span><b>03</b> Sem pagamento online</span>
          </div>
        </div>
      </section>

      <section className={styles.specStrip} aria-label="Especificações principais">
        {baseSpecs.map((spec, index) => (
          <div key={spec.label}>
            <span>{String(index + 1).padStart(2, "0")} / {spec.label}</span>
            <strong>{spec.value}</strong>
          </div>
        ))}
      </section>

      <section className={styles.story} id="desempenho">
        <div className={styles.storyImage}>
          <Image src={details.gallery[1] ?? details.gallery[0]} alt={`${bike.name} em detalhe`} fill sizes="(max-width: 900px) 100vw, 52vw" />
          <span>Flexmobi.rj / seleção urbana</span>
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.kicker}>01 — a experiência</p>
          <h2>{details.storyTitle}</h2>
          <p>{details.storyBody}</p>
          <blockquote>“A ficha apresenta. O test ride decide.”</blockquote>
        </div>
      </section>

      <section className={styles.highlights}>
        <div className={styles.sectionHeading}>
          <p>02 — por que ela</p>
          <h2>Feita para o<br /><i>ritmo real.</i></h2>
        </div>
        <div className={styles.highlightList}>
          {details.highlights.map((highlight) => (
            <article key={highlight.index}>
              <span>{highlight.index}</span>
              <h3>{highlight.title}</h3>
              <p>{highlight.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.detailGallery} aria-label="Detalhes visuais">
        <div><Image src={details.gallery[2] ?? details.gallery[0]} alt={`${bike.name} — acabamento`} fill sizes="(max-width: 700px) 100vw, 62vw" /></div>
        <div><Image src={details.gallery[3] ?? details.gallery[1] ?? details.gallery[0]} alt={`${bike.name} — componentes`} fill sizes="(max-width: 700px) 100vw, 38vw" /></div>
        <p><span>03 / detalhes</span>Design que você vê.<br />Desempenho que você sente.</p>
      </section>

      <section className={styles.technical} id="ficha">
        <div className={styles.technicalTitle}>
          <p>04 — ficha técnica</p>
          <h2>O que move<br /><i>{bike.name.replace("INOW ", "")}.</i></h2>
          <p>Dados de catálogo para orientar sua escolha. Autonomia varia com peso, percurso, modo de assistência e condições de uso.</p>
        </div>
        <div className={styles.technicalBody}>
          <div className={styles.technicalRows}>
            {[...baseSpecs, ...details.technical].map((spec) => (
              <div key={`${spec.label}-${spec.value}`}><span>{spec.label}</span><strong>{spec.value}</strong></div>
            ))}
          </div>
          <aside>
            <span>Ideal para</span>
            {details.idealFor.map((item, index) => <p key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</p>)}
            <small>Garantia, documentação e condições comerciais são confirmadas no atendimento da loja.</small>
          </aside>
        </div>
      </section>

      <section className={styles.related}>
        <div className={styles.relatedHeader}>
          <div><p>05 — continue explorando</p><h2>Outros<br /><i>ritmos.</i></h2></div>
          <Link href="/#catalogo">Ver catálogo completo <Arrow /></Link>
        </div>
        <div className={styles.relatedList}>
          {related.map((item, index) => (
            <Link href={`/modelos/${item.id}`} key={item.id}>
              <span className={styles.relatedIndex}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.relatedImage}><Image src={item.image} alt="" fill sizes="180px" /></span>
              <span className={styles.relatedName}><small>{item.category}</small><strong>{item.name}</strong></span>
              <span className={styles.relatedPrice}><small>a partir de</small>{item.price}</span>
              <Arrow />
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.closing}>
        <p>Agora falta uma coisa.</p>
        <h2>Sentir a bike<br /><i>na cidade.</i></h2>
        <Link href={testRideHref}>Agendar test ride com a {bike.name.replace("INOW ", "")} <Arrow /></Link>
        <span>Icaraí / Niterói — Ipanema / Rio de Janeiro</span>
      </section>

      <footer className={styles.footer}>
        <Brand />
        <p>Viva o Rio no seu ritmo.</p>
        <span>© 2026 flexmobi.rj · INOW + Flex Mobi</span>
      </footer>

      <Link className={styles.mobileCta} href={testRideHref}>Agendar test ride <Arrow /></Link>
    </main>
  );
}
