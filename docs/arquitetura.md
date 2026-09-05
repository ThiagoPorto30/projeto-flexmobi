# Arquitetura inicial

O projeto é uma aplicação web em Next.js com App Router e TypeScript. A interface e a lógica de apresentação vivem em `src/app/`; o catálogo usado no protótipo está em `src/app/data/catalog.ts`; e as imagens publicadas são servidas de `public/imagens/`.

## Estado atual

- Renderização e interações são locais, sem banco de dados ou autenticação.
- Dados em `materiais/dados-fonte/` são referências de origem e não constituem uma fonte comercial validada.
- O formulário é demonstrativo e não envia informações a um serviço externo.

## Direção para produção

Quando o escopo for validado, separar os ambientes de desenvolvimento, homologação e produção. Centralizar catálogo e disponibilidade em uma fonte administrativa auditável; processar solicitações no servidor; proteger segredos em variáveis de ambiente; registrar erros; e aplicar controle de acesso à área administrativa.

Decisões relevantes devem ser registradas em documentos de decisão arquitetural (`docs/adr/`) antes de alterações difíceis de reverter.
