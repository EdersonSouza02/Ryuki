import { createInterface } from "node:readline/promises";
import { loadConfig } from "./config.js";
import { search } from "./firecrawl.js";
import { printResults, printAnswer, getAnswer } from "./repl.js";
import { withSpinner } from "./spinner.js";

export async function runOnce(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const lines = rl[Symbol.asyncIterator]();

  const { firecrawlKey, groqKey } = await loadConfig(lines);
  rl.close();

  const results = await withSpinner("Buscando...", () => search(question, firecrawlKey));

  if (results.length === 0) {
    console.log("Nenhum resultado encontrado.");
    return;
  }

  const answer = await withSpinner("Pensando...", () => getAnswer(question, results, groqKey));
  if (answer) printAnswer(answer.text);

  if (!answer || answer.usedSources) printResults(results);
}
