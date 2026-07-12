# ryuki

Assistente de pesquisa no terminal. Você pergunta, ele busca na web via [Firecrawl](https://www.firecrawl.dev), gera uma resposta resumida com IA ([Groq](https://console.groq.com)) a partir dos resultados, e mostra a fonte de cada informação.

## Uso rápido (sem instalar nada)

```bash
npx ryuki
```

## Modo one-shot

Pra uma pergunta rápida sem entrar no modo interativo:

```bash
ryuki "quais os maiores artilheiros da história da champions league"
```

## Linha de comando

```bash
ryuki                       # abre o modo interativo (REPL)
ryuki "sua pergunta"        # busca e responde direto, sem abrir o REPL
ryuki --fast "sua pergunta" # usa um modelo mais rápido (e mais direto) da Groq
ryuki config                # mostra quais chaves estão configuradas
ryuki config reset          # apaga as chaves salvas
ryuki --help                # ajuda
ryuki --version             # versão instalada
```

## Comandos no modo interativo

Dentro do REPL, qualquer linha que começa com `/` é tratada como comando (nunca é enviada como busca):

| Comando         | O que faz                                              |
| --------------- | -------------------------------------------------------|
| `/help`         | Lista os comandos disponíveis                          |
| `/config`       | Mostra quais chaves estão configuradas                 |
| `/config reset` | Apaga as chaves salvas                                 |
| `/kunai`        | Alterna pro modelo rápido, pro resto da sessão          |
| `/gear`         | Alterna pro modelo padrão (mais completo), pro resto da sessão |
| `/version`      | Mostra a versão instalada                               |

Num terminal de verdade, digitar `/` já abre um menu com os comandos na hora — navega com ↑/↓, filtra digitando mais letras (ex: `/ku` deixa só `/kunai`), Enter escolhe e Esc cancela. Perguntas de verdade — mesmo que comecem com uma palavra parecida (ex: "config do roteador") — continuam indo pra busca normal, sem conflito.

Fora do menu (ou seja, quando a linha não começa com `/`), ↑/↓ recupera perguntas antigas do histórico, que fica salvo entre sessões.

Digite `sair`, `exit` ou `quit` pra encerrar.

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

### A resposta de IA não aparece, só a lista de fontes

A Groq tem um limite de uso no plano gratuito (requisições por dia e tokens por minuto). Se você estourar o limite, o `ryuki` avisa (`resposta de IA indisponível: ...`) e continua funcionando normalmente, só sem a resposta sintetizada — a busca em si nunca para de funcionar por causa disso.

## Configuração

Na primeira execução, o `ryuki` pede duas chaves gratuitas e salva em `~/.config/ryuki/config.json` (arquivo com permissão restrita, `0600`, legível só pelo seu usuário):

- **[Firecrawl](https://www.firecrawl.dev)** — usada pra buscar na web.
- **[Groq](https://console.groq.com/keys)** — usada pra gerar a resposta resumida a partir dos resultados.

Nas próximas vezes já usa as chaves salvas. Também dá pra definir via variáveis de ambiente (`FIRECRAWL_API_KEY` e `GROQ_API_KEY`), que têm prioridade sobre o arquivo de configuração.

## Como funciona

1. Você digita uma pergunta no prompt `ryuki>` (ou passa direto como argumento, no modo one-shot).
2. Ele busca na web via Firecrawl (`/v1/search`) — detecta automaticamente se a pergunta pede algo recente (ex: "hoje", "essa semana") pra priorizar resultados atuais, e evita domínios de redes sociais/vídeo que costumam ter pouco conteúdo textual útil.
3. Os resultados são enviados pra Groq, que gera a resposta em português com citações `[1]`, `[2]`, etc. — o texto vai aparecendo em tempo real (streaming), sem esperar a resposta inteira ficar pronta.
4. Mostra a resposta da IA, seguida da lista de fontes (título + link) usadas pra montá-la. Se a pergunta for sobre o próprio Ryuki (nome, criador, limitações), ele responde direto e não mostra fontes de busca.
5. Digite `sair` para encerrar o modo interativo.

## Desenvolvimento local

```bash
git clone https://github.com/EdersonSouza02/ryuki.git
cd ryuki
npm install
node bin/ryuki.js
```

## Licença

MIT
