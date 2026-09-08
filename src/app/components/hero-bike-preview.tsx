"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Bike } from "../data/catalog";
import styles from "./hero-bike-preview.module.css";
import "./hero-reveal.css";

type Phase = "idle" | "photo" | "loading" | "ready" | "error";
const channel = "flexmobi-hero-3d";

export default function HeroBikePreview({ bike }: { bike: Bike }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [interacted, setInteracted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const active = phase === "loading" || phase === "ready";

  useEffect(() => {
    // Respect an explicit data-saving preference; the product photo stays usable.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) { setPhase("photo"); return; }
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) setPhase((current) => current === "idle" ? "loading" : current);
      frameRef.current?.contentWindow?.postMessage({ channel, type: "visibility", visible: entry.isIntersecting }, window.location.origin);
    }, { threshold: .12 });
    if (stageRef.current) observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    // A stalled download must never leave the visitor trapped in an empty viewer.
    const timeout = window.setTimeout(() => setPhase("error"), 45_000);
    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      const data = event.data;
      if (!data || data.channel !== channel) return;
      if (data.type === "ready") {
        window.clearTimeout(timeout);
        setPhase("ready");
        frameRef.current?.contentWindow?.postMessage({ channel, type: "visibility", visible: visibleRef.current }, window.location.origin);
      } else if (data.type === "error") {
        window.clearTimeout(timeout);
        setPhase("error");
      } else if (data.type === "interaction") setInteracted(true);
    }
    window.addEventListener("message", receive);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("message", receive);
    };
  }, [active]);

  return <div ref={stageRef} className={`hero-product-image ${styles.visual}`} data-hero-3d={phase}>
    <div className={`${styles.layers} t-skel ${phase === "ready" ? "is-revealed" : ""}`}>
      <div className={`t-skel-skeleton ${styles.placeholder}`} aria-hidden={phase === "ready"}>
        {phase === "error" || phase === "photo" ? <div className={styles.photo}>
          <Image src={bike.image} alt={`${bike.name} — foto do produto`} fill sizes="(max-width: 820px) 100vw, 58vw" />
        </div> : <div className={styles.loading} aria-hidden="true"><span />Preparando experiência 3D</div>}
      </div>
      <div className={`t-skel-content ${styles.scene}`} inert={phase !== "ready"}>
        {active ? <iframe ref={frameRef} className={styles.frame} src="/modelos-3d/hero.html?v=9"
          title={`${bike.name} — arraste para explorar em 3D`} tabIndex={phase === "ready" ? 0 : -1}
          aria-hidden={phase !== "ready"} onError={() => setPhase("error")} /> : null}
      </div>
    </div>
    <span className={styles.hint} data-hidden={interacted || phase !== "ready"} aria-hidden="true">Arraste para girar</span>
    <a className={styles.identification} href={`/modelos/${bike.slug}`} aria-label={`Ver ficha da ${bike.name}. Modelo 3D ilustrativo.`}>
      <span>{bike.name}</span><small>Modelo 3D ilustrativo</small>
    </a>
    <span className={styles.srOnly} role="status">{phase === "ready" ? "Bike 3D pronta. Arraste para girar. Teclado: setas e Home. Duplo clique restaura o ângulo."
      : phase === "error" ? "3D indisponível neste momento. Exibindo a foto do produto." : phase === "photo" ? "Foto do produto. Economia de dados ativada." : "Preparando experiência 3D."}</span>
  </div>;
}
