export type ProductHighlight = {
  index: string;
  title: string;
  body: string;
};

export type ProductDetail = {
  colors: string[];
  gallery: string[];
  storyTitle: string;
  storyBody: string;
  highlights: ProductHighlight[];
  technical: Array<{ label: string; value: string }>;
  idealFor: string[];
};

const paths = (...files: string[]) => files.map((file) => `/imagens/${file}`);

export const productDetails: Record<string, ProductDetail> = {
  "inow-v20-mini": {
    colors: ["Branco"],
    gallery: paths("067_v20-mini-cover.png", "017_v20-mini-8.jpg", "004_v20-mini-9.jpg", "031_v20-mini-handlebar.jpg", "032_v20-mini-battery.jpg", "070_v20-mini-suspension.jpg"),
    storyTitle: "Cabe na rotina. Sobra na cidade.",
    storyBody: "A V20 Mini reduz o tamanho, não a experiência. As rodas FAT de 16 polegadas trazem estabilidade, enquanto a geometria compacta simplifica elevador, garagem e porta-malas.",
    highlights: [
      { index: "01", title: "Compacta de verdade", body: "Estrutura pensada para espaços menores e trajetos urbanos rápidos." },
      { index: "02", title: "Conectada", body: "Display Action 2, desbloqueio NFC, aplicativo e som Bluetooth." },
      { index: "03", title: "Conforto no asfalto", body: "Pneus FAT 16×4 e suspensão hidráulica para absorver a cidade." },
    ],
    technical: [{ label: "Pneus", value: "FAT 16×4\"" }, { label: "Freios", value: "Duplo hidráulico" }, { label: "Transmissão", value: "Shimano · 7 marchas" }, { label: "Conectividade", value: "App · Bluetooth · NFC" }],
    idealFor: ["Elevadores e garagens compactas", "Trajetos urbanos diários", "Quem quer começar nas elétricas"],
  },
  "inow-v20-brake-pro": {
    colors: ["Preto"],
    gallery: paths("026_v20-brake-pro-cover.jpg", "016_v20-brake-pro-angle-front.jpg", "014_v20-brake-pro-angle-rear.jpg", "042_v20-brake-pro-side.jpg", "060_v20-brake-pro-handlebar.jpg", "050_v20-brake-pro-brown-seat.jpg"),
    storyTitle: "Tudo que importa, em uma só bike.",
    storyBody: "A V20 Brake Pro combina banco duplo, motor de 1.000 W e uma camada completa de tecnologia e segurança. É a escolha que resolve deslocamento, companhia e rotina sem complicar.",
    highlights: [
      { index: "01", title: "Banco duplo", body: "Espaço de série para dividir o caminho com mais conforto." },
      { index: "02", title: "Segurança integrada", body: "Alarme, cartão NFC e cadeado incorporado à roda dianteira." },
      { index: "03", title: "Controle completo", body: "Display Action 2 colorido e aplicativo dedicado para o dia a dia." },
    ],
    technical: [{ label: "Pneus", value: "FAT 20×4\"" }, { label: "Freios", value: "Duplo hidráulico" }, { label: "Transmissão", value: "Shimano · 7 marchas" }, { label: "Segurança", value: "Alarme · NFC · cadeado" }],
    idealFor: ["Levar acompanhante", "Subidas e arrancadas urbanas", "Uso diário com mais proteção"],
  },
  "inow-v30": {
    colors: ["Azul Satin"],
    gallery: paths("071_v30-cover.png", "028_v30-angle-front.jpg", "051_v30-side.jpg", "022_v30-rear.jpg", "045_v30-side-black.jpg"),
    storyTitle: "Uma semana sem pensar na tomada.",
    storyBody: "A bateria dupla amplia o raio de ação para até 120 km. GPS integrado, pneus largos e motor de 1.000 W completam uma plataforma feita para atravessar a cidade inteira.",
    highlights: [
      { index: "01", title: "Bateria dupla", body: "Autonomia estendida para reduzir a frequência de recarga." },
      { index: "02", title: "GPS integrado", body: "Localização em tempo real e recursos de segurança pelo aplicativo." },
      { index: "03", title: "Pronta para distância", body: "Pneus Compass 20×4 e suspensão hidráulica para longos trajetos." },
    ],
    technical: [{ label: "Pneus", value: "Compass FAT 20×4\"" }, { label: "Freios", value: "Duplo hidráulico" }, { label: "Transmissão", value: "Shimano · 7 marchas" }, { label: "Conectividade", value: "GPS · App · NFC" }],
    idealFor: ["Grandes deslocamentos", "Quem recarrega menos", "Rotina urbana intensa"],
  },
  "inow-v30-elite": {
    colors: ["Preto"],
    gallery: paths("068_v30-elite-cover.jpg", "006_v30-elite-front.jpg", "024_v30-elite-side.jpg", "019_v30-elite-rear.jpg", "005_v30-elite-handlebar.jpg", "052_v30-elite-outdoor-front.jpg"),
    storyTitle: "Dois motores. Nenhuma hesitação.",
    storyBody: "A V30 Elite leva a plataforma de longa autonomia ao extremo. Dois motores de 1.000 W entregam tração e resposta para subida, vento contra ou carga extra.",
    highlights: [
      { index: "01", title: "Tração dupla", body: "Dois motores trabalhando juntos quando o caminho exige mais." },
      { index: "02", title: "Até 120 km", body: "Bateria dupla para ampliar o caminho entre as recargas." },
      { index: "03", title: "Proteção conectada", body: "GPS, alarme, aplicativo e display colorido inteligente." },
    ],
    technical: [{ label: "Motorização", value: "1.000 W + 1.000 W" }, { label: "Freios", value: "Duplo hidráulico" }, { label: "Suspensão", value: "Hidráulica" }, { label: "Segurança", value: "GPS · alarme · NFC" }],
    idealFor: ["Subidas mais exigentes", "Longas distâncias", "Máxima resposta e tração"],
  },
  "inow-v35": {
    colors: ["Preto"],
    gallery: paths("025_v35-cover.jpg", "001_v35-angle-front.jpg", "043_v35-side.jpg", "015_v35-outdoor-front.jpg", "030_v35-outdoor-wide.jpg", "038_v35-handlebar.jpg"),
    storyTitle: "Leve o dia inteiro com você.",
    storyBody: "O cesto central organiza a rotina sem interferir na condução. Com bateria dupla e suspensão hidráulica nas duas extremidades, a V35 encontra equilíbrio entre utilidade e conforto.",
    highlights: [
      { index: "01", title: "Cesto central", body: "Espaço integrado para compras, mochila e pequenas cargas." },
      { index: "02", title: "Dupla suspensão", body: "Mais conforto e controle em pisos irregulares." },
      { index: "03", title: "Autonomia estendida", body: "Bateria dupla para chegar a até 120 km estimados." },
    ],
    technical: [{ label: "Carga", value: "Cesto central integrado" }, { label: "Freios", value: "Duplo hidráulico" }, { label: "Suspensão", value: "Dupla hidráulica" }, { label: "Display", value: "Action 2 colorido" }],
    idealFor: ["Compras e trabalho", "Longos trajetos", "Conforto em diferentes pisos"],
  },
  "inow-v40-pro": {
    colors: ["Preto"],
    gallery: paths("073_v40-pro-cover.jpg", "039_v40-pro-angle-front.jpg", "069_v40-pro-side.jpg", "076_v40-pro-side-2.jpg", "013_v40-pro-display.jpg", "044_v40-pro-seat.jpg"),
    storyTitle: "Mais bateria para um dia maior.",
    storyBody: "A bateria de 18 Ah sustenta uma rotina intensa, enquanto banco estendido e cadeado integrado tornam a V40 Pro uma solução prática para dividir o caminho.",
    highlights: [
      { index: "01", title: "Bateria de 18 Ah", body: "Capacidade ampliada para manter o ritmo por mais tempo." },
      { index: "02", title: "Banco estendido", body: "Mais espaço para passageiro sem improviso." },
      { index: "03", title: "Cadeado no quadro", body: "Uma camada de segurança que já acompanha a bike." },
    ],
    technical: [{ label: "Banco", value: "Estendido" }, { label: "Freios", value: "Duplo hidráulico" }, { label: "Suspensão", value: "Hidráulica" }, { label: "Conectividade", value: "App · NFC" }],
    idealFor: ["Rotina intensa", "Levar passageiro", "Quem prioriza bateria"],
  },
  "inow-x25": {
    colors: ["Branco", "Rosa"],
    gallery: paths("066_x25-cover.jpg", "058_x25-angle.jpg", "007_x25-front.jpg", "055_x25-angle-pink.jpg", "057_x25-city.jpg", "077_x25-display.jpg"),
    storyTitle: "Mobilidade também é expressão.",
    storyBody: "Pneus Dual Color, farol LED e duas opções de acabamento criam uma elétrica com assinatura visual própria — sem abrir mão de 1.000 W e freios hidráulicos.",
    highlights: [
      { index: "01", title: "Pneus Dual Color", body: "Um detalhe visual que muda completamente a presença da bike." },
      { index: "02", title: "Farol LED", body: "Mais leitura do caminho e identidade na dianteira." },
      { index: "03", title: "Carga rápida", body: "Bateria de 15,6 Ah com recarga estimada em 5 a 6 horas." },
    ],
    technical: [{ label: "Pneus", value: "FAT 20×4\" Dual Color" }, { label: "Freios", value: "Duplo hidráulico" }, { label: "Transmissão", value: "Shimano · 7 marchas" }, { label: "Segurança", value: "Alarme · NFC" }],
    idealFor: ["Estilo no dia a dia", "Passeios urbanos", "Quem quer personalização"],
  },
  "inow-x30": {
    colors: ["Preto", "Rosa", "Marrom", "Branco"],
    gallery: paths("074_x30-cover.jpg", "023_x30-angle-front.jpg", "012_x30-angle-rear.jpg", "053_x30-side.jpg", "063_x30-side-water.jpg", "061_x30-display.jpg"),
    storyTitle: "Mais voltagem. Mais resposta.",
    storyBody: "A arquitetura de 52 V entrega resposta mais viva em arrancadas e subidas. O banco estendido e as quatro cores disponíveis completam uma proposta potente e pessoal.",
    highlights: [
      { index: "01", title: "Sistema de 52 V", body: "Resposta superior quando você pede aceleração." },
      { index: "02", title: "Banco estendido", body: "Conforto para passageiro integrado ao desenho." },
      { index: "03", title: "Quatro acabamentos", body: "Preto, rosa, marrom ou branco para combinar com seu estilo." },
    ],
    technical: [{ label: "Banco", value: "Estendido" }, { label: "Freios", value: "Duplo hidráulico" }, { label: "Suspensão", value: "Hidráulica" }, { label: "Conectividade", value: "App · alarme · NFC" }],
    idealFor: ["Arrancadas e subidas", "Levar passageiro", "Escolher um acabamento próprio"],
  },
  "inow-x50-action-pro": {
    colors: ["Preto"],
    gallery: paths("062_x50-action-pro-cover.webp", "021_x50-action-pro-cover.jpg", "029_x50-action-pro-front-angle.jpg", "009_x50-action-pro-rear-angle.jpg"),
    storyTitle: "Ação para todos os dias.",
    storyBody: "A bateria de 19,2 Ah, o banco duplo e o suporte dianteiro formam uma elétrica pronta para uso intenso. Uma configuração consolidada para quem espera versatilidade real.",
    highlights: [
      { index: "01", title: "Bateria de 19,2 Ah", body: "Capacidade robusta para uma autonomia consistente." },
      { index: "02", title: "Pronta para carregar", body: "Suporte dianteiro e banco duplo já fazem parte do conjunto." },
      { index: "03", title: "Conjunto confiável", body: "Câmbio Shimano, freios hidráulicos e suspensão hidráulica." },
    ],
    technical: [{ label: "Banco", value: "Duplo" }, { label: "Freios", value: "Duplo hidráulico" }, { label: "Transmissão", value: "Shimano · 7 marchas" }, { label: "Display", value: "Action 2 colorido" }],
    idealFor: ["Uso intenso", "Levar passageiro e carga", "Deslocamentos diários"],
  },
  "inow-d50-cross": {
    colors: ["Preto"],
    gallery: paths("033_d50-cross-cover.png", "027_d50-cross-side.jpg"),
    storyTitle: "Visual cross. Leitura urbana.",
    storyBody: "A D50 Cross adota rodas, suspensão e posição de condução inspiradas no universo de aventura, mas mantém display inteligente, aplicativo e alarme para a rotina da cidade.",
    highlights: [
      { index: "01", title: "Postura cross", body: "Geometria e presença para quem quer sair do desenho convencional." },
      { index: "02", title: "Pneus 20×4", body: "Mais contato e estabilidade em pisos variados." },
      { index: "03", title: "Tecnologia urbana", body: "Display inteligente, aplicativo e alarme integrado." },
    ],
    technical: [{ label: "Pneus", value: "FAT 20×4\"" }, { label: "Freios", value: "Duplo hidráulico" }, { label: "Suspensão", value: "Hidráulica" }, { label: "Conectividade", value: "App · alarme" }],
    idealFor: ["Pisos variados", "Estética de aventura", "Passeios e trajetos urbanos"],
  },
  "inow-x100-elite": {
    colors: ["Urban", "Forest", "Winter"],
    gallery: paths("080_x100-cover-DrkSq7ql.png", "081_x100-grey-CEnFUGdT.png"),
    storyTitle: "A linha inteira levada ao limite.",
    storyBody: "Dois motores, bateria dupla de 52 V e GPS formam o topo do catálogo. A X100 Elite foi pensada para quem quer autonomia, força e acabamento sem escolher apenas um deles.",
    highlights: [
      { index: "01", title: "Motorização dupla", body: "1.000 W + 750 W para resposta e tração em situações exigentes." },
      { index: "02", title: "Dupla 52 V · 20 Ah", body: "A maior configuração de bateria do catálogo atual." },
      { index: "03", title: "Exclusive Series", body: "Três acabamentos e recursos completos de segurança e conectividade." },
    ],
    technical: [{ label: "Motorização", value: "1.000 W + 750 W" }, { label: "Transmissão", value: "Shimano · 7 marchas" }, { label: "Suspensão", value: "Hidráulica" }, { label: "Segurança", value: "GPS · alarme" }],
    idealFor: ["Máxima autonomia", "Performance premium", "Acabamentos exclusivos"],
  },
};

