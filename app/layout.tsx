import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "flexmobi.rj — Viva o Rio em outro ritmo",
  description: "Bikes elétricas para viver a cidade com mais liberdade, estilo e desempenho.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
