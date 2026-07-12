import { createInterface } from "node:readline/promises";
import { loadConfig } from "./config.js";
import { search } from "./firecrawl.js";
import { synthesize } from "./groq.js";
import { bold, gray, wrapText, truncate } from "./format.js";
import { banner } from "./banner.js";

const EXIT_COMMANDS = new Set(["sair", "exit", "quit"]);

function boxWidth() {
  const cols = process.stdout.columns || 80;
  return Math.min(Math.max(cols - 4, 40), 96);
}

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

export function printAnswer(text) {
  const width = boxWidth();
  console.log(bold("✨ Resposta"));
  console.log("");
  text.split("\n").forEach((paragraph) => {
    if (paragraph.trim() === "") {
      console.log("");
      return;
    }
    wrapText(paragraph, width).forEach((line) => console.log(line));
  });
  console.log("");
}

export async function getAnswer(question, results, groqKey) {
  try {
    return await synthesize(question, results, groqKey);
  } catch (err) {
    console.error(gray(`(resposta de IA indisponível: ${err.message})\n`));
    return null;
  }
}

export async function runRepl() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const lines = rl[Symbol.asyncIterator]();

  const { firecrawlKey, groqKey } = await loadConfig(lines);

  console.log(banner());
  console.log("Digite sua pergunta (ou 'sair' para encerrar).\n");

  while (true) {
    process.stdout.write("ryuki> ");
    const { value, done } = await lines.next();
    if (done) break; // stdin fechou (ex: Ctrl+D ou entrada não interativa)

    const question = value.trim();
    if (!question) continue;
    if (EXIT_COMMANDS.has(question.toLowerCase())) break;

    try {
      console.log("\nBuscando...\n");
      const results = await search(question, firecrawlKey);

      if (results.length === 0) {
        console.log("Nenhum resultado encontrado.\n");
        continue;
      }

      const answer = await getAnswer(question, results, groqKey);
      if (answer) printAnswer(answer);

      printResults(results);
    } catch (err) {
      console.error(`Erro: ${err.message}\n`);
    }
  }

  rl.close();
  console.log("Até mais!");
}
