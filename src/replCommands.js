import { runConfigCommand } from "./configCommand.js";
import { VERSION } from "./version.js";
import { bold, gray } from "./format.js";

// Fonte única pros comandos: alimenta tanto o /help quanto o autocomplete
// (Tab) do REPL, pra não ter duas listas que podem ficar desalinhadas.
export const COMMANDS = [
  { name: "/config", description: "mostra quais chaves estão configuradas" },
  { name: "/config reset", description: "apaga as chaves salvas" },
  { name: "/kunai", description: "modelo rápido e mais direto" },
  { name: "/gear", description: "modelo padrão, respostas mais completas" },
  { name: "/version", description: "mostra a versão instalada" },
  { name: "/help", description: "mostra essa lista" },
];

function printHelp() {
  console.log(bold("Comandos disponíveis"));
  console.log("");
  const widest = Math.max(...COMMANDS.map((c) => c.name.length));
  COMMANDS.forEach(({ name, description }) => console.log(`  ${name.padEnd(widest + 3)}${description}`));
  console.log("");
  console.log(gray("Digite 'sair' pra encerrar."));
}

// Autocomplete via Tab: só sugere quando a linha já começa com "/", pra
// não interferir em perguntas normais de busca.
export function completer(line) {
  if (!line.startsWith("/")) return [[], line];
  const hits = COMMANDS.map((c) => c.name).filter((name) => name.startsWith(line));
  return [hits, line];
}

// Trata a linha como comando se começar com "/" (retorna true — nada mais
// ambíguo com busca literal). "state" é mutado em memória (ex: state.fast)
// pra comandos poderem afetar a sessão sem precisar reiniciar o REPL.
export function handleCommand(question, state) {
  if (!question.startsWith("/")) return false;

  const [cmd, ...args] = question.split(" ");

  switch (cmd.toLowerCase()) {
    case "/config":
      runConfigCommand(args.map((a) => a.toLowerCase()));
      break;
    case "/kunai":
      state.fast = true;
      console.log(gray("Modo kunai ativado: respostas mais rápidas e diretas pro resto da sessão."));
      break;
    case "/gear":
      state.fast = false;
      console.log(gray("Modo gear ativado: respostas mais completas pro resto da sessão."));
      break;
    case "/version":
      console.log(VERSION);
      break;
    case "/help":
      printHelp();
      break;
    default:
      console.log(gray(`Comando desconhecido: ${cmd}. Digite /help pra ver os comandos disponíveis.`));
  }

  return true;
}
