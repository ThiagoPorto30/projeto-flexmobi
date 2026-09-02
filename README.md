# flexmobi.rj

Experiência pública da flexmobi.rj para apresentar bicicletas elétricas, catálogo de modelos, recomendação de produto e agendamento de test ride.

> Status: protótipo navegável. Os dados comerciais apresentados ainda devem ser validados antes de qualquer publicação oficial.

## Tecnologias

- Next.js 15
- React 19
- TypeScript
- pnpm

## Começar localmente

Pré-requisito: Node.js 20 ou superior e pnpm.

Execute `pnpm install` e `pnpm dev`. Abra http://localhost:3000.

Antes de enviar uma alteração, execute `pnpm typecheck` e `pnpm build`.

## Estrutura

- `app/`: aplicação Next.js e dados usados pela interface.
- `public/imagens/`: imagens usadas pelo site.
- `dados/`: fontes de catálogo e preços a validar.
- `docs/`: documentação de produto e decisões técnicas.
- `.github/`: padrões de colaboração e automações do GitHub.

## Escopo atual

- Catálogo navegável de bikes elétricas e filtros.
- Página editorial completa para cada um dos 11 modelos, com galeria, destaques, ficha técnica e modelos relacionados.
- Quiz de recomendação.
- Formulário demonstrativo de test ride.
- Páginas e seções para atendimento, lojas, serviços e área do cliente.

## Limites atuais e próximos passos

O formulário, autenticação, painel administrativo, e-mails e automações ainda não possuem integrações de produção. Antes de conectar serviços externos, valide preços, estoque, endereços, garantia, consentimento de dados e o responsável pela operação.

Consulte [a visão do produto](docs/visao-do-produto.md) e [a arquitetura inicial](docs/arquitetura.md) para o contexto atual.

## Segurança e colaboração

- Nunca inclua segredos, chaves de API ou arquivos `.env` no repositório.
- Use o arquivo `.env.example` como referência para variáveis de ambiente futuras.
- Leia [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir uma contribuição.
- Relate falhas seguindo [SECURITY.md](SECURITY.md).
- Para configurar publicação contínua pelo GitHub e Vercel, consulte [o guia de deploy](docs/deploy-vercel.md).

## Licença

Ainda não definida. Antes de tornar o repositório público, o responsável pelo projeto deve escolher e adicionar uma licença adequada.
