import type { Metadata } from "next";
import "./globals.css";
import { indexable, siteOrigin } from "./lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin ?? "http://localhost:3000"),
  title: "flexmobi.rj — Bikes elétricas no Rio e em Niterói",
  description: "Conheça as bikes elétricas INOW da flexmobi.rj e encontre nossas lojas em Icaraí e Ipanema.",
  robots: {
    index: indexable,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
