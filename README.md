# ryuki

Assistente de pesquisa no terminal. Você pergunta, ele busca na web via [Firecrawl](https://www.firecrawl.dev) e mostra os resultados formatados, com título, URL e um trecho relevante de cada página.

## Uso rápido (sem instalar nada)

```bash
npx github:EdersonSouza02/ryuki
```

## Instalação permanente (depois de publicado no npm)

```bash
npm install -g ryuki
ryuki
```

> Se `npm install -g` der erro de permissão, prefira `npx ryuki` — não precisa instalar nada globalmente.

## Configuração

Na primeira execução, o `ryuki` pede sua chave da [Firecrawl](https://www.firecrawl.dev) (gratuita) e salva em `~/.config/ryuki/config.json`. Nas próximas vezes já usa a chave salva.

## Como funciona

1. Você digita uma pergunta no prompt `ryuki>`.
2. Ele busca na web via Firecrawl (`/v1/search`), extraindo o conteúdo das páginas em markdown.
3. Mostra os resultados numerados, com título, URL e um trecho limpo do conteúdo.
4. Digite `sair` para encerrar.

## Desenvolvimento local

```bash
git clone https://github.com/EdersonSouza02/ryuki.git
cd ryuki
npm install
node bin/ryuki.js
```

## Licença

MIT
