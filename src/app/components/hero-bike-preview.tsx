"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Bike } from "../data/catalog";
import styles from "./hero-bike-preview.module.css";
import "./hero-reveal.css";

type Phase = "photo" | "loading" | "ready" | "error";
const channel = "flexmobi-hero-3d";

export default function HeroBikePreview({ bike }: { bike: Bike }) {
  const [phase, setPhase] = useState<Phase>("photo");
  const [interacted, setInteracted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const active = phase === "loading" || phase === "ready";

  useEffect(() => {
    // Respect an explicit data-saving preference; the product photo stays usable.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) setPhase((current) => current === "photo" ? "loading" : current);
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
      <div className={`t-skel-skeleton ${styles.photo}`} aria-hidden={phase === "ready"}>
        <Image src={bike.image} alt={`${bike.name} — foto do produto`} fill priority sizes="(max-width: 820px) 100vw, 58vw" />
      </div>
      <div className={`t-skel-content ${styles.scene}`} inert={phase !== "ready"}>
        {active ? <iframe ref={frameRef} className={styles.frame} src="/modelos-3d/hero.html?v=8"
          title={`${bike.name} — arraste para explorar em 3D`} tabIndex={phase === "ready" ? 0 : -1}
          aria-hidden={phase !== "ready"} onError={() => setPhase("error")} /> : null}
      </div>
    </div>
    <span className={styles.hint} data-hidden={interacted || phase !== "ready"} aria-hidden="true"><span>↔</span> arraste para explorar</span>
    <span className={styles.study}>Estudo 3D · imagem ilustrativa</span>
    <span className={styles.srOnly} role="status">{phase === "ready" ? "Bike 3D pronta. Arraste para girar. Teclado: setas e Home. Duplo clique restaura o ângulo."
      : phase === "error" ? "3D indisponível neste momento. Exibindo a foto do produto." : "Foto disponível enquanto o modelo 3D é preparado."}</span>
  </div>;
}
