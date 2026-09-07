# Hero 3D — preparação da publicação de 07/09/2026

Esta integração substitui a condição de prévia descrita em `previa-hero-3d.md`: a página `/` passa a destacar a V20 Brake Pro com o visualizador. O parâmetro `?hero3d=0` mantém uma alternativa somente com foto. Links com `?model=...` continuam escolhendo o produto solicitado; outros modelos nunca recebem a geometria da Brake Pro.

## Carregamento e proteção

- Foto real presente no HTML inicial e durante o carregamento; sem necessidade de login.
- Modelo carregado somente quando a área fica visível. Preferência explícita de economia de dados mantém a foto.
- Giro por arrasto, acesso por teclado, duplo clique para restaurar e rolagem livre. Sem giro automático nem barra de controles.
- Falhas de rede, descompressão ou WebGL e timeout de 45 segundos mantêm a foto. Movimento reduzido respeitado.
- Processamento pausado fora da tela/aba. Sem scripts 3D externos, novos serviços pagos ou credenciais.

## Compactação sem perda

`node scripts/prepare-hero-3d.mjs` cria `public/modelos-3d/v20-brake-pro-web.bin` a partir do GLB revisado. Download: **3.915.068 bytes**, contra **10.365.336 bytes** do GLB original (redução de 62%). Um teste verifica que a descompressão restaura cada byte do modelo original.

O navegador utiliza [DecompressionStream](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream) com gzip. Navegadores sem suporte usam o GLB original. O sufixo `.bin` evita depender de configuração especial de Content-Encoding na hospedagem. Não há redução de triângulos nem mudança nos materiais: consumo de GPU e memória ainda exige validação em aparelhos reais.

Ao regenerar o modelo, executar novamente a preparação, os testes e atualizar a versão dos URLs dos dois arquivos em `hero-asset.mjs`.

## Verificação reproduzível

```text
node scripts/prepare-hero-3d.mjs
node scripts/validate-bike-3d.mjs
node --test scripts/hero-asset.test.mjs scripts/3d/geometry.test.mjs scripts/3d/v20-measurements.test.mjs scripts/3d/reference-camera.test.mjs scripts/3d/attachments.test.mjs
pnpm typecheck
pnpm build
```

Também conferir em navegador a página sem parâmetros, arrasto, fallback, larguras mobile/tablet, o link da ficha e o modelo exibido. Repetir a abertura no domínio publicado após o deploy.

Validação local da seleção de publicação: typecheck e build passaram, com 20 páginas geradas; 20 testes passaram. A navegação sem parâmetros carregou o 3D compactado. Arrasto e restauração funcionaram; o enquadramento se ajusta para evitar cortes ao girar. Viewports de 390 e 768 px não apresentaram overflow horizontal. Um proxy local retornando 503 para o modelo confirmou a transição para foto e a remoção do iframe. Isso testa falha de download, não perda física de contexto WebGL.

## Limites preservados

O aviso “Estudo 3D · imagem ilustrativa” permanece. A bike é uma reconstrução visual; medidas reais, equivalência exata da versão e fidelidade de detalhes não estão certificadas. A compressão de download não equivale a testes em Safari/iPhone ou Android físico.

O envio deve incluir somente a integração, o modelo e suas ferramentas técnicas. Materiais comerciais e alterações paralelas em catálogo, cards e layout não fazem parte desta publicação.
