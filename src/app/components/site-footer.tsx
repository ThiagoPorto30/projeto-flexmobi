import Link from "next/link";
import { business, stores, whatsappUrl } from "../data/business";

export default function SiteFooter() {
  const contact = whatsappUrl();
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div><Link className="brand brand--footer" href="/" aria-label="flexmobi.rj — início"><span className="brand-mark">f</span><span className="brand-name">flexmobi</span><span className="brand-suffix">.rj</span></Link><p>Viva o Rio no seu ritmo.</p></div>
        {stores.map((store) => <div key={store.id}><strong>{store.name} · {store.locality}</strong><address>{store.address}</address><a href={store.map} target="_blank" rel="noopener noreferrer">Como chegar ↗</a></div>)}
        <nav aria-label="Links do rodapé"><Link href="/modelos">Modelos</Link><Link href="/#faq">Perguntas frequentes</Link><Link href="/privacidade">Privacidade e cookies</Link>{contact ? <a href={contact} target="_blank" rel="noopener noreferrer">Atendimento no WhatsApp ↗</a> : <Link href="/#lojas">Encontre uma loja</Link>}</nav>
      </div>
      <div className="site-footer-bottom"><span>© 2026 flexmobi.rj · INOW + Flex Mobi</span>{business.legalName ? <span>{business.legalName}</span> : null}{business.cnpj ? <span>CNPJ: {business.cnpj}</span> : null}{business.responseTime ? <span>{business.responseTime}</span> : null}</div>
    </footer>
  );
}
