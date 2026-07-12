import { runConfigCommand } from "./configCommand.js";
import { VERSION } from "./version.js";
import { bold, gray } from "./format.js";
import { selectModel } from "./interactiveInput.js";
import { searchHistory } from "./conversation.js";
import { clearCache } from "./cache.js";
import { setSetting, printConfig } from "./sessionConfig.js";
import { exportMarkdown, exportJSON } from "./exporter.js";

// Fonte única pros comandos: alimenta tanto o /help quanto o autocomplete
// (Tab) do REPL, pra não ter duas listas que podem ficar desalinhadas.
export const COMMANDS = [
  { name: "/config", description: "mostra quais chaves estão configuradas" },
  { name: "/config reset", description: "apaga as chaves salvas" },
  { name: "/model", description: "escolhe entre kunai ou gear" },
  { name: "/search", description: "busca no histórico de conversas" },
  { name: "/continue", description: "continua a resposta anterior" },
  { name: "/set", description: "configura temperatura, tokens, idioma, detail" },
  { name: "/export", description: "exporta última resposta (markdown ou json)" },
  { name: "/clear-cache", description: "limpa o cache de buscas" },
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
export async function handleCommand(question, state) {
  if (!question.startsWith("/")) return false;

  const [cmd, ...args] = question.split(" ");

  switch (cmd.toLowerCase()) {
    case "/config":
      runConfigCommand(args.map((a) => a.toLowerCase()));
      break;
    case "/model": {
      const chosen = await selectModel();
      if (chosen) {
        if (chosen === "kunai") {
          state.fast = true;
          console.log(gray("Modo kunai ativado: respostas mais rápidas e diretas pro resto da sessão."));
        } else if (chosen === "gear") {
          state.fast = false;
          console.log(gray("Modo gear ativado: respostas mais completas pro resto da sessão."));
        }
      }
      break;
    }
    case "/search": {
      const query = args.join(" ");
      if (!query) {
        console.log(gray("Uso: /search termo"));
        break;
      }
      const results = searchHistory(query);
      if (results.length === 0) {
        console.log("Nenhuma conversa encontrada com esse termo.");
      } else {
        console.log(bold(`Encontrados ${results.length} resultados:`));
        console.log("");
        results.forEach((entry, i) => {
          console.log(`${i + 1}. ${entry.timestamp.split("T")[0]} ${entry.timestamp.split("T")[1].split(".")[0]}`);
          console.log(gray(`   P: ${entry.question.slice(0, 60)}...`));
          console.log(gray(`   R: ${entry.response.slice(0, 60)}...`));
        });
      }
      break;
    }
    case "/continue":
      console.log(gray("Use /continue e pressione Enter para solicitar continuação da última resposta."));
      state.continuePrevious = true;
      break;
    case "/set": {
      const setting = args.join("=");
      if (!setting) {
        printConfig(state.sessionConfig);
      } else {
        setSetting(state.sessionConfig, setting);
      }
      break;
    }
    case "/export": {
      const format = args[0]?.toLowerCase();
      if (!state.sessionConfig.lastResponse) {
        console.log(gray("Nenhuma resposta anterior pra exportar."));
        break;
      }
      try {
        let filepath;
        if (format === "json") {
          filepath = exportJSON(
            state.sessionConfig.lastQuestion,
            state.sessionConfig.lastResponse,
            state.lastResults || []
          );
        } else if (format === "markdown" || format === "md" || !format) {
          filepath = exportMarkdown(
            state.sessionConfig.lastQuestion,
            state.sessionConfig.lastResponse,
            state.lastResults || []
          );
        } else {
          console.log(gray("Formato desconhecido. Use: /export markdown ou /export json"));
          break;
        }
        console.log(gray(`Exportado para: ${filepath}`));
      } catch (err) {
        console.log(gray(`Erro ao exportar: ${err.message}`));
      }
      break;
    }
    case "/clear-cache":
      clearCache();
      console.log(gray("Cache de buscas limpo."));
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
