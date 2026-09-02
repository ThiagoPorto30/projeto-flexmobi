<#
.SYNOPSIS
Publica uma sessão concluída no GitHub.

.DESCRIPTION
Valida o projeto, cria um commit com um resumo legível e envia a branch atual
para o remoto. O Vercel inicia a publicação automaticamente quando o projeto
estiver conectado ao repositório no painel do Vercel.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$Resumo,

    [ValidateSet('feat', 'fix', 'docs', 'refactor', 'chore')]
    [string]$Tipo = 'chore',

    [switch]$PularValidacao
)

$ErrorActionPreference = 'Stop'
$gitSafeDirectory = (Get-Location).Path

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Argumentos)
    & git -c "safe.directory=$gitSafeDirectory" @Argumentos
    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao executar: git $($Argumentos -join ' ')"
    }
}

if (-not (Test-Path '.git')) {
    throw 'Este diretório ainda não é um repositório Git. Inicialize-o e configure o remoto do GitHub antes de publicar.'
}

if (-not $PularValidacao) {
    pnpm typecheck
    if ($LASTEXITCODE -ne 0) { throw 'A verificação de tipos falhou. A publicação foi cancelada.' }

    pnpm build
    if ($LASTEXITCODE -ne 0) { throw 'A build falhou. A publicação foi cancelada.' }
}

Invoke-Git add --all
$pendencias = & git -c "safe.directory=$gitSafeDirectory" diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host 'Não há alterações para publicar.'
    exit 0
}
if ($LASTEXITCODE -ne 1) { throw 'Não foi possível verificar as alterações preparadas.' }

$mensagem = "${Tipo}: $Resumo"
Invoke-Git commit -m $mensagem

$branch = (& git -c "safe.directory=$gitSafeDirectory" branch --show-current).Trim()
if ([string]::IsNullOrWhiteSpace($branch)) { throw 'Não foi possível identificar a branch atual.' }

$remoto = (& git -c "safe.directory=$gitSafeDirectory" remote).Trim()
if ([string]::IsNullOrWhiteSpace($remoto)) { throw 'Nenhum remoto foi configurado. Adicione o repositório do GitHub como origin antes de publicar.' }

Invoke-Git push --set-upstream origin $branch
Write-Host "Sessão publicada na branch $branch. O Vercel iniciará a publicação se a integração estiver ativa."
