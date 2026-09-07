# V20 Brake Pro — medidas, fontes e limites

Pesquisa de 5 de setembro de 2026, preservada no estudo 3D revisão 06 (6 de setembro). Não é uma ficha técnica comercial nem uma certificação dimensional da bicicleta da loja.

## O que foi encontrado

| Referência | Dado encontrado | Como foi utilizado |
| --- | --- | --- |
| [INOW — V20 Brake Pro](https://inowbrasil.com.br/produto/inow-v20-brake-pro) | Pneus FAT 20 × 4 | Confirmação da designação comercial do pneu do modelo atual. Não informa entre-eixos ou desenho dimensional completo na página consultada. |
| [Kenda — Krusade Sport K1188](https://bicycle.kendatire.com/en-us/find-a-tire/bicycle/fat-plus-tires/krusade-sport/) | Código 01204118801, ETRTO 98-406 | Referência nominal aplicada ao pneu/aro. As fotos locais mostram Kenda/Krusade, mas falta conferir o código exato do pneu instalado. |
| [Manual V20 PRO, página 7](https://drive.google.com/file/d/1yBA1T0UR3Ymb1rClpbrby5TpjSSxvSw7/view) | Veículo: 164 × 68 × 115 cm; embalagem: 142,5 × 27 × 86,5 cm | Somente comparação. A tabela identifica BK-V20 Pro de 750 W. Não foi comprovada equivalência com a versão da Brake Pro fotografada. |
| [Schwalbe — interpretação da ETRTO](https://www.schwalbe.com/en/technology-faq/tire-sizes/) | Largura nominal e diâmetro interno/assentamento | Evita confundir 406 mm com diâmetro externo da roda ou converter “20” em um diâmetro externo exato de 508 mm. |

O PDF foi acessado pela [página de distribuição da Neon Mobilidade](https://www.neonmobilidade.com.br/pagina/blog-manual-do-usuario-bicicleta-eletrica-v20-pro-download-em-pdf.html), não pelo domínio da INOW. A página 4 tem uma bicicleta visualmente próxima das referências; a tabela da página 7 separa veículo e embalagem. Essa semelhança não comprova identidade de ano, versão ou configuração. As páginas relevantes foram conferidas visualmente no PDF.

A página atual da Brake Pro anuncia 1000 W, enquanto o manual encontrado identifica 750 W. Não foram transferidos potência, bateria, limites de uso ou garantias desse manual para o catálogo do projeto.

## O que mudou no arquivo 3D

- Seção transversal nominal da carcaça: **98 mm**, em vez da aproximação anterior de 120 mm nas unidades de construção.
- Superfícies de assentamento representadas com **406 mm de diâmetro**. As bordas externas do aro são distintas desse assentamento; seu desenho continua estimado.
- Pneu reconstruído com perfil contínuo do talão à banda de rodagem; cravos reposicionados e inscrições projetadas na superfície curva.
- Escala global uniforme: `0,406 / (2 × 0,214) = 0,948598…`. O raio de 0,214 era a referência de construção do aro anterior. Essa ancoragem nominal corrige a escala do estudo, mas não transforma as outras peças em medidas oficiais.
- Rodas preservam a seção circular; não houve esticamento independente dos eixos para caber no comprimento/altura de outra versão.
- Contato dos cravos com o chão calculado pela malha final. Câmeras de detalhe e sombras acompanham a escala.
- Fontes, classificação dos dados e medidas da reconstrução ficam no GLB, em `model-report.json` e no botão **Medidas** da prévia.

O diâmetro externo do pneu depende do perfil, aro e inflação; **não foi encontrado como medida oficial**. No estudo, a carcaça fica com aproximadamente 582 mm de diâmetro e a banda com cravos com aproximadamente 592 mm. São resultados da reconstrução, não dados técnicos do fabricante.

## Divergência que ainda precisa ser resolvida

O arquivo reconstruído na revisão 06 mede aproximadamente **178,1 × 65,7 × 123,8 cm**; seu entre-eixos é aproximadamente **115,7 cm**. Esses números descrevem somente a malha. Não devem aparecer no catálogo como medidas da bicicleta. A pequena mudança de arredondamento da altura em relação à revisão 05 vem da discretização das ferragens, não de uma nova medição da bike.

A redução de altura em relação à revisão 04 resulta do ajuste visual do guidão, não de uma nova medida do fabricante. Posição do banco, bateria, suportes e ancoragens também foram refinados pelas fotos. A escala nominal das rodas permaneceu inalterada.

O comprimento e a altura são maiores que os do manual encontrado. Não é possível concluir, com estas fontes, se a diferença vem da reconstrução, da regulagem do guidão, da versão/ano ou de uma combinação desses fatores. Forçar a malha a 164 × 68 × 115 cm esconderia essa incerteza. Essas dimensões do manual estão registradas como **não aplicadas**.

Também foram descartados anúncios que confundiam dimensões de embalagem com o veículo, dados de outros modelos e dimensões de baterias de reposição sem comprovação de carcaça original.

## Coleta mínima para a próxima revisão

Pedir ao proprietário medidas e fotos **do mesmo exemplar**, sem desmontar componentes. Registrar em milímetros e identificar modelo/ano ou etiqueta de versão, sem publicar número completo de chassi.

| Prioridade | Medida ou foto | O que resolve |
| --- | --- | --- |
| 1 | Foto legível das inscrições do pneu, código e medida; diâmetro externo da roda montada | Confirma a correspondência com o Kenda 98-406 e a escala de referência. |
| 1 | Distância entre os centros dos eixos das rodas | Define entre-eixos e comprimento do quadro. |
| 1 | Comprimento total com roda dianteira reta; altura do chão ao ponto mais alto do guidão; largura entre as pontas das manoplas | Resolve a divergência com o manual. Registrar a regulagem do guidão. |
| 2 | Altura do chão ao topo do banco principal; comprimento/largura dos dois bancos | Ajusta ergonomia visual e suporte traseiro. |
| 2 | Comprimento, largura e profundidade externa da carcaça da bateria | Substitui a inferência pelas fotos. Não abrir a bateria. |
| 2 | Foto lateral de cada lado, câmera perpendicular e centrada, bike inteira e uma régua no mesmo plano | Permite conferir proporções com menos distorção de perspectiva. |
| 3 | Fotos próximas do aro, rotor, garfo, ancoragens da mola e junções do quadro | Refina espessuras e ferragens sem inventar componentes ocultos. |

Se o fornecedor disponibilizar desenho cotado ou CAD/GLB oficial com licença de uso, ele deve prevalecer sobre estas aproximações. Não foi feito contato externo com a loja ou fabricante nesta tarefa.

## Revisão pela dupla

O responsável seguinte deve conferir as fontes e a correspondência do exemplar antes de aprovar dimensões do quadro. A aprovação da dupla e do proprietário continua pendente; os testes técnicos não substituem essa aprovação.
