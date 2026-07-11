import { createInterface } from "node:readline/promises";
import { loadConfig } from "./config.js";
import { search } from "./firecrawl.js";
import { bold, cyan, gray, snippet } from "./format.js";

const EXIT_COMMANDS = new Set(["sair", "exit", "quit"]);

function printResults(results) {
  results.forEach((r, i) => {
    console.log(bold(`[${i + 1}] ${r.title || r.url}`));
    console.log(cyan(r.url));
    console.log(gray(snippet(r.content)));
    console.log("");
  });
}

export async function runRepl() {
  const { firecrawlKey } = await loadConfig();

  console.log("ryuki — assistente de pesquisa. Digite sua pergunta (ou 'sair' para encerrar).\n");

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  while (true) {
    let question;
    try {
      question = (await rl.question("ryuki> ")).trim();
    } catch {
      break; // stdin fechou (ex: Ctrl+D ou entrada não interativa)
    }

    if (!question) continue;
    if (EXIT_COMMANDS.has(question.toLowerCase())) break;

    try {
      console.log("\nBuscando...\n");
      const results = await search(question, firecrawlKey);

      if (results.length === 0) {
        console.log("Nenhum resultado encontrado.\n");
        continue;
      }

      printResults(results);
    } catch (err) {
      console.error(`Erro: ${err.message}\n`);
    }
  }

  rl.close();
  console.log("Até mais!");
}
