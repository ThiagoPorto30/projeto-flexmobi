"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { bikeUses, type Bike, type BikeUse } from "./data/catalog";
import { business, stores, whatsappUrl } from "./data/business";
import FeaturedCatalog from "./components/featured-catalog";
import SiteFooter from "./components/site-footer";
import Faq from "./components/faq";
import BrandLogo from "./components/brand-logo";
import BookingDate from "./components/booking-date";
import HeroBikePreview from "./components/hero-bike-preview";
import heroPreviewStyles from "./components/hero-bike-preview.module.css";
import finderStyles from "./components/bike-finder.module.css";
import { getAllBikes, getBikeBySlug, getFeaturedBikes } from "./lib/catalog";

type BookingForm = {
  name: string;
  phone: string;
  store: string;
  model: string;
  date: string;
};

type BookingErrors = Partial<Record<keyof BookingForm, string>>;

type BookingSummary = BookingForm & {
  modelName: string;
  formattedDate: string;
};

const initialBooking: BookingForm = { name: "", phone: "", store: "", model: "", date: "" };

function phoneDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("55") && digits.length > 11 ? digits.slice(2, 13) : digits.slice(0, 11);
}

function formatPhone(value: string) {
  const digits = phoneDigits(value);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;

  const areaCode = digits.slice(0, 2);
  const localNumber = digits.slice(2);
  if (localNumber.length <= 4) return `(${areaCode}) ${localNumber}`;

  const prefixLength = localNumber.length > 8 ? 5 : 4;
  return `(${areaCode}) ${localNumber.slice(0, prefixLength)}-${localNumber.slice(prefixLength)}`;
}

function formatBookingDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(new Date(`${value}T12:00:00`));
}

function ExternalArrow() { return <span aria-hidden="true">↗</span>; }

function ModelImage({ bike, className = "", priority = false, sizes = "(max-width: 820px) 100vw, 50vw" }: { bike: Bike; className?: string; priority?: boolean; sizes?: string }) {
  return <Image className={className} src={bike.image} alt={`${bike.name} — bicicleta elétrica INOW`} width={1600} height={1200} priority={priority} sizes={sizes} />;
}

export default function Home() {
  const allBikes = useMemo(() => getAllBikes(), []);
  const featuredBikes = useMemo(() => getFeaturedBikes(), []);
  const defaultBike = getBikeBySlug("inow-v20-brake-pro") ?? featuredBikes.find((bike) => bike.available) ?? allBikes[0];
  const [selectedId, setSelectedId] = useState(defaultBike?.id ?? "");
  const [quizUse, setQuizUse] = useState<BikeUse>("cidade");
  const quizResult = allBikes.filter((bike) => bike.available && bike.uses.includes(quizUse))
    .sort((a, b) => (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (b.featuredOrder ?? Number.MAX_SAFE_INTEGER))[0];
  const useTitles: Record<BikeUse, string> = { cidade: "Facilitar meu dia a dia", compacta: "Guardar em pouco espaço", passageiro: "Levar alguém comigo", distancia: "Ir mais longe", performance: "Priorizar desempenho" };
  const [booking, setBooking] = useState<BookingForm>(initialBooking);
  const [bookingErrors, setBookingErrors] = useState<BookingErrors>({});
  const [bookingStatus, setBookingStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [bookingSummary, setBookingSummary] = useState<BookingSummary | null>(null);
  const [motionReady, setMotionReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [minimumDate, setMinimumDate] = useState("");
  const [hero3dEnabled, setHero3dEnabled] = useState(true);
  const bookingSubmitTimer = useRef<number | undefined>(undefined);
  const bookingSuccessRef = useRef<HTMLDivElement>(null);
  const selected = allBikes.find((bike) => bike.id === selectedId) ?? defaultBike;
  const bookingBike = allBikes.find((bike) => bike.id === booking.model) ?? selected;

  useEffect(() => {
    const now = new Date();
    const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
    setMinimumDate(localToday);

    const query = new URLSearchParams(window.location.search);
    const enabled3d = query.get("hero3d") !== "0";
    setHero3dEnabled(enabled3d);
    const modelReference = query.get("model");
    const requestedBike = modelReference ? getBikeBySlug(modelReference) ?? allBikes.find((bike) => bike.id === modelReference) : undefined;
    if (requestedBike) {
      setBooking((current) => ({ ...current, model: requestedBike.id }));
      setSelectedId(requestedBike.id);
    }
  }, []);

  useEffect(() => () => {
    window.clearTimeout(bookingSubmitTimer.current);
  }, []);

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

    const motionFrame = window.requestAnimationFrame(() => setMotionReady(true));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));

    let parallaxFrame = 0;
    let lastDepth = -1;
    const updateHeroDepth = () => {
      parallaxFrame = 0;
      const depth = Math.min(window.scrollY, 700) * 0.16;
      if (depth === lastDepth) return;
      lastDepth = depth;
      document.documentElement.style.setProperty("--hero-parallax", `${depth}px`);
    };
    const queueHeroDepth = () => {
      if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateHeroDepth);
    };
    queueHeroDepth();
    window.addEventListener("scroll", queueHeroDepth, { passive: true });

    return () => {
      window.cancelAnimationFrame(motionFrame);
      window.cancelAnimationFrame(parallaxFrame);
      observer.disconnect();
      window.removeEventListener("scroll", queueHeroDepth);
      document.documentElement.style.removeProperty("--hero-parallax");
    };
  }, []);

  function updateBooking(field: keyof BookingForm, value: string) {
    setBooking((current) => ({ ...current, [field]: value }));
    if (bookingErrors[field]) setBookingErrors((current) => ({ ...current, [field]: "" }));
  }

  function validateBooking() {
    const errors: BookingErrors = {};
    if (booking.name.trim().length < 2) errors.name = "Conte seu nome para a equipe saber quem receber.";
    if (![10, 11].includes(phoneDigits(booking.phone).length)) errors.phone = "Digite um WhatsApp com DDD, como (21) 99999-9999.";
    if (!booking.store) errors.store = "Escolha a loja mais conveniente para você.";
    if (!booking.model) errors.model = "Escolha qual bike você quer sentir de perto.";
    if (!booking.date) errors.date = "Escolha uma data para o test ride.";
    else if (minimumDate && booking.date < minimumDate) errors.date = "Escolha hoje ou uma data futura.";
    return errors;
  }

  function animateBookingErrors(form: HTMLFormElement, fields: (keyof BookingForm)[]) {
    window.requestAnimationFrame(() => {
      fields.forEach((field) => {
        const input = form.elements.namedItem(field) as HTMLElement | null;
        if (!input) return;
        input.classList.remove("is-shaking");
        void input.offsetWidth;
        input.classList.add("is-shaking");
        input.addEventListener("animationend", () => input.classList.remove("is-shaking"), { once: true });
      });
      (form.elements.namedItem(fields[0]) as HTMLElement | null)?.focus();
    });
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateBooking();
    const invalidFields = Object.keys(errors) as (keyof BookingForm)[];
    if (invalidFields.length) {
      setBookingErrors(errors);
      animateBookingErrors(event.currentTarget, invalidFields);
      return;
    }

    const requestedBike = allBikes.find((bike) => bike.id === booking.model);
    if (!requestedBike) return;

    window.clearTimeout(bookingSubmitTimer.current);
    setBookingErrors({});
    setBookingStatus("submitting");
    bookingSubmitTimer.current = window.setTimeout(() => {
      const normalizedBooking = { ...booking, name: booking.name.trim(), phone: formatPhone(booking.phone) };
      setBooking(normalizedBooking);
      setBookingSummary({ ...normalizedBooking, modelName: requestedBike.name, formattedDate: formatBookingDate(booking.date) });
      setBookingStatus("sent");
      window.requestAnimationFrame(() => bookingSuccessRef.current?.focus());
    }, 650);
  }
  function chooseQuiz(use: BikeUse) {
    setQuizUse(use);
  }
  function startBooking(modelId: string) {
    window.clearTimeout(bookingSubmitTimer.current);
    setBooking((current) => ({ ...current, model: modelId }));
    setBookingErrors({});
    setBookingStatus("idle");
    setMobileMenuOpen(false);
  }

  return (
    <main data-motion-ready={motionReady}>
      <header className="site-header">
        <BrandLogo priority />
        <nav className="desktop-nav" aria-label="Navegação principal"><a href="/modelos">Modelos</a><a href="#experiencia">A experiência</a><a href="#lojas">Lojas</a><a href="#minha-flex">Minha Flex</a></nav>
        <a className="header-cta" href="#test-ride" onClick={() => selected && startBooking(selected.id)}>Agendar test ride</a>
        <button className="mobile-menu-trigger" type="button" aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMobileMenuOpen((open) => !open)}><span /><span /></button>
      </header>
      <div className="mobile-menu-shell"><div id="mobile-navigation" className="mobile-menu t-panel-slide" data-open={mobileMenuOpen} aria-hidden={!mobileMenuOpen} inert={!mobileMenuOpen}><nav aria-label="Navegação móvel"><a href="/modelos" onClick={() => setMobileMenuOpen(false)}>Modelos</a><a href="#experiencia" onClick={() => setMobileMenuOpen(false)}>A experiência</a><a href="#lojas" onClick={() => setMobileMenuOpen(false)}>Lojas</a><a href="#minha-flex" onClick={() => setMobileMenuOpen(false)}>Minha Flex</a></nav><a className="mobile-menu-cta" href="#test-ride" onClick={() => selected && startBooking(selected.id)}>Agendar test ride</a></div></div>

      <section className={`hero ${hero3dEnabled && selected?.slug === "inow-v20-brake-pro" ? heroPreviewStyles.hero : ""}`} id="top">
        <div className="hero-copy"><p className="eyebrow"><span /> INOW × FLEXMOBI.RJ</p><h1>Viva o Rio<br /><i>no seu</i><br /><strong>ritmo.</strong></h1><p className="hero-lede">Bikes elétricas escolhidas para quem quer trocar o trânsito por mais cidade, mais liberdade e um caminho que combina com você.</p><div className="hero-actions"><a className="button button--amber" href="#test-ride" onClick={() => selected && startBooking(selected.id)}>Agendar test ride</a><a className="quiet-link" href="/modelos">Explorar modelos</a></div><div className="hero-signature"><span>ICARAÍ</span><i /> <span>IPANEMA</span><i /> <span>RIO DE JANEIRO</span></div></div>
        {selected ? <div className="hero-product" aria-label="Modelo em destaque"><div className="hero-product-top"><span>{"01 / destaque"}</span><span>{selected.badge}</span></div>{hero3dEnabled && selected.slug === "inow-v20-brake-pro" ? <HeroBikePreview key={selected.id} bike={selected} /> : <div className="hero-product-image"><ModelImage key={selected.id} bike={selected} className="hero-bike-image" priority sizes="(max-width: 820px) calc(100vw - 40px), 50vw" /></div>}<div className="hero-product-bottom"><div><span className="micro-label">Modelo em destaque</span><h2>{selected.name}</h2></div><div className="hero-price"><span>a partir de</span><strong>{selected.price}</strong></div></div><a className="product-corner-link" href={`/modelos/${selected.slug}`}>Abrir ficha</a></div> : null}
        <div className="hero-scroll"><span className="scroll-dot" /> role para explorar <span className="scroll-rule" /></div>
      </section>

      <section className="proof-strip" aria-label="Diferenciais da loja"><p><b>{allBikes.length}</b> modelos no catálogo</p><span /><p><b>2</b> lojas para testar</p><span /><p><b>100%</b> atendimento presencial</p><span /><p><b>1</b> test ride começa tudo</p></section>

      <section className="catalog section" id="catalogo">
        <FeaturedCatalog bikes={featuredBikes.slice(0, 4)} />
      </section>

      <section className={`section ${finderStyles.finder}`} id="quiz" aria-labelledby="finder-title">
        <div className={finderStyles.choices}>
          <p className="eyebrow"><span /> Encontre seu ritmo</p>
          <h2 id="finder-title">Seu caminho.<br /><em>Sua bike.</em></h2>
          <p className={finderStyles.intro}>Como você quer usar sua bike? Escolha uma prioridade e descubra um ponto de partida.</p>
          <div className={finderStyles.options} aria-label="Sua prioridade">
            {bikeUses.map((option) => <button type="button" key={option.id} onClick={() => chooseQuiz(option.id)} aria-pressed={quizUse === option.id} aria-controls="finder-result">
              <span>{useTitles[option.id]}<small>{option.description}</small></span>
            </button>)}
          </div>
        </div>
        <div className={finderStyles.result} id="finder-result">
          {quizResult ? <>
            <div className={finderStyles.photo}><span className={finderStyles.caption}>Uma possibilidade para você / {bikeUses.find((use) => use.id === quizUse)?.label}</span><ModelImage bike={quizResult} sizes="(max-width: 820px) 100vw, 55vw" /></div>
            <div className={finderStyles.details}>
              <div className={finderStyles.title}><h3>{quizResult.name}</h3><p><small>A partir de</small>{quizResult.price}</p></div>
              <p className={finderStyles.reason}>{quizResult.detail}</p>
              <div className={finderStyles.actions}><a className="button button--amber" href={`/modelos/${quizResult.slug}`}>Conhecer esta bike</a><a href="#test-ride" onClick={() => startBooking(quizResult.id)}>Agendar test ride</a></div>
              <p className={finderStyles.note}>Uma sugestão inicial. A escolha final acontece com você, na loja.</p>
            </div>
          </> : <p>Nenhuma bike disponível para esta prioridade. <a href="/modelos">Explore o catálogo</a>.</p>}
        </div>
        <span className={finderStyles.srOnly} role="status">{quizResult ? `Sugestão para ${useTitles[quizUse]}: ${quizResult.name}, a partir de ${quizResult.price}.` : "Nenhuma bike disponível para esta prioridade."}</span>
      </section>

      <section className="experience section" id="experiencia"><div className="experience-visual" data-reveal><Image src="/imagens/otimizadas/015_v35-outdoor-front.jpg.webp" width={1600} height={1200} sizes="(max-width: 820px) calc(100vw - 40px), 50vw" className="experience-image" alt="INOW V35 em um ambiente urbano" /><div className="image-caption"><span>INOW V35 / CIDADE ABERTA</span><b>o Rio<br /><i>é seu.</i></b></div></div><div className="experience-copy" data-reveal><p className="eyebrow"><span /> O jeito Flex de atender</p><h2>Não é só<br /><i>escolher.</i></h2><p>Você senta, acelera, sente a suspensão e conversa com quem entende do assunto. A bike certa aparece no encontro — não em uma tela cheia de promessa.</p><div className="service-list"><a href="#test-ride" onClick={() => selected && startBooking(selected.id)}><strong>Test ride no seu ritmo</strong></a><a href="#test-ride"><strong>Revisão especializada</strong></a><a href="#lojas"><strong>Duas lojas, perto de você</strong></a></div></div></section>

      <section className="stores section" id="lojas"><div className="section-intro"><div><p className="eyebrow eyebrow--dark"><span /> Onde encontrar</p><h2>Duas lojas.<br /><i>Um só movimento.</i></h2></div><p className="section-note">Veja qual endereço encaixa no seu caminho. O melhor test ride começa pela porta mais próxima.</p></div><div className="store-list">{stores.map((store) => <article key={store.name} className="store-item"><div className="store-main"><p>{store.city}</p><h3>{store.name}</h3><span>{store.address}</span></div><p className="store-note">{store.note}</p><a className="quiet-link quiet-link--dark" href={store.map} target="_blank" rel="noreferrer">Abrir no Maps <ExternalArrow /></a></article>)}</div></section>

      <section className="booking section" id="test-ride">
        <div className="booking-copy">
          <p className="eyebrow"><span /> Da tela para a rua</p>
          <h2>Vem<br /><i>sentir.</i></h2>
          <p>Escolha sua bike, uma loja e o melhor dia. A equipe entra em contato para combinar o horário.</p>
          <div className="booking-steps" aria-label="Como funciona o pedido">
            <span><strong>Escolha a bike</strong><small>Comece pelo modelo que chamou sua atenção.</small></span>
            <span><strong>Marque loja e dia</strong><small>Você indica a preferência; a equipe confirma.</small></span>
            <span><strong>Experimente na rua</strong><small>Sem pagamento online e sem compromisso.</small></span>
          </div>
        </div>
        <div className="booking-panel">
          {bookingStatus === "sent" && bookingSummary ? (
            <div className="success-state" role="status" tabIndex={-1} ref={bookingSuccessRef}>
              <span className="success-mark t-success-check" data-state="in" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7 12.5L10.4 16L18 8" /></svg></span>
              <p className="micro-label">Pedido preparado para {bookingSummary.name.split(" ")[0]}</p>
              <h3>{business.whatsapp ? <>Revise.<br /><i>Depois, envie.</i></> : <>Seu pedido<br /><i>de exemplo.</i></>}</h3>
              <div className="success-summary" aria-label="Resumo do agendamento">
                <div><span>Modelo</span><strong>{bookingSummary.modelName}</strong></div>
                <div><span>Loja</span><strong>{bookingSummary.store}</strong></div>
                <div><span>Data preferida</span><strong>{bookingSummary.formattedDate}</strong></div>
                <div><span>Contato</span><strong>{bookingSummary.phone}</strong></div>
              </div>
              <p className="success-note">{business.whatsapp ? "Seu pedido ainda não foi enviado. Abra o WhatsApp, envie a mensagem e aguarde a confirmação da loja antes da visita." : "Demonstração concluída: nesta versão nada foi enviado. O agendamento depende da confirmação da loja."}</p>
              {business.whatsapp ? <a className="button button--dark" href={whatsappUrl(`Olá! Gostaria de solicitar um test ride.\nNome: ${bookingSummary.name}\nWhatsApp: ${bookingSummary.phone}\nModelo: ${bookingSummary.modelName}\nLoja: ${bookingSummary.store}\nData de preferência: ${bookingSummary.formattedDate}`)!} target="_blank" rel="noopener noreferrer">Continuar no WhatsApp <ExternalArrow /></a> : null}
              <button className="quiet-link quiet-link--dark" type="button" onClick={() => setBookingStatus("idle")}>Ajustar os dados</button>
            </div>
          ) : (
            <form onSubmit={submitBooking} noValidate aria-busy={bookingStatus === "submitting"}>
              <div className="booking-panel-head">
                <div><span>Seu test ride</span><strong>Reserve a experiência.</strong></div>
                <span>Leva menos de 1 minuto</span>
              </div>
              {bookingBike ? <div className="booking-bike-preview" aria-live="polite">
                <div><ModelImage bike={bookingBike} sizes="132px" priority /></div>
                <p><span>Bike em destaque</span><strong>{bookingBike.name}</strong><small>{bookingBike.category} · {bookingBike.motor}</small></p>
                <a href={`/modelos/${bookingBike.slug}`}>Ver ficha</a>
              </div> : null}
              <label className={`booking-field t-input-wrap ${bookingErrors.name ? "is-error" : ""}`} data-field="name">Seu nome
                <input className={`t-input ${bookingErrors.name ? "is-error" : ""}`} required name="name" autoComplete="name" placeholder="Como podemos chamar você?" value={booking.name} disabled={bookingStatus === "submitting"} aria-invalid={Boolean(bookingErrors.name)} aria-describedby="booking-name-error" onChange={(event) => updateBooking("name", event.target.value)} />
                <span id="booking-name-error" className="field-error t-error-msg" aria-live="polite">{bookingErrors.name}</span>
              </label>
              <div className="form-grid">
                <label className={`booking-field t-input-wrap ${bookingErrors.phone ? "is-error" : ""}`} data-field="phone">WhatsApp
                  <input className={`t-input ${bookingErrors.phone ? "is-error" : ""}`} required name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="(21) 00000-0000" value={booking.phone} disabled={bookingStatus === "submitting"} aria-invalid={Boolean(bookingErrors.phone)} aria-describedby="booking-phone-error" onChange={(event) => updateBooking("phone", formatPhone(event.target.value))} />
                  <span id="booking-phone-error" className="field-error t-error-msg" aria-live="polite">{bookingErrors.phone}</span>
                </label>
                <label className={`booking-field t-input-wrap ${bookingErrors.store ? "is-error" : ""}`} data-field="store">Loja
                  <select className={`t-input ${bookingErrors.store ? "is-error" : ""}`} required name="store" value={booking.store} disabled={bookingStatus === "submitting"} aria-invalid={Boolean(bookingErrors.store)} aria-describedby="booking-store-error" onChange={(event) => updateBooking("store", event.target.value)}><option value="" disabled>Escolha</option>{stores.map((store) => <option key={store.name}>{store.name}</option>)}</select>
                  <span id="booking-store-error" className="field-error t-error-msg" aria-live="polite">{bookingErrors.store}</span>
                </label>
              </div>
              <div className="form-grid">
                <label className={`booking-field t-input-wrap ${bookingErrors.model ? "is-error" : ""}`} data-field="model">Modelo
                  <select className={`t-input ${bookingErrors.model ? "is-error" : ""}`} required name="model" value={booking.model} disabled={bookingStatus === "submitting"} aria-invalid={Boolean(bookingErrors.model)} aria-describedby="booking-model-error" onChange={(event) => updateBooking("model", event.target.value)}><option value="" disabled>Escolha uma bike</option>{allBikes.map((bike) => <option key={bike.id} value={bike.id}>{bike.name}</option>)}</select>
                  <span id="booking-model-error" className="field-error t-error-msg" aria-live="polite">{bookingErrors.model}</span>
                </label>
              <BookingDate value={booking.date} minimumDate={minimumDate} disabled={bookingStatus === "submitting"} error={bookingErrors.date} onChange={value => updateBooking("date", value)} />
              </div>
              <button className="button button--amber booking-submit" type="submit" disabled={bookingStatus === "submitting"}>{bookingStatus === "submitting" ? <><span className="booking-spinner" aria-hidden="true" /> Preparando pedido...</> : <>Quero fazer o test ride</>}</button>
              <small className="booking-privacy">{business.whatsapp ? "Você revisa os dados antes de abrir o WhatsApp. A loja confirma o horário antes da visita." : "Protótipo demonstrativo · Nada é enviado nesta versão · A loja confirma o horário antes da visita."} <a href="/privacidade">Privacidade e uso dos dados</a>{business.responseTime ? ` · ${business.responseTime}` : ""}</small>
            </form>
          )}
        </div>
      </section>

      <section className="member" id="minha-flex"><div><p className="eyebrow eyebrow--dark"><span /> Próximas possibilidades</p><h2>Depois, a <i>Flex</i><br />continua.</h2><p>Uma segunda fase pode reunir revisões, acompanhamento da bike e benefícios — depois de definir a rotina da loja e as regras comerciais.</p></div><div className="member-links"><span> Histórico da bike <em>em estudo</em></span><span> Agenda de revisão <em>em estudo</em></span><span> Programa de indicação <em>em estudo</em></span><small>Funcionalidades futuras — não fazem parte desta primeira entrega.</small></div></section>
      <Faq />
      <SiteFooter />
      <a className="home-mobile-cta" href="#test-ride" onClick={() => selected && startBooking(selected.id)}>Agendar test ride</a>
    </main>
  );
}
