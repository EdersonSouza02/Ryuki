import { VERSION } from "./version.js";

export const HELP = `Ryuki v${VERSION} — assistente de pesquisa no terminal

Uso:
  ryuki                       Inicia o modo interativo (REPL)
  ryuki "sua pergunta"        Busca e responde direto, sem abrir o REPL
  ryuki config                Mostra quais chaves estão configuradas
  ryuki config reset          Apaga as chaves salvas

Opções:
  --fast          Usa um modelo mais rápido (e um pouco menos detalhado) da Groq
  -h, --help      Mostra esta ajuda
  -v, --version   Mostra a versão instalada

Exemplos:
  ryuki "notícias de hoje sobre IA"
  ryuki --fast "qual a capital do japão"

No modo interativo, digite /help pra ver os comandos disponíveis (/config,
/kunai, /gear, /version, /help).`;
