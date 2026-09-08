"use client";
import { useId, useRef, useState, useLayoutEffect } from "react";
import styles from "./booking-date.module.css";

type Props = { value: string; minimumDate: string; disabled: boolean; error?: string; onChange: (value: string) => void };
const iso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export default function BookingDate({ value, minimumDate, disabled, error, onChange }: Props) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [month, setMonth] = useState("");
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const r = trigger.current!.getBoundingClientRect();
      const height = dialog.current!.offsetHeight;
      const width = dialog.current!.offsetWidth;
      const below = r.bottom + 8;
      setPosition({ left: Math.max(12, Math.min(r.right - width, window.innerWidth - width - 12)), top: Math.max(12, below + height <= window.innerHeight - 12 ? below : r.top - height - 8) });
    }
    place(); window.addEventListener("resize", place); window.addEventListener("scroll", place, true);
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [open, month]);
  const base = month || value.slice(0, 7) || minimumDate.slice(0, 7);
  const [year, monthIndex] = base.split("-").map(Number);
  const count = base ? new Date(year, monthIndex, 0).getDate() : 0;
  const offset = base ? new Date(year, monthIndex - 1, 1).getDay() : 0;
  function close() { dialog.current?.close(); setOpen(false); trigger.current?.focus(); }
  function show() {
    const rect = trigger.current!.getBoundingClientRect();
    setPosition({ left: Math.max(12, Math.min(rect.right - 308, window.innerWidth - 320)), top: Math.max(12, Math.min(rect.bottom + 8, window.innerHeight - 430)) });
    setMonth((value || minimumDate || iso(new Date())).slice(0, 7));
    setOpen(true); dialog.current?.showModal();
  }
  function move(delta: number) { setMonth(iso(new Date(year, monthIndex - 1 + delta, 1)).slice(0, 7)); }
  return <div className={`booking-field ${styles.field} ${error ? "is-error" : ""}`} data-field="date">
    <span id={`${id}-label`}>Data</span>
    <button ref={trigger} className={styles.trigger} type="button" disabled={disabled} aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="dialog" aria-expanded={open} aria-controls={id} aria-invalid={!!error} aria-describedby="booking-date-error" onClick={show}>
      <span id={`${id}-value`}>{value ? new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR") : "dd/mm/aaaa"}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 10h16"/></svg>
    </button>
    <input type="hidden" name="date" value={value}/>
    <span id="booking-date-error" className="field-error" aria-live="polite">{error}</span>
    <dialog ref={dialog} id={id} className={styles.dialog} style={position} aria-label="Escolher data preferida" onCancel={event => { event.preventDefault(); close(); }} onClose={() => setOpen(false)} onClick={event => { if (event.target === dialog.current) { const r = dialog.current.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close(); } }}>
      <div className={styles.month}><button type="button" aria-label="Mês anterior" disabled={base <= minimumDate.slice(0, 7)} onClick={() => move(-1)}>‹</button><strong aria-live="polite">{base && new Date(year, monthIndex - 1, 1).toLocaleDateString("pt-BR", {month: "long", year: "numeric"})}</strong><button type="button" aria-label="Próximo mês" onClick={() => move(1)}>›</button></div>
      <div className={styles.days}>
        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => <span key={i} aria-hidden="true">{day}</span>)}
        {Array.from({length: offset}, (_, i) => <span key={`blank-${i}`}/>)}
        {Array.from({length: count}, (_, i) => { const date = `${base}-${String(i + 1).padStart(2, "0")}`; return <button type="button" key={date} disabled={date < minimumDate} aria-pressed={date === value} aria-label={new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {weekday:"long", day:"numeric", month:"long", year:"numeric"})} onClick={() => { onChange(date); close(); }}>{i + 1}</button>; })}
      </div>
      <div className={styles.bottom}><button type="button" onClick={() => { onChange(""); close(); }}>Limpar</button><button type="button" onClick={close}>Fechar</button></div>
    </dialog>
  </div>;
}
