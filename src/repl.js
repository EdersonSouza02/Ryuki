import { createInterface } from "node:readline/promises";
import { loadConfig } from "./config.js";
import { search } from "./firecrawl.js";
import { synthesizeStream } from "./groq.js";
import { bold, gray, truncate, boxWidth, createStreamWriter } from "./format.js";
import { welcomeBox } from "./banner.js";
import { withSpinner, startSpinner } from "./spinner.js";

const EXIT_COMMANDS = new Set(["sair", "exit", "quit"]);

export function printResults(results) {
  const width = boxWidth();
  console.log(bold("Fontes"));
  console.log("");
  results.forEach((r, i) => {
    console.log(`${bold(`[${i + 1}]`)} ${truncate(r.title || r.url, width - 4)}`);
    console.log(gray(`    ${truncate(r.url, width - 4)}`));
  });
  console.log("");
}

// Consome a resposta em streaming, imprimindo os pedaços conforme chegam.
// Retorna se as fontes foram usadas (pra decidir se mostra a lista depois).
export async function answerAndPrint(question, results, groqKey) {
  const width = boxWidth();
  let stopSpinner = startSpinner("Pensando...");
  let started = false;
  let printedHeader = false;
  let usedSources = true;

  try {
    const writer = createStreamWriter(width);

    for await (const event of synthesizeStream(question, results, groqKey)) {
      if (!started) {
        stopSpinner();
        started = true;
      }
      if (!printedHeader) {
        console.log(bold("✨ Resposta"));
        console.log("");
        printedHeader = true;
      }

      if (event.type === "meta") {
        usedSources = event.usedSources;
      } else if (event.type === "delta") {
        writer.write(event.text);
      }
    }

    if (printedHeader) {
      writer.end();
      console.log("");
    }
  } catch (err) {
    if (!started) stopSpinner();
    console.error(gray(`(resposta de IA indisponível: ${err.message})\n`));
    return true; // sem resposta de IA, mantém fontes visíveis
  }

  return usedSources;
}

export async function runRepl() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const lines = rl[Symbol.asyncIterator]();

  const { firecrawlKey, groqKey } = await loadConfig(lines);

  console.log("");
  console.log(welcomeBox({ firecrawlOk: !!firecrawlKey, groqOk: !!groqKey, width: boxWidth() }));
  console.log("");

  while (true) {
    process.stdout.write("ryuki> ");
    const { value, done } = await lines.next();
    if (done) break; // stdin fechou (ex: Ctrl+D ou entrada não interativa)

    const question = value.trim();
    if (!question) continue;
    if (EXIT_COMMANDS.has(question.toLowerCase())) break;

    console.log("");

    try {
      const results = await withSpinner("Buscando...", () => search(question, firecrawlKey));

      if (results.length === 0) {
        console.log("Nenhum resultado encontrado.\n");
        continue;
      }

      const usedSources = await answerAndPrint(question, results, groqKey);
      if (usedSources) printResults(results);
    } catch (err) {
      console.error(`Erro: ${err.message}\n`);
    }
  }

  rl.close();
  console.log("Até mais!");
}
