"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { bikes, catalogCategories, Bike } from "./data/catalog";

const stores = [
  { number: "01", name: "Icaraí", city: "Niterói · RJ", address: "R. Pres. Backer, 9", note: "A loja para começar a testar a cidade.", map: "https://maps.app.goo.gl/rS5L2zKQYiuf622b8" },
  { number: "02", name: "Ipanema", city: "Rio de Janeiro · RJ", address: "R. Teixeira de Melo, 21", note: "Perto do mar, pronta para o seu próximo caminho.", map: "https://maps.app.goo.gl/mf9dPNSM2ZjgDZEJ6" },
];

const quizOptions = [
  { id: "compacta", label: "Fácil de guardar", description: "Elevador, porta-malas e deslocamentos curtos.", bikeId: "inow-v20-mini" },
  { id: "passageiro", label: "Levar alguém", description: "Conforto para dividir o caminho.", bikeId: "inow-v20-brake-pro" },
  { id: "distancia", label: "Ir mais longe", description: "Autonomia para esquecer a tomada por dias.", bikeId: "inow-v35" },
  { id: "presenca", label: "Presença e desempenho", description: "Potência, estilo e resposta na saída.", bikeId: "inow-x50-action-pro" },
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

function Brand({ footer = false }: { footer?: boolean }) {
  return <a className={`brand ${footer ? "brand--footer" : ""}`} href="#top" aria-label="flexmobi.rj início"><span className="brand-mark">f</span><span className="brand-name">flexmobi</span><span className="brand-suffix">.rj</span></a>;
}

function ModelImage({ bike, className = "", priority = false, sizes = "(max-width: 820px) 100vw, 50vw" }: { bike: Bike; className?: string; priority?: boolean; sizes?: string }) {
  return <Image className={className} src={bike.image} alt={`${bike.name} — bicicleta elétrica INOW`} width={1600} height={1200} priority={priority} sizes={sizes} />;
}

function MobileCatalog({ models, selectedId, onSelect }: { models: Bike[]; selectedId: string; onSelect: (bikeId: string) => void }) {
  return (
    <div className="mobile-model-list" aria-label="Modelos, toque para ver detalhes">
      {models.map((bike) => {
        const isOpen = selectedId === bike.id;
        const bikeIndex = String(bikes.findIndex((item) => item.id === bike.id) + 1).padStart(2, "0");
        const panelId = `mobile-model-panel-${bike.id}`;

        return (
          <article id={`mobile-model-${bike.id}`} className="mobile-model-card t-acc" data-open={isOpen} key={bike.id}>
            <button className="mobile-model-summary t-acc-head" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => onSelect(bike.id)}>
              <span className="row-number">{bikeIndex}</span>
              <span className="row-image"><ModelImage bike={bike} sizes="64px" /></span>
              <span className="row-name"><small>{bike.category}</small><strong>{bike.name.replace("INOW ", "")}</strong><em className={bike.available ? "" : "is-soon"}>{bike.available ? "na loja" : "em breve"}</em><span className="mobile-model-price">{bike.price}</span></span>
              <span className="mobile-model-chevron t-acc-chevron" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M4 6.5L8 10.5L12 6.5" /></svg></span>
            </button>
            <div id={panelId} className="mobile-model-panel t-acc-panel" aria-hidden={!isOpen} inert={!isOpen}>
              <div className="mobile-model-panel-inner t-acc-panel-inner">
                <div className="mobile-model-visual"><ModelImage bike={bike} sizes="calc(100vw - 72px)" /><span>{bikeIndex}</span></div>
                <div className="mobile-model-copy"><p className="micro-label">{bike.badge}</p><p>{bike.detail}</p></div>
                <div className="mobile-model-specs"><span><b>{bike.motor}</b>motor</span><span><b>{bike.range}</b>autonomia</span><span><b>{bike.battery}</b>bateria</span><span><b>{bike.support}</b>suporta</span></div>
                <div className="mobile-model-footer"><div><span>preço de catálogo</span><strong>{bike.price}</strong><del>{bike.originalPrice}</del></div><a className="button button--dark" href={`/modelos/${bike.id}`}>Ver ficha completa <Arrow /></a></div>
              </div>
            </div>
          </article>
        );
      })}
      {models.length === 0 ? <p className="empty-list">Nenhum modelo nesta categoria.</p> : null}
    </div>
  );
}

export default function Home() {
  const [selectedId, setSelectedId] = useState(bikes[1].id);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [quizResult, setQuizResult] = useState<Bike | null>(null);
  const [sent, setSent] = useState(false);
  const [requestedModelId, setRequestedModelId] = useState("");
  const [motionReady, setMotionReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [minimumDate, setMinimumDate] = useState("");
  const catalogScrollTimer = useRef<number | undefined>(undefined);
  const selected = bikes.find((bike) => bike.id === selectedId) ?? bikes[0];
  const filteredBikes = useMemo(() => activeCategory === "Todos" ? bikes : bikes.filter((bike) => bike.category === activeCategory), [activeCategory]);

  useEffect(() => {
    const now = new Date();
    const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
    setMinimumDate(localToday);

    const modelId = new URLSearchParams(window.location.search).get("model");
    if (modelId && bikes.some((bike) => bike.id === modelId)) {
      setRequestedModelId(modelId);
      setSelectedId(modelId);
    }
  }, []);

  useEffect(() => () => window.clearTimeout(catalogScrollTimer.current), []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const frame = window.requestAnimationFrame(() => setMotionReady(true));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));

    const setHeroDepth = () => document.documentElement.style.setProperty("--hero-parallax", `${Math.min(window.scrollY, 700) * 0.16}px`);
    setHeroDepth();
    window.addEventListener("scroll", setHeroDepth, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", setHeroDepth);
      document.documentElement.style.removeProperty("--hero-parallax");
    };
  }, []);

  function submitBooking(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  function chooseQuiz(bikeId: string) { setQuizResult(bikes.find((bike) => bike.id === bikeId) ?? null); }
  function selectCatalogModel(bikeId: string) {
    setSelectedId(bikeId);
    if (!window.matchMedia("(max-width: 820px)").matches) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollToModel = () => document.getElementById(`mobile-model-${bikeId}`)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });

    window.clearTimeout(catalogScrollTimer.current);
    if (reducedMotion) window.requestAnimationFrame(scrollToModel);
    else catalogScrollTimer.current = window.setTimeout(scrollToModel, 280);
  }
  function selectCategory(category: string, trigger: HTMLButtonElement) {
    const matchingBikes = category === "Todos" ? bikes : bikes.filter((bike) => bike.category === category);
    setActiveCategory(category);
    if (!matchingBikes.some((bike) => bike.id === selectedId) && matchingBikes[0]) setSelectedId(matchingBikes[0].id);

    if (!window.matchMedia("(max-width: 820px)").matches) return;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    trigger.scrollIntoView({ behavior, block: "nearest", inline: "center" });
  }
  function startBooking(modelId: string) {
    setRequestedModelId(modelId);
    setSent(false);
    setMobileMenuOpen(false);
  }

  return (
    <main data-motion-ready={motionReady}>
      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal"><a href="#catalogo">Modelos</a><a href="#experiencia">A experiência</a><a href="#lojas">Lojas</a><a href="#minha-flex">Minha Flex</a></nav>
        <a className="header-cta" href="#test-ride" onClick={() => startBooking(selected.id)}>Agendar test ride <Arrow /></a>
        <button className="mobile-menu-trigger" type="button" aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMobileMenuOpen((open) => !open)}><span /><span /></button>
      </header>
      <div className="mobile-menu-shell"><div id="mobile-navigation" className="mobile-menu t-panel-slide" data-open={mobileMenuOpen} aria-hidden={!mobileMenuOpen} inert={!mobileMenuOpen}><nav aria-label="Navegação móvel"><a href="#catalogo" onClick={() => setMobileMenuOpen(false)}>Modelos</a><a href="#experiencia" onClick={() => setMobileMenuOpen(false)}>A experiência</a><a href="#lojas" onClick={() => setMobileMenuOpen(false)}>Lojas</a><a href="#minha-flex" onClick={() => setMobileMenuOpen(false)}>Minha Flex</a></nav><a className="mobile-menu-cta" href="#test-ride" onClick={() => startBooking(selected.id)}>Agendar test ride <Arrow /></a></div></div>

      <section className="hero" id="top">
        <div className="hero-copy"><p className="eyebrow"><span /> INOW × FLEXMOBI.RJ</p><h1>Viva o Rio<br /><i>no seu</i><br /><strong>ritmo.</strong></h1><p className="hero-lede">Bikes elétricas escolhidas para quem quer trocar o trânsito por mais cidade, mais liberdade e um caminho que combina com você.</p><div className="hero-actions"><a className="button button--amber" href="#test-ride" onClick={() => startBooking(selected.id)}>Agendar test ride <Arrow /></a><a className="quiet-link" href="#catalogo">Ver os 11 modelos <Arrow /></a></div><div className="hero-signature"><span>ICARAÍ</span><i /> <span>IPANEMA</span><i /> <span>DESDE 2024</span></div></div>
        <div className="hero-product" aria-label="Modelo em destaque"><div className="hero-product-top"><span>01 / destaque</span><span>{selected.badge}</span></div><div className="hero-product-image"><ModelImage key={selected.id} bike={selected} className="hero-bike-image" priority sizes="(max-width: 820px) calc(100vw - 40px), 50vw" /></div><div className="hero-product-bottom"><div><span className="micro-label">Modelo em destaque</span><h2>{selected.name}</h2></div><div className="hero-price"><span>a partir de</span><strong>{selected.price}</strong></div></div><a className="product-corner-link" href={`/modelos/${selected.id}`}>Abrir ficha <Arrow /></a></div>
        <div className="hero-scroll"><span className="scroll-dot" /> role para explorar <span className="scroll-rule" /></div>
      </section>

      <section className="proof-strip" aria-label="Diferenciais da loja"><p><b>11</b> modelos no catálogo</p><span /><p><b>2</b> lojas para testar</p><span /><p><b>100%</b> atendimento presencial</p><span /><p><b>1</b> test ride começa tudo</p></section>

      <section className="catalog section" id="catalogo">
        <div className="section-intro" data-reveal><div><p className="eyebrow eyebrow--dark"><span /> Curadoria INOW</p><h2>Uma bike para<br /><i>cada jeito</i><br />de ir.</h2></div><p className="section-note">Do compacto que cabe no elevador ao topo de linha com bateria dupla. Compare o que importa e venha sentir a diferença pessoalmente.</p></div>
        <div className="category-filter-shell"><span className="category-filter-cue" aria-hidden="true">deslize para filtrar ↔</span><div className="category-filter" aria-label="Filtrar modelos">{catalogCategories.map((category) => <button type="button" key={category} className={activeCategory === category ? "is-active" : ""} onClick={(event) => selectCategory(category, event.currentTarget)} aria-pressed={activeCategory === category}>{category}</button>)}</div></div>
        <div className="catalog-stage" data-reveal>
          <article key={selected.id} className="model-showcase"><div className="showcase-head"><span>{selected.category}</span><span className={selected.available ? "status status--available" : "status"}>{selected.available ? "Disponível na loja" : "Disponível em breve"}</span></div><div className="showcase-visual"><ModelImage bike={selected} className="showcase-bike" sizes="(max-width: 820px) calc(100vw - 40px), 42vw" /><span className="showcase-index">{String(bikes.findIndex((bike) => bike.id === selected.id) + 1).padStart(2, "0")}</span></div><div className="showcase-copy"><p className="micro-label">{selected.badge}</p><h3>{selected.name}</h3><p>{selected.detail}</p></div><div className="spec-row"><span><b>{selected.motor}</b>motor</span><span><b>{selected.range}</b>autonomia</span><span><b>{selected.battery}</b>bateria</span><span><b>{selected.support}</b>suporta</span></div><div className="showcase-footer"><div><span>preço de catálogo</span><strong>{selected.price}</strong><del>{selected.originalPrice}</del></div><a className="button button--dark" href={`/modelos/${selected.id}`}>Ver ficha completa <Arrow /></a></div></article>
          <div className="model-list" aria-label="Todos os modelos"><div className="list-heading"><span>Modelo</span><span>Preço</span></div>{filteredBikes.map((bike) => <button type="button" key={bike.id} className={`model-row ${selected.id === bike.id ? "is-active" : ""}`} onClick={() => setSelectedId(bike.id)}><span className="row-number">{String(bikes.findIndex((item) => item.id === bike.id) + 1).padStart(2, "0")}</span><span className="row-image"><ModelImage bike={bike} sizes="67px" /></span><span className="row-name"><small>{bike.category}</small><strong>{bike.name.replace("INOW ", "")}</strong><em className={bike.available ? "" : "is-soon"}>{bike.available ? "na loja" : "em breve"}</em></span><span className="row-price">{bike.price}</span><span className="row-arrow"><Arrow /></span></button>)}{filteredBikes.length === 0 && <p className="empty-list">Nenhum modelo nesta categoria.</p>}</div>
          <MobileCatalog models={filteredBikes} selectedId={selected.id} onSelect={selectCatalogModel} />
        </div>
      </section>

      <section className="experience section" id="experiencia"><div className="experience-visual" data-reveal><Image src="/imagens/015_v35-outdoor-front.jpg" width={1600} height={1200} sizes="(max-width: 820px) calc(100vw - 40px), 50vw" className="experience-image" alt="INOW V35 em um ambiente urbano" /><div className="image-caption"><span>INOW V35 / CIDADE ABERTA</span><b>o Rio<br /><i>é seu.</i></b></div></div><div className="experience-copy" data-reveal><p className="eyebrow"><span /> O jeito Flex de atender</p><h2>Não é só<br /><i>escolher.</i></h2><p>Você senta, acelera, sente a suspensão e conversa com quem entende do assunto. A bike certa aparece no encontro — não em uma tela cheia de promessa.</p><div className="service-list"><a href="#test-ride" onClick={() => startBooking(selected.id)}><span>01</span><strong>Test ride no seu ritmo</strong><Arrow /></a><a href="#test-ride"><span>02</span><strong>Revisão especializada</strong><Arrow /></a><a href="#lojas"><span>03</span><strong>Duas lojas, perto de você</strong><Arrow /></a></div></div></section>

      <section className="quiz section" id="quiz"><div className="quiz-heading"><p className="eyebrow"><span /> Curadoria rápida</p><h2>Qual é a<br /><i>sua bike?</i></h2><p>Quatro caminhos para começar. No atendimento, a gente aprofunda junto com você.</p></div><div className="quiz-panel"><p className="micro-label">O que pesa mais na sua escolha?</p><div className="quiz-options">{quizOptions.map((option) => <button type="button" key={option.id} onClick={() => chooseQuiz(option.bikeId)} className={quizResult?.id === option.bikeId ? "is-selected" : ""}><span>{option.label}</span><small>{option.description}</small><Arrow /></button>)}</div>{quizResult && <div className="quiz-result"><ModelImage bike={quizResult} sizes="128px" /><div><span>Seu ponto de partida</span><strong>{quizResult.name}</strong><p>{quizResult.feature}</p><a href="#test-ride" onClick={() => startBooking(quizResult.id)}>Agendar test ride <Arrow /></a></div></div>}</div></section>

      <section className="stores section" id="lojas"><div className="section-intro"><div><p className="eyebrow eyebrow--dark"><span /> Onde encontrar</p><h2>Duas lojas.<br /><i>Um só movimento.</i></h2></div><p className="section-note">Veja qual endereço encaixa no seu caminho. O melhor test ride começa pela porta mais próxima.</p></div><div className="store-list">{stores.map((store) => <article key={store.name} className="store-item"><span className="store-number">{store.number}</span><div className="store-main"><p>{store.city}</p><h3>{store.name}</h3><span>{store.address}</span></div><p className="store-note">{store.note}</p><a className="quiet-link quiet-link--dark" href={store.map} target="_blank" rel="noreferrer">Abrir no Maps <Arrow /></a></article>)}</div></section>

      <section className="booking section" id="test-ride"><div className="booking-copy"><p className="eyebrow"><span /> Primeiro passo</p><h2>Vem<br /><i>sentir.</i></h2><p>Escolha a loja, conte qual modelo chamou sua atenção e a equipe confirma o melhor horário para você.</p><div className="booking-aside"><span>Sem pagamento online.</span><span>Sem compromisso.</span><span>Atendimento de verdade.</span></div></div><div className="booking-panel">{sent ? <div className="success-state"><span className="success-mark">✓</span><p className="micro-label">Pedido recebido</p><h3>A gente<br /><i>te espera.</i></h3><p>O envio é demonstrativo nesta versão. A equipe Flex confirmará o horário quando o formulário estiver conectado ao sistema.</p><button className="quiet-link" type="button" onClick={() => setSent(false)}>Enviar outro pedido <Arrow /></button></div> : <form onSubmit={submitBooking}><div className="form-top"><span>Agendamento de test ride</span><span>01 / 03</span></div><label>Seu nome<input required name="name" autoComplete="name" placeholder="Como podemos chamar você?" /></label><div className="form-grid"><label>WhatsApp<input required name="phone" type="tel" inputMode="tel" autoComplete="tel" minLength={10} pattern={String.raw`(?:\+?55\s?)?\(?[1-9]{2}\)?\s?9?[0-9]{4}-?[0-9]{4}`} title="Digite um telefone com DDD, como (21) 99999-9999" placeholder="(21) 00000-0000" /></label><label>Loja<select required name="store" defaultValue=""><option value="" disabled>Escolha</option>{stores.map((store) => <option key={store.name}>{store.name}</option>)}</select></label></div><div className="form-grid"><label>Modelo<select required name="model" value={requestedModelId} onChange={(event) => setRequestedModelId(event.target.value)}><option value="" disabled>Escolha uma bike</option>{bikes.map((bike) => <option key={bike.id} value={bike.id}>{bike.name}</option>)}</select></label><label>Data<input required name="date" type="date" min={minimumDate || undefined} /></label></div><button className="button button--amber" type="submit">Quero fazer o test ride <Arrow /></button><small>Se preferir, você também poderá falar com a loja pelo WhatsApp.</small></form>}</div></section>

      <section className="member" id="minha-flex"><div><p className="eyebrow eyebrow--dark"><span /> Depois da compra</p><h2>Minha <i>Flex</i></h2><p>Um espaço para acompanhar sua bike, revisões, garantia e benefícios de indicação.</p></div><div className="member-links"><span><b>01</b> Bike e chassi</span><span><b>02</b> Próxima revisão</span><span><b>03</b> Indique e ganhe</span><small>Área em desenvolvimento</small></div></section>
      <footer><Brand footer /><p>Viva o Rio no seu ritmo.</p><span>© 2026 flexmobi.rj · INOW + Flex Mobi</span></footer>
    </main>
  );
}
