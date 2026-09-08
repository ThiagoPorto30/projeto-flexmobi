import Link from "next/link";
import BrandLogo from "./components/brand-logo";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <header className="not-found-header">
        <BrandLogo priority />
        <span>Erro 404 / rota fora do mapa</span>
      </header>

      <section className="not-found-content">
        <span className="not-found-code" aria-hidden="true">404</span>
        <div>
          <p className="eyebrow"><span /> Caminho não encontrado</p>
          <h1>Essa rua<br /><i>não leva</i><br />até aqui.</h1>
          <p className="not-found-copy">A página mudou de endereço ou nunca passou por este caminho. Sua próxima bike continua logo ali.</p>
          <div className="not-found-actions">
            <Link className="button button--amber" href="/">Voltar ao início</Link>
            <Link className="quiet-link" href="/modelos">Explorar modelos</Link>
          </div>
        </div>
      </section>

      <p className="not-found-locations">Icaraí / Niterói — Ipanema / Rio de Janeiro</p>
    </main>
  );
}
