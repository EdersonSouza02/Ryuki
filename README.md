# ryuki

Assistente de pesquisa no terminal. Você pergunta, ele busca na web via [Firecrawl](https://www.firecrawl.dev) e mostra os resultados formatados, com título, URL e um trecho relevante de cada página.

## Uso rápido (sem instalar nada)

```bash
npx ryuki
```

## Instalação permanente

```bash
npm install -g ryuki
ryuki
```

> Se `npm install -g` der erro de permissão, prefira `npx ryuki` — não precisa instalar nada globalmente.

## Solução de problemas

### `EACCES: permission denied` ao rodar `npm install -g ryuki`

Isso acontece porque o npm tenta instalar pacotes globais numa pasta do sistema (`/usr/local/lib/node_modules`), que em muitas instalações Linux (principalmente via `apt`) pertence ao root. Não é um problema específico do `ryuki` — acontece com qualquer pacote global nessas instalações.

Duas formas de resolver:

1. **Usar `npx ryuki`** em vez de instalar — nunca esbarra nesse problema, porque o `npx` usa um cache próprio do seu usuário.
2. **Configurar o npm pra instalar pacotes globais numa pasta sua** (resolve de vez, sem precisar de `sudo`):
   ```bash
   mkdir -p ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   npm install -g ryuki
   ```
   Depois disso, `ryuki` funciona digitando só isso, sempre.

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
