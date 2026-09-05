# Estudo 3D da V20 Brake Pro

Arquivo: `public/modelos-3d/v20-brake-pro-estudo.glb`.
Prévia: `/modelos-3d/index.html` (servidor local ou site).
Regeneração: `node scripts/build-bike-3d.mjs`.

Reconstrução procedural guiada visualmente pelas fotos 026, 014 e 016 de `public/imagens`. Outras fotos de detalhes da mesma bike estão disponíveis nessa pasta. Não foram encontrados vídeos em `public` e `materiais` na busca por MP4, MOV, WEBM e AVI.

O arquivo contém geometria 3D real, materiais e peças nomeadas; não é uma foto aplicada a um plano. Pode ser importado em um editor compatível com GLB. O gerador usa Three.js, com licença incluída junto às dependências da prévia. Não usa serviços externos nem envia as fotos a terceiros.

## Limitações e próxima revisão

- Estudo aproximado, não réplica oficial nem reconstrução por fotogrametria.
- Escala, profundidades e superfícies ocultas foram estimadas.
- Banco, junções, paralamas, cabos e ferragens simplificados; não usar para afirmar medidas ou características comerciais.
- Materiais sem texturas fotográficas e sem logotipos; o acabamento ainda não é fotorrealista.
- GLB de aproximadamente 1,54 MiB, com 477 peças. Antes da capa, reduzir chamadas de desenho agrupando peças por material e testar em celular real.
- Prévia inclui rotação, zoom, vistas predefinidas, setas de teclado e download. Carregamento e rotação conferidos no navegador desktop.
- A capa atual não foi substituída. A integração final precisa de imagem alternativa e carregamento sob demanda.

Validar primeiro a silhueta com o proprietário; depois refinar a malha e os materiais, idealmente com dimensões reais e fotos frontal/traseira ortogonais do mesmo exemplar.
