import { validateCatalogBase } from "./catalog-validation";

export type BikeUse = "cidade" | "compacta" | "passageiro" | "distancia" | "performance";
export type BikeStatus = "available" | "coming_soon" | "hidden";

export type BikeSpecs = {
  motorWatts: number;
  motorCount: number;
  secondaryMotorWatts?: number;
  batteryVoltage: number;
  batteryAmpHours: number;
  batteryCount: number;
  capacityKg: number;
};

export type Bike = {
  id: string;
  slug: string;
  name: string;
  category: string;
  uses: BikeUse[];
  status: BikeStatus;
  featuredOrder?: number;
  priceCents: number;
  originalPriceCents: number;
  rangeKm: number;
  specs: BikeSpecs;
  badge: string;
  feature: string;
  detail: string;
  image: string;
  /** Campos de apresentação mantidos para as telas existentes. */
  price: string;
  originalPrice: string;
  available: boolean;
  range: string;
  motor: string;
  battery: string;
  support: string;
};

type BikeInput = Omit<Bike, "id" | "price" | "originalPrice" | "available" | "range" | "motor" | "battery" | "support">;

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const formatPrice = (priceCents: number) => money.format(priceCents / 100).replace(/\u00a0/g, " ");

function formatMotor(specs: BikeSpecs) {
  if (specs.motorCount === 1) return `${specs.motorWatts.toLocaleString("pt-BR")} W`;
  const secondary = specs.secondaryMotorWatts ?? specs.motorWatts;
  return `duplo · ${specs.motorWatts.toLocaleString("pt-BR")} W + ${secondary.toLocaleString("pt-BR")} W`;
}

function formatBattery(specs: BikeSpecs) {
  const prefix = specs.batteryCount > 1 ? "dupla · " : "";
  return `${prefix}${specs.batteryVoltage} V · ${specs.batteryAmpHours.toLocaleString("pt-BR")} Ah`;
}

function createBike(input: BikeInput): Bike {
  return {
    ...input,
    id: input.slug,
    price: formatPrice(input.priceCents),
    originalPrice: formatPrice(input.originalPriceCents),
    available: input.status === "available",
    range: `até ${input.rangeKm} km`,
    motor: formatMotor(input.specs),
    battery: formatBattery(input.specs),
    support: `até ${input.specs.capacityKg} kg`,
  };
}

export const bikeUses: Array<{ id: BikeUse; label: string; description: string }> = [
  { id: "cidade", label: "Cidade", description: "Para deslocamentos urbanos e a rotina de todos os dias." },
  { id: "compacta", label: "Compacta", description: "Mais fácil de acomodar em elevadores, garagens e espaços menores." },
  { id: "passageiro", label: "Com passageiro", description: "Modelos preparados para dividir o caminho com conforto." },
  { id: "distancia", label: "Longa distância", description: "Autonomia para ampliar o raio entre as recargas." },
  { id: "performance", label: "Performance", description: "Resposta, tração e potência para percursos mais exigentes." },
];

/**
 * Conteúdo de demonstração baseado no inventário salvo em materiais/dados-fonte/catalogo-inow.md
 * e materiais/dados-fonte/catalogo-precos.csv. Preços e disponibilidade devem ser validados com
 * a loja antes do lançamento e depois migrados para o Supabase.
 */
export const bikes: Bike[] = [
  createBike({
    slug: "inow-v20-mini",
    name: "INOW V20 Mini",
    category: "Compacta urbana",
    uses: ["cidade", "compacta"],
    status: "available",
    featuredOrder: 1,
    priceCents: 699900,
    originalPriceCents: 799900,
    rangeKm: 45,
    specs: { motorWatts: 750, motorCount: 1, batteryVoltage: 48, batteryAmpHours: 13, batteryCount: 1, capacityKg: 150 },
    badge: "Nova versão 2026",
    feature: "Pequena no tamanho. Grande na presença.",
    detail: "Pneus FAT 16×4\" e um corpo compacto para quem precisa atravessar a cidade, entrar no elevador e guardar a bike sem drama.",
    image: "/imagens/otimizadas/067_v20-mini-cover.png.webp"
  }),
  createBike({
    slug: "inow-v20-brake-pro",
    name: "INOW V20 Brake Pro",
    category: "Top de vendas",
    uses: ["cidade", "passageiro"],
    status: "available",
    featuredOrder: 2,
    priceCents: 899900,
    originalPriceCents: 1049900,
    rangeKm: 50,
    specs: { motorWatts: 1000, motorCount: 1, batteryVoltage: 48, batteryAmpHours: 15.6, batteryCount: 1, capacityKg: 150 },
    badge: "Top Brasil 2025/26",
    feature: "A campeã para rodar acompanhado.",
    detail: "Banco duplo, freio hidráulico, alarme, NFC e cadeado integrado em uma configuração que virou referência para a rotina urbana.",
    image: "/imagens/otimizadas/026_v20-brake-pro-cover.jpg.webp"
  }),
  createBike({
    slug: "inow-v30",
    name: "INOW V30",
    category: "Performance",
    uses: ["cidade", "distancia"],
    status: "coming_soon",
    priceCents: 1199900,
    originalPriceCents: 1399900,
    rangeKm: 120,
    specs: { motorWatts: 1000, motorCount: 1, batteryVoltage: 48, batteryAmpHours: 15.6, batteryCount: 2, capacityKg: 150 },
    badge: "Em breve",
    feature: "Uma semana sem tomada.",
    detail: "Bateria dupla, GPS integrado e pneus Compass 20×4\" para transformar longas distâncias em uma escolha simples.",
    image: "/imagens/otimizadas/071_v30-cover.png.webp"
  }),
  createBike({
    slug: "inow-v30-elite",
    name: "INOW V30 Elite",
    category: "Performance premium",
    uses: ["distancia", "performance"],
    status: "coming_soon",
    priceCents: 1599900,
    originalPriceCents: 1849900,
    rangeKm: 120,
    specs: { motorWatts: 1000, motorCount: 2, secondaryMotorWatts: 1000, batteryVoltage: 48, batteryAmpHours: 15.6, batteryCount: 2, capacityKg: 150 },
    badge: "Em breve",
    feature: "Dois motores. Sem terreno impossível.",
    detail: "Tração dupla, aceleração imediata e bateria dupla para quem quer potência sobrando em qualquer subida do Rio.",
    image: "/imagens/otimizadas/068_v30-elite-cover.jpg.webp"
  }),
  createBike({
    slug: "inow-v35",
    name: "INOW V35",
    category: "Urbana premium",
    uses: ["cidade", "distancia"],
    status: "available",
    featuredOrder: 3,
    priceCents: 1399900,
    originalPriceCents: 1599900,
    rangeKm: 120,
    specs: { motorWatts: 1000, motorCount: 1, batteryVoltage: 48, batteryAmpHours: 15.6, batteryCount: 2, capacityKg: 150 },
    badge: "Nova versão 2026",
    feature: "Espaço para a rotina inteira.",
    detail: "Cesto central, dupla suspensão hidráulica e autonomia estendida para compras, trabalho e passeio sem apertar o passo.",
    image: "/imagens/otimizadas/025_v35-cover.jpg.webp"
  }),
  createBike({
    slug: "inow-v40-pro",
    name: "INOW V40 Pro",
    category: "Performance",
    uses: ["cidade", "passageiro"],
    status: "available",
    priceCents: 1249900,
    originalPriceCents: 1399900,
    rangeKm: 60,
    specs: { motorWatts: 1000, motorCount: 1, batteryVoltage: 48, batteryAmpHours: 18, batteryCount: 1, capacityKg: 150 },
    badge: "Nova versão 2026",
    feature: "Bateria grande, resposta pronta.",
    detail: "Banco estendido para passageiro, cadeado integrado ao quadro e 18 Ah para não pensar na tomada durante o dia.",
    image: "/imagens/otimizadas/073_v40-pro-cover.jpg.webp"
  }),
  createBike({
    slug: "inow-x25",
    name: "INOW X25",
    category: "Lifestyle",
    uses: ["cidade"],
    status: "available",
    priceCents: 999900,
    originalPriceCents: 1149900,
    rangeKm: 50,
    specs: { motorWatts: 1000, motorCount: 1, batteryVoltage: 48, batteryAmpHours: 15.6, batteryCount: 1, capacityKg: 150 },
    badge: "Lançamento 2026",
    feature: "Lifestyle elétrico, sem esforço.",
    detail: "Pneus Dual Color, farol LED e uma presença que funciona tanto no deslocamento quanto no passeio de fim de tarde.",
    image: "/imagens/otimizadas/066_x25-cover.jpg.webp"
  }),
  createBike({
    slug: "inow-x30",
    name: "INOW X30",
    category: "Lifestyle",
    uses: ["cidade", "passageiro", "performance"],
    status: "available",
    priceCents: 1149900,
    originalPriceCents: 1299900,
    rangeKm: 50,
    specs: { motorWatts: 1000, motorCount: 1, batteryVoltage: 52, batteryAmpHours: 15.6, batteryCount: 1, capacityKg: 150 },
    badge: "Lançamento 2026",
    feature: "Mais voltagem. Mais resposta.",
    detail: "Bateria de 52 V, banco estendido e quatro opções de cor para quem quer potência sem abrir mão da personalidade.",
    image: "/imagens/otimizadas/074_x30-cover.jpg.webp"
  }),
  createBike({
    slug: "inow-x50-action-pro",
    name: "INOW X50 Action Pro",
    category: "Action",
    uses: ["cidade", "passageiro"],
    status: "available",
    featuredOrder: 4,
    priceCents: 1249900,
    originalPriceCents: 1449900,
    rangeKm: 60,
    specs: { motorWatts: 1000, motorCount: 1, batteryVoltage: 48, batteryAmpHours: 19.2, batteryCount: 1, capacityKg: 150 },
    badge: "Sucesso de vendas",
    feature: "Ação sem limites.",
    detail: "Banco duplo, suporte dianteiro, câmbio Shimano e a maior bateria da linha para encarar uma rotina mais intensa.",
    image: "/imagens/062_x50-action-pro-cover.webp"
  }),
  createBike({
    slug: "inow-d50-cross",
    name: "INOW D50 Cross",
    category: "Cross urbana",
    uses: ["cidade", "performance"],
    status: "available",
    priceCents: 1299900,
    originalPriceCents: 1449900,
    rangeKm: 50,
    specs: { motorWatts: 1000, motorCount: 1, batteryVoltage: 48, batteryAmpHours: 15.6, batteryCount: 1, capacityKg: 150 },
    badge: "Lançamento 2026",
    feature: "Estilo cross. Tecnologia urbana.",
    detail: "Pneus 20×4\", suspensão hidráulica e display inteligente para sair do asfalto sem perder a praticidade na cidade.",
    image: "/imagens/otimizadas/033_d50-cross-cover.png.webp"
  }),
  createBike({
    slug: "inow-x100-elite",
    name: "INOW X100 Elite",
    category: "Exclusive series",
    uses: ["distancia", "performance"],
    status: "available",
    priceCents: 1899900,
    originalPriceCents: 2299900,
    rangeKm: 120,
    specs: { motorWatts: 1000, motorCount: 2, secondaryMotorWatts: 750, batteryVoltage: 52, batteryAmpHours: 20, batteryCount: 2, capacityKg: 150 },
    badge: "Topo de linha",
    feature: "A nossa obra-prima.",
    detail: "GPS, suporte de carga, câmbio Shimano e três acabamentos exclusivos para quem não quer fazer concessões.",
    image: "/imagens/otimizadas/080_x100-cover-DrkSq7ql.png.webp"
  }),
];

validateCatalogBase(bikes);

export const catalogCategories = ["Todos", ...Array.from(new Set(bikes.filter((bike) => bike.status !== "hidden").map((bike) => bike.category)))];
