# Estudo 3D da V20 Brake Pro — revisão 06

Revisão de 6 de setembro de 2026. Reconstrução guiada pelas fotos, com geometria 3D real; não é uma foto sobre um plano nem um arquivo CAD do fabricante.

- Modelo: `public/modelos-3d/v20-brake-pro-estudo.glb`.
- Prévia: `/modelos-3d/index.html`.
- Comparação direta: `/modelos-3d/index.html?comparar=1`.
- Relatório gerado: `public/modelos-3d/model-report.json`.
- Regenerar: `node scripts/build-bike-3d.mjs`.
- Validar o arquivo gerado: `node scripts/validate-bike-3d.mjs`.
- Testar superfícies, medidas, câmera e encaixes: `node --test scripts/3d/geometry.test.mjs scripts/3d/v20-measurements.test.mjs scripts/3d/reference-camera.test.mjs scripts/3d/attachments.test.mjs`.
- Pesquisa dimensional e coleta pendente: [medidas-v20.md](./medidas-v20.md).

## Referências utilizadas

Fotos locais em `public/imagens`: 026 (capa), 014 e 016 (ângulos), 041, 042, 048 e 049 (quadro, transmissão e farol), 056 (traseira) e 060 (guidão). O logotipo foi obtido de `079_logo_inow-CqfG1FmB.webp`, preservando o desenho fornecido em vez de substituir a marca por uma fonte genérica.

Referência complementar consultada: [V20 Brake Pro na INOW](https://inowbrasil.com.br/produto/inow-v20-brake-pro). As fotografias do projeto prevalecem para a aparência do exemplar; não foram transferidas especificações comerciais de variantes para o catálogo. A modelagem não depende de vídeo, fotogrametria ou serviço pago de geração.

## O que foi refinado

### Ajustes desta revisão

- Tubos maiores com mais resolução ao longo das curvas e ao redor da seção. Chapas com curvas mais suaves, três segmentos de chanfro e normais suavizadas, preservando quinas acentuadas.
- Pontas dos dois bancos arredondadas por novas seções de contorno. Vivos e acabamento inferior calculados pela mesma superfície do estofado, corrigindo os trechos que ficavam separados da lateral.
- Display ligado à travessa por duas abraçadeiras, braços curvos e base articulada; tela e vidro compartilham a mesma transformação. Teclas reposicionadas sobre a botoneira.
- Lanterna com carcaça, lente e suporte dobrado conectado à base traseira. O suporte é uma aproximação visual da foto 056, não um desenho mecânico certificado.
- Refletores com presilhas junto aos raios fundidos, válvulas estendidas até o aro, eixo contínuo e apoio central dos discos. Adaptadores ligam as pinças à região dos eixos.
- Cabos do guidão terminam nos mesmos pontos de ligação das mangueiras e chicotes do quadro, mesmo com a transformação do conjunto. A proteção espiral agora envolve um núcleo contínuo; farol e display também têm cabos ligados aos respectivos conjuntos.
- Ferragens das articulações com pinos passantes; grade do farol com quatro pés ligados ao aro. Logotipos, parafusos, fechadura e botões da bateria assentados mais próximos da carcaça, eliminando separações visíveis entre essas camadas.
- Cinco testes novos verificam distâncias e regiões de contato na geometria não agrupada: display, vivos do banco, refletores, suporte da lanterna e acabamentos da bateria. São verificações delimitadas, não uma certificação de todos os encaixes do modelo.
- Para compensar parte do aumento de geometria nas curvas visíveis, anéis pequenos e cilindros de ferragens usam menos segmentos. O GLB continua abaixo do limite local de 10 MiB, mas não está otimizado para a capa do site.

### Refinamentos preservados da revisão 05

- Ponte superior, longarina, chapas e suporte do passageiro com contornos e recortes arredondados na própria geometria. Triângulos de área nula são removidos antes da exportação.
- Banco reposicionado para frente e para baixo, contorno superior revisto e costuras menos contrastantes. Ancoragens e inclinação da mola acompanham a nova posição.
- Controlador sob o banco mais compacto, com aletas e chapa perfurada alinhadas à mesma inclinação; tirantes traseiros agora terminam na superfície curva do paralama, com fixações.
- Guidão mais baixo, novas curvas nas hastes e abraçadeiras da travessa inferior. Posição e ângulo da bateria refinados, com presilhas do trilho e interruptor vermelho.
- Discos mais vazados, com seis janelas e duas faixas alternadas de rasgos; inscrições dos pneus maiores e reposicionadas para aproximar a leitura das fotos.
- Comparação estabilizada pelos centros dos dois eixos, marcados manualmente em cada foto, com ajustes de direção, lente e rotação da câmera. Não é fotogrametria nem medição de precisão.

### Referência dimensional preservada da revisão 04

- Pneu e aro refeitos com referência nominal Kenda 98-406: carcaça com seção de 98 mm e assentamento de 406 mm. O código do pneu do exemplar ainda precisa de confirmação.
- Perfil contínuo dos flancos, nova seção das bordas do aro, cravos acompanhando a banda e letras assentadas na superfície curva.
- Escala global uniforme ancorada no aro, contato com o chão calculado pela malha, reenquadramento das câmeras e sombras acompanhando a escala.
- Painel **Medidas**, com fontes, dados nominais, dimensões medidas do próprio GLB e aviso sobre a variante não confirmada do manual.
- Metadados dimensionais no GLB e relatório; testes verificam seção do pneu, circularidade, assentamento, escala exportada e contato com o chão.

As dimensões 164 × 68 × 115 cm do manual da BK-V20 Pro de 750 W ficaram **somente como comparação**, não foram impostas à Brake Pro. A pesquisa e a justificativa estão em [medidas-v20.md](./medidas-v20.md). A geometria continua um estudo aproximado; o manual encontrado não certifica a versão das fotos.

### Refinamentos preservados da revisão 03

- Comparação com três fotos locais: lado da bateria (048), transmissão (042) e frente em três quartos (049). Foto e modelo ficam lado a lado, ou empilhados no celular, com um botão para realinhar a câmera após girar.
- Contornos dos bancos interpolados suavemente e costuras do passageiro acompanhando a superfície. A posição foi novamente ajustada na revisão 05.
- Altura do guidão e do garfo ajustada à silhueta das referências, com reposicionamento do farol, das ancoragens e da mola.
- Barra diagonal saindo da região sob o banco, em vez de atravessar o espaço da bateria a partir da frente do quadro.
- Suporte traseiro mais aberto, com longarina curva, tirante e fixações; sustentação superior do paralama e mangueiras dos freios.
- Bateria com carcaça e tampas de cantos arredondados de verdade, independente da espessura da tampa; posição e inclinação revistas.
- Hastes escuras do garfo, brilho mais contido na bateria e iluminação menos intensa. A comparação não adiciona sombra no chão, para facilitar a leitura da silhueta.
- Câmeras de detalhe reenquadradas para as novas posições dos conjuntos.

As alterações de posição foram estimadas visualmente. A revisão 04 acrescentou referências nominais dos componentes, sem tornar oficiais as outras dimensões. A revisão 05 deixa de enquadrar apenas pela silhueta total e usa dois pontos de referência nos eixos. Os testes verificam a projeção matemática desses pontos, não a exatidão de sua marcação na foto nem a fidelidade dimensional da bike.

### Detalhes presentes no modelo

- Silhueta do quadro, ponte vazada, ancoragens e espaço aberto do amortecedor.
- Rodas com raios duplos, cubo traseiro, válvulas, refletores, flancos e cravos dos pneus.
- Discos recortados, pinças, eixos, arruelas, parafusos e encaixes.
- Banco principal contornado, almofada traseira, costuras, suportes e controlador sob o banco.
- Mesas do garfo, hastes, retentores, tampas e amortecedor com mola helicoidal.
- Paralamas em casca fina, bordas e arames de sustentação.
- Bateria com tampa, trilho, fechadura, porta de carga, indicador e logotipo original nos dois lados.
- Guidão de hastes duplas, punhos, manetes, botoneira, campainha, painel, chaveiro e cabos com proteção espiral.
- Farol com carcaça abaulada, refletores segmentados, projetor central e grade circular com centro quadrado arredondado.
- Coroa, cassete, corrente com elos, duas roldanas, gaiola do câmbio, conduíte, pedais e descanso lateral.
- Lanterna traseira, suporte e ferragens.

O acabamento separa pintura, plástico, borracha, vinil e metal. Três mapas procedurais de microtextura ficam embutidos no GLB; não são texturas fotográficas nem implicam fotorrealismo.

## Arquivos e desempenho

O gerador está dividido em `scripts/3d/geometry.mjs` (ferramentas de geometria), `v20-detail.mjs` (peças), `v20-measurements.mjs` (referências e classificação das medidas), `v20-wheel.mjs` (perfil físico dos pneus/aros), `logo-geometry.mjs` (desenho fornecido convertido em malha) e `grain.mjs` (microtexturas incorporadas).

Esta revisão gera **2.217 peças de construção**, agrupadas em **9 conjuntos e 74 malhas por material**, com **300.188 triângulos** e **10.365.336 bytes** (10,37 MB / 9,89 MiB). Os nomes dos tipos de peça permanecem nos metadados; as peças não ficam todas como objetos independentes depois do agrupamento. As 74 chamadas correspondem apenas às malhas da bike; chão e passes de sombras adicionam custo na prévia. O arquivo de estudo ainda precisa de otimização antes de entrar na capa do site.

O alinhamento das referências fica em `public/modelos-3d/reference-camera.mjs`, compartilhado entre a prévia e os testes matemáticos de enquadramento.

A prévia renderiza quando há interação ou alteração da tela, sem giro automático nem laço de renderização contínuo. Inclui sete vistas, rotação por arraste ou setas, zoom, instruções de carregamento/erro, download e o modo Foto × modelo. A câmera ajusta a distância à proporção da tela para não cortar as rodas no celular. Os controles têm altura mínima de 44 pixels.

Para revisar com o proprietário: abra Foto × modelo, selecione uma referência, compare proporções e acabamentos e use Realinhar modelo após girar. As fotos mostram variações de adesivos, refletores e acabamento; não se deve presumir que todas representam exatamente a mesma versão de fabricação.

Three.js é uma dependência do projeto. O processamento do logotipo usa o `sharp` disponibilizado pela instalação do Next.js. As licenças do Three.js e da fonte Helvetiker usada nas inscrições aproximadas dos pneus são copiadas para `public/modelos-3d/vendor`. Os direitos sobre marcas e fotos permanecem com seus titulares. As fotos não são enviadas para serviços de geração.

## Verificação desta revisão

- Regeneração do GLB concluída.
- Verificador local: PASS para estrutura dos blocos, limites dos buffers, valores finitos, índices e normais unitárias das malhas, conjuntos, logo, decodificação das três texturas, licença e limite de tamanho de 10 MiB. Também mede os vértices exportados com suas transformações, confere o relatório, o chão e os metadados dimensionais. Não substitui um validador completo de conformidade glTF.
- Dezesseis testes passaram: quatro de bancos/tampas/chapas vazadas, quatro de medidas/circularidade/assentamento/perfil, três de enquadramento e cinco de encaixes. Os testes de encaixe usam a malha não agrupada; o verificador separado confere o GLB exportado.
- Carregamento e inspeção visual da revisão 06 no navegador do aplicativo em 1280 × 720, incluindo guidão, bancos e rotação por teclado. Sem transbordamento horizontal e sem erros ou avisos de execução registrados nessa sessão. A prévia inicialmente não respondeu porque não havia servidor ativo em 3005; foi iniciado um servidor local que serve somente `public/`, ligado a `127.0.0.1`, e a revisão 06 carregou em uma nova aba. HTML, módulos, foto e GLB responderam com HTTP 200; a solicitação automática de favicon retornou 404, sem impedir a visualização.
- Os testes de câmera incluem painéis em retrato, mas **não contam como teste móvel da interface**. A validação responsiva e de interação em celulares desta revisão continua pendente.
- A validação não equivale a um teste de desempenho em celulares físicos ou em todos os navegadores.

## Limites e próximo passo

A seção e o assentamento dos pneus usam valores nominais documentados, condicionados à confirmação do componente do exemplar. As dimensões gerais, profundidades, junções e superfícies ocultas continuam estimadas. O caminho da corrente, componentes internos, inscrições dos pneus e pequenos comandos continuam aproximações visuais. Não usar este estudo para informar dimensões, capacidade, segurança, garantia ou características comerciais.

A capa do site não foi substituída e esta revisão não foi publicada por esta tarefa. Antes de integrar: aprovar a semelhança com o proprietário, conferir medidas e fotos do mesmo exemplar, otimizar/comprimir o GLB, testar em aparelhos reais e manter fotografia alternativa com carregamento sob demanda. Para fidelidade de réplica, serão necessárias medidas e vistas adicionais ou o modelo oficial do fabricante.
