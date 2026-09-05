# Preparação de lançamento

Implementado: metadados por página, Open Graph e Twitter com a foto do modelo, canônicas sem parâmetros de agendamento, sitemap automático, robots.txt, dados estruturados de lojas/produtos/breadcrumbs, FAQ, CTA móvel na home, rodapé compartilhado e página de privacidade.

## Configuração

Use `.env.example` como referência. Nenhum domínio, telefone, CNPJ ou prazo foi inventado. As variáveis públicas são incorporadas no build; refaça o build/deploy após qualquer mudança. `SITE_URL` exige a origem HTTPS oficial, sem caminhos nem parâmetros. Canônicas e JSON-LD só são emitidos quando o domínio está definido. Sem domínio, imagens sociais usam localhost apenas para desenvolvimento.

`SITE_INDEXABLE=true` libera indexação apenas com domínio configurado e build de produção. Em Vercel Preview/development e em `next dev` continua noindex. Em outras hospedagens mantenha a variável falsa nos ambientes de teste. O sitemap fica vazio no protótipo. `robots.txt` permite rastreamento inclusive no protótipo para que o buscador possa ler o noindex; noindex não é controle de acesso. Uma prévia privada deve usar proteção da hospedagem.

## Contato

Configure `NEXT_PUBLIC_WHATSAPP_NUMBER` com um número brasileiro oficial (55 + DDD + número). O formulário prepara o resumo e oferece um link para continuar no WhatsApp. Não registra pedidos nem confirma agendamento: o visitante ainda precisa enviar a mensagem no WhatsApp e receber confirmação da loja. Sem número, permanece demonstrativo e não abre WhatsApp. Dados pessoais não são adicionados à URL interna, armazenados em banco ou enviados automaticamente.

## Antes de ativar produção

- Confirmar domínio, razão social/CNPJ, número e prazo de atendimento; conferir endereços e links de Maps.
- Validar preços, disponibilidade e especificações de cada modelo. A marcação Product não publica ofertas, notas ou avaliações não verificadas; não promete elegibilidade a resultados enriquecidos sem os campos exigidos pelo Google.
- Completar a política de privacidade com responsável, canal, retenção e fornecedores reais antes da operação comercial. A página atual descreve o protótipo e o fluxo de WhatsApp preparado.
- Publicar em HTTPS; verificar redirecionamento HTTP → HTTPS e domínio preferido.
- Ativar a indexação no ambiente definitivo, reconstruir e verificar no HTML: index/follow, canônica correta, imagem social acessível e dados estruturados.
- Cadastrar o domínio no Search Console, enviar `/sitemap.xml` e inspecionar uma URL de produto. Verificar dados estruturados no Rich Results Test.
- Testar um atendimento real com a loja, sem tratar clique no WhatsApp como pedido recebido.
- Configurar Analytics e consentimento após definir conta e coleta. Atualmente não há Analytics nem cookies de marketing; não foi criado banner sem rastreadores.
- Adicionar avaliações autorizadas e fotos reais quando fornecidas. Não foram criados depoimentos fictícios.

## Verificações locais

Executar `pnpm build` e depois `pnpm typecheck`. Conferir home em 390px e desktop, FAQ, CTA, formulário (erros e revisão), produto, privacidade e 404. Conferir HTML sem JavaScript, sitemap/robots e metadados tanto em protótipo quanto com domínio de teste e indexação habilitada. Não cadastrar domínio fictício em ferramentas externas.

`node scripts/check-seo-config.cjs` verifica as combinações de indexação e a geração do link de contato sem fazer requisições externas (Node 22.18+ com suporte a TypeScript nativo).

## Imagens

`node scripts/optimize-images.cjs` gera variantes WebP de até 1600px e atualiza referências quando há redução de pelo menos 5%. Utiliza o Sharp da instalação do Next.js. Originais em `public/imagens` e materiais permanecem preservados. Nesta preparação, 76 de 81 imagens receberam variantes menores: o conjunto selecionado para runtime passou de aproximadamente 87 MB para 13,5 MB (84% de redução). Isso não representa o tamanho de uma visita individual nem uma medição de Core Web Vitals; `next/image` ainda seleciona tamanhos responsivos por tela.
