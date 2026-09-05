"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { bikeUses } from "../data/catalog";
import { getAllBikes } from "../lib/catalog";
import BikeCard from "../components/bike-card";
import styles from "./catalog.module.css";

type Filters = { uso: string; preco: string; autonomia: string; disponivel: string; ordem: string; q: string };
const empty: Filters = { uso: "", preco: "", autonomia: "", disponivel: "", ordem: "", q: "" };
const priceOptions = [{ value: "10000", label: "Até R$ 10 mil" }, { value: "15000", label: "Até R$ 15 mil" }];
const sorts = [{ value: "", label: "Nossa seleção" }, { value: "preco", label: "Menor preço" }, { value: "preco-desc", label: "Maior preço" }, { value: "autonomia", label: "Maior autonomia" }];
function readFilters(params: URLSearchParams): Filters {
  return { uso: bikeUses.some(use => use.id === params.get("uso")) ? params.get("uso")! : "", preco: priceOptions.some(item => item.value === params.get("preco")) ? params.get("preco")! : "", autonomia: ["50", "100"].includes(params.get("autonomia") || "") ? params.get("autonomia")! : "", disponivel: params.get("disponivel") === "sim" ? "sim" : "", ordem: sorts.some(item => item.value === params.get("ordem")) ? params.get("ordem")! : "", q: (params.get("q") || "").slice(0, 100) };
}
function filterModels(filters: Filters) {
  const query = filters.q.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  return getAllBikes().filter(bike => (!filters.uso || bike.uses.some(use => use === filters.uso)) && (!filters.preco || bike.priceCents <= Number(filters.preco) * 100) && (!filters.autonomia || bike.rangeKm >= Number(filters.autonomia)) && (!filters.disponivel || bike.available) && (!query || `${bike.name} ${bike.category}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(query))).sort((a, b) => filters.ordem === "preco" ? a.priceCents - b.priceCents : filters.ordem === "preco-desc" ? b.priceCents - a.priceCents : filters.ordem === "autonomia" ? b.rangeKm - a.rangeKm : (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));
}

export default function CatalogView() {
  const params = useSearchParams();
  const filters = readFilters(new URLSearchParams(params.toString()));
  const [draft, setDraft] = useState<Filters>(empty);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const results = filterModels(filters);
  const limit = Math.max(12, Math.min(1000, Number(params.get("limite")) || 12));
  function update(next: Filters, count = 12) {
    const query = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => { if (value) query.set(key, value); });
    if (count > 12) query.set("limite", String(count));
    window.history.replaceState(null, "", `/modelos${query.size ? `?${query}` : ""}`);
  }
  function fields(value: Filters, change: (next: Filters) => void) {
    return <>
      <label>Seu uso<select value={value.uso} onChange={event => change({ ...value, uso: event.target.value })}><option value="">Todos os usos</option>{bikeUses.map(use => <option key={use.id} value={use.id}>{use.label}</option>)}</select></label>
      <label>Orçamento<select value={value.preco} onChange={event => change({ ...value, preco: event.target.value })}><option value="">Todos os preços</option>{priceOptions.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      <label>Autonomia estimada<select value={value.autonomia} onChange={event => change({ ...value, autonomia: event.target.value })}><option value="">Qualquer autonomia</option><option value="50">A partir de 50 km</option><option value="100">A partir de 100 km</option></select></label>
      <label className={styles.checkbox}><input type="checkbox" checked={value.disponivel === "sim"} onChange={event => change({ ...value, disponivel: event.target.checked ? "sim" : "" })} />Somente modelos disponíveis</label>
    </>;
  }
  const labels: Record<string, string> = { uso: bikeUses.find(use => use.id === filters.uso)?.label || "", preco: priceOptions.find(item => item.value === filters.preco)?.label || "", autonomia: `A partir de ${filters.autonomia} km`, disponivel: "Disponíveis", q: `Busca: ${filters.q}` };
  const active = Object.entries(filters).filter(([key, value]) => value && key !== "ordem");
  return <section className={styles.catalog} aria-label="Explorar modelos">
    <div className={styles.toolbar}><label className={styles.search}>Buscar modelo<input type="search" placeholder="Ex.: V35, X25…" value={filters.q} maxLength={100} onChange={event => update({ ...filters, q: event.target.value })} /></label><label>Ordenar por<select value={filters.ordem} onChange={event => update({ ...filters, ordem: event.target.value })}>{sorts.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><button ref={trigger} type="button" className={styles.mobileFilter} onClick={() => { setDraft(filters); dialog.current?.showModal(); }}>Filtrar ({active.length})</button></div>
    <div className={styles.layout}><aside className={styles.filters} aria-label="Filtros"><h2>Refine sua escolha</h2>{fields(filters, update)}<button type="button" onClick={() => update(empty)}>Limpar filtros</button><p>A disponibilidade, as cores e os preços são confirmados pela loja.</p></aside><div>
      <div className={styles.resultHeading}><p aria-live="polite">{results.length} {results.length === 1 ? "modelo encontrado" : "modelos encontrados"}</p><span>INOW / seleção urbana</span></div>
      {active.length > 0 && <div className={styles.chips}>{active.map(([key]) => <button key={key} type="button" aria-label={`Remover ${labels[key]}`} onClick={() => update({ ...filters, [key]: "" })}>{labels[key]} ×</button>)}<button type="button" onClick={() => update(empty)}>Limpar tudo</button></div>}
      <div className={styles.grid}>{results.slice(0, limit).map(bike => <BikeCard key={bike.id} bike={bike} />)}</div>
      {!results.length && <div className={styles.empty}><h2>Vamos abrir o caminho?</h2><p>Nenhuma bike combina com esses filtros. Remova uma opção ou explore todos os modelos.</p><button type="button" onClick={() => update(empty)}>Ver todos os modelos</button></div>}
      {results.length > limit && <button className={styles.more} type="button" onClick={() => update(filters, limit + 12)}>Mostrar mais modelos ({results.length - limit} restantes)</button>}
      <p className={styles.note}>Preços de catálogo sujeitos à confirmação. A autonomia é estimada e varia com peso, percurso e condições de uso.</p>
    </div></div>
    <dialog ref={dialog} aria-labelledby="catalog-filter-title" className={styles.dialog} onClose={() => trigger.current?.focus()}><div className={styles.dialogHead}><h2 id="catalog-filter-title">Filtrar modelos</h2><button type="button" aria-label="Fechar filtros" onClick={() => dialog.current?.close()}>×</button></div><div className={styles.dialogFields}>{fields(draft, setDraft)}</div><div className={styles.dialogActions}><button type="button" onClick={() => setDraft(empty)}>Limpar</button><button type="button" onClick={() => { update(draft); dialog.current?.close(); }}>Ver {filterModels(draft).length} resultados</button></div></dialog>
  </section>;
}
