import Link from "next/link";
import { business, stores, storeContacts, storeWhatsappUrl } from "../data/business";
import BrandLogo from "./brand-logo";
import styles from "./site-footer.module.css";

function SocialIcon({ instagram = false }: { instagram?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{instagram ? <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></> : <><path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.5-4.8A8.5 8.5 0 1 1 20.5 11.5Z"/><path d="m8 7 2 3-1 1c1 2 2 3 4 4l1-1 3 1c0 2-2 3-4 2-4-1-7-4-7-7 0-2 1-3 2-3Z"/></>}</svg>;
}

export default function SiteFooter() {
  return (
    <footer className={`site-footer ${styles.footer}`} id="contato">
      <div className={styles.grid}>
        <div className={styles.identity}><BrandLogo href="/" footer /><p>Viva o Rio no seu ritmo.</p><a className={styles.social} href="https://www.instagram.com/flexmobi.rj/" target="_blank" rel="noopener noreferrer"><SocialIcon instagram /><span>@flexmobi.rj</span></a></div>
        {stores.map((store) => {
          const contact = storeContacts[store.id];
          const href = storeWhatsappUrl(store.id, `Olá! Vim pelo site da Flexmobi e gostaria de falar com a unidade de ${store.name}.`);
          return <div className={styles.store} key={store.id}><span className={styles.label}>{store.locality}</span><h3>{store.name}</h3><address>{store.address}</address><a className={styles.map} href={store.map} target="_blank" rel="noopener noreferrer">Como chegar </a>{href && <a className={styles.whatsapp} href={href} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${store.name}: ${contact.label}`}><SocialIcon /><span><small>WhatsApp da loja</small>{contact.label}</span></a>}</div>;
        })}
        <nav className={styles.nav} aria-label="Links do rodapé"><span className={styles.label}>Explore</span><Link href="/modelos">Nossas bikes</Link><Link href="/#test-ride">Agendar test ride</Link><Link href="/#faq">Dúvidas frequentes</Link><Link href="/privacidade">Privacidade e cookies</Link></nav>
      </div>
      <div className="site-footer-bottom"><span>© 2026 flexmobi.rj · INOW + Flex Mobi</span>{business.legalName ? <span>{business.legalName}</span> : null}{business.cnpj ? <span>CNPJ: {business.cnpj}</span> : null}{business.responseTime ? <span>{business.responseTime}</span> : null}</div>
    </footer>
  );
}
