import { createInterface } from "node:readline/promises";
import { loadConfig } from "./config.js";
import { search } from "./firecrawl.js";
import { printResults, printAnswer, getAnswer } from "./repl.js";

export async function runOnce(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const lines = rl[Symbol.asyncIterator]();

  const { firecrawlKey, groqKey } = await loadConfig(lines);
  rl.close();

  const results = await search(question, firecrawlKey);

  if (results.length === 0) {
    console.log("Nenhum resultado encontrado.");
    return;
  }

  const answer = await getAnswer(question, results, groqKey);
  if (answer) printAnswer(answer);

  printResults(results);
}
