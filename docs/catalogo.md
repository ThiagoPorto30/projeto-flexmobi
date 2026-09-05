# Catálogo de bicicletas

`src/app/data/catalog.ts` é a fonte canônica dos modelos. Valores usados em lógica são numéricos: `priceCents`, `originalPriceCents`, `rangeKm` e `specs`. Os campos `price`, `range`, `motor`, `battery`, `support` e `available` são derivados para manter as telas atuais compatíveis.

## Adicionar um modelo

1. Adicione um `createBike(...)` em `bikes`, com `slug` único, preço em centavos, autonomia em quilômetros, `status` e pelo menos um `uses` válido.
2. Para publicar no catálogo, use `status: "available"` ou `"coming_soon"`. Use `"hidden"` para manter o registro fora das listagens públicas.
3. Se o modelo deve aparecer como destaque, dê a ele `featuredOrder` único. Os quatro primeiros são exibidos por `getFeaturedBikes()`.
4. Crie a entrada correspondente em `src/app/data/product-details.ts`, usando o mesmo slug e uma galeria não vazia.
5. Confirme a capa e cada caminho em `gallery` dentro de `public/imagens/`. Execute `pnpm build` e depois `pnpm typecheck`: a geração das fichas verifica a existência das imagens e impede publicar um catálogo incompleto.

## Navegação e filtros

A home apresenta até quatro destaques. `/modelos` concentra o catálogo completo e exibe inicialmente até 12 bikes, com botão para mostrar mais quando necessário. As fichas mantêm as URLs existentes em `/modelos/[slug]`.

Os filtros são preservados na URL: `uso`, `preco` (teto em reais), `autonomia` (mínimo em km), `disponivel=sim`, `q` (busca) e `ordem` (`preco`, `preco-desc` ou `autonomia`). Exemplo: `/modelos?uso=passageiro&preco=10000`. A ordenação padrão usa os destaques editoriais. Voltar de uma ficha ou recarregar mantém os critérios. No celular, as seleções do painel só entram em vigor ao tocar em “Ver resultados”.

Ao trocar um slug já publicado, preserve o endereço anterior com um redirecionamento. O cadastro continua local e sua publicação depende de um novo build; a edição por painel e a comparação lado a lado ficam para uma próxima fase.

## Leitura dos dados

- `src/app/lib/catalog.ts` pode ser usado em componentes cliente: `getAllBikes`, `getBikeBySlug`, `getFeaturedBikes` e `getRelatedBikes`.
- `src/app/lib/catalog-server.ts` é exclusivo do servidor e expõe `getBikeDetails`. Ele evita incluir galerias e conteúdo editorial no pacote de catálogo do cliente.
- A validação executa ao carregar `catalog.ts` (slugs, números, usos e status) e ao carregar `product-details.ts` (detalhes e galeria de cada modelo). No servidor, `validateCatalogImages()` também verifica os arquivos em `public/imagens/`.
