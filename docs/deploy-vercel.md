# Publicação no GitHub e Vercel

## Como o fluxo funciona

1. Cada sessão concluída é publicada com um commit que explica a alteração.
2. O GitHub executa typecheck e build pela automação existente.
3. O Vercel, conectado ao mesmo repositório, cria uma prévia para branches e publica em produção quando a alteração chega à `main`.

O Vercel reconhece este projeto Next.js sem precisar de um arquivo de configuração adicional.

## Configuração única

1. Crie um repositório vazio no GitHub.
2. Neste diretório, inicialize o Git e conecte o repositório:

   ```powershell
   git init -b main
   git add --all
   git commit -m "chore: publicação inicial"
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```

3. No painel do Vercel, selecione **Add New > Project**, importe esse repositório e mantenha o preset **Next.js**.
4. Em **Settings > Git**, confirme `main` como a branch de produção. A partir daí, cada envio à `main` faz uma publicação de produção; outras branches recebem URLs de prévia.
5. Cadastre no Vercel as variáveis de ambiente que forem necessárias. Nunca envie arquivos `.env` nem chaves ao GitHub.

## Encerrar e publicar uma sessão

Depois de concluir uma alteração, execute no diretório do projeto:

```powershell
.\scripts\publicar-sessao.ps1 -Tipo feat -Resumo "adiciona filtros ao catálogo"
```

Tipos aceitos: `feat`, `fix`, `docs`, `refactor` e `chore`. O resumo se torna a explicação oficial da mudança no histórico do GitHub.

O script executa `pnpm typecheck` e `pnpm build`, só cria o commit se ambos passarem e então faz o envio ao GitHub. Para uma mudança já validada, `-PularValidacao` evita repetir essas verificações.

## Limite importante

Não existe um gatilho confiável e seguro para detectar o instante em que uma conversa do Codex é encerrada e fazer um envio sem revisão. Por isso, o comando exige um resumo explícito. Ao pedir aqui “encerrar e publicar”, eu posso executar esse mesmo fluxo com você e confirmar o resultado.
