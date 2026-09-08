export const storeContacts: Record<string, { phone: string; label: string }> = {
  icarai: { phone: "5521971937036", label: "(21) 97193-7036" },
  ipanema: { phone: "5521998292921", label: "(21) 99829-2921" },
};

export function storeWhatsappUrl(storeId: string, message?: string) {
  const contact = storeContacts[storeId];
  return contact ? `https://wa.me/${contact.phone}${message ? `?text=${encodeURIComponent(message)}` : ""}` : null;
}

export const stores = [
  { number: "01", id: "icarai", name: "Icaraí", locality: "Niterói", city: "Niterói · RJ", address: "R. Pres. Backer, 9", note: "A loja para começar a testar a cidade.", map: "https://maps.app.goo.gl/rS5L2zKQYiuf622b8" },
  { number: "02", id: "ipanema", name: "Ipanema", locality: "Rio de Janeiro", city: "Rio de Janeiro · RJ", address: "R. Teixeira de Melo, 21", note: "Perto do mar, pronta para o seu próximo caminho.", map: "https://maps.app.goo.gl/mf9dPNSM2ZjgDZEJ6" },
];

// Only public, approved business information belongs in these variables.
const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
export const business = {
  whatsapp: /^55[1-9]\d{9,10}$/.test(phone) ? phone : "",
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME?.trim() ?? "",
  cnpj: process.env.NEXT_PUBLIC_CNPJ?.trim() ?? "",
  responseTime: process.env.NEXT_PUBLIC_RESPONSE_TIME?.trim() ?? "",
};

export function whatsappUrl(message?: string) {
  if (!business.whatsapp) return null;
  return `https://wa.me/${business.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
