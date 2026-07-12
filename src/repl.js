import { createInterface } from "node:readline/promises";
import { loadConfig } from "./config.js";
import { search } from "./firecrawl.js";
import { bold, cyan, gray, snippet, wrapText, visibleLength, truncate } from "./format.js";
import { banner } from "./banner.js";

const EXIT_COMMANDS = new Set(["sair", "exit", "quit"]);

function boxWidth() {
  const cols = process.stdout.columns || 80;
  return Math.min(Math.max(cols - 4, 40), 96);
}

function boxLine(text, width) {
  const pad = Math.max(width - visibleLength(text), 0);
  return `${gray("│")} ${text}${" ".repeat(pad)} ${gray("│")}`;
}

export function printResults(results) {
  const width = boxWidth();
  const top = gray(`┌${"─".repeat(width + 2)}┐`);
  const bottom = gray(`└${"─".repeat(width + 2)}┘`);

  results.forEach((r, i) => {
    console.log(top);
    wrapText(`[${i + 1}] ${r.title || r.url}`, width).forEach((line) => console.log(boxLine(bold(line), width)));
    console.log(boxLine(cyan(truncate(r.url, width)), width));
    console.log(boxLine("", width));
    wrapText(snippet(r.content, 240), width).forEach((line) => console.log(boxLine(gray(line), width)));
    console.log(bottom);
    console.log("");
  });
}

export async function runRepl() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const lines = rl[Symbol.asyncIterator]();

  const { firecrawlKey } = await loadConfig(lines);

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

      printResults(results);
    } catch (err) {
      console.error(`Erro: ${err.message}\n`);
    }
  }

  rl.close();
  console.log("Até mais!");
}
