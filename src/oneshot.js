import { createInterface } from "node:readline/promises";
import { loadConfig } from "./config.js";
import { search } from "./firecrawl.js";
import { printResults, answerAndPrint } from "./repl.js";
import { withSpinner } from "./spinner.js";

export async function runOnce(question, { fast = false } = {}) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const lines = rl[Symbol.asyncIterator]();

  const { firecrawlKey, groqKey } = await loadConfig(lines);
  rl.close();

  const results = await withSpinner("Buscando...", () => search(question, firecrawlKey));

  if (results.length === 0) {
    console.log("Nenhum resultado encontrado.");
    return;
  }

  const usedSources = await answerAndPrint(question, results, groqKey, { fast });
  if (usedSources) printResults(results);
}
