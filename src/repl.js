import { createInterface } from "node:readline/promises";
import { loadConfig } from "./config.js";
import { search } from "./firecrawl.js";
import { synthesizeStream } from "./groq.js";
import { bold, gray, truncate, boxWidth, createStreamWriter } from "./format.js";
import { welcomeBox } from "./banner.js";
import { withSpinner, startSpinner } from "./spinner.js";
import { loadHistory, saveHistory } from "./history.js";
import { handleCommand, completer } from "./replCommands.js";
import { readInteractiveLine, enableRawMode, disableRawMode } from "./interactiveInput.js";
import { saveConversation } from "./conversation.js";
import { getCachedResults, cacheResults } from "./cache.js";
import { createSessionConfig } from "./sessionConfig.js";
import { retryWithBackoff } from "./retry.js";
import { highlightCode } from "./highlight.js";
import { formatTable } from "./tableFormatter.js";
import { printError } from "./errors.js";

function startTimer() {
  const startTime = Date.now();
  return () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    if (elapsed > 0) {
      process.stdout.write(gray(` ${elapsed}s`));
    }
  };
}

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
// Retorna { usedSources, response } — usedSources decide se mostra a lista depois,
// response é a texto completo da resposta pra salvar em sessionConfig.
export async function answerAndPrint(question, results, groqKey, { fast = false, detail = "full", lastQuestion = "", lastResponse = "" } = {}) {
  const width = boxWidth();
  let stopSpinner = startSpinner("Pensando...");
  let started = false;
  let printedHeader = false;
  let usedSources = true;
  let fullResponse = "";

  try {
    const writer = createStreamWriter(width);

    for await (const event of synthesizeStream(question, results, groqKey, { fast, detail, lastQuestion, lastResponse })) {
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
        fullResponse += event.text;
      }
    }

    if (printedHeader) {
      writer.end();
      console.log("");
    }
  } catch (err) {
    if (!started) stopSpinner();
    printError(err);
    return { usedSources: true, response: "" }; // sem resposta de IA, mantém fontes visíveis
  }

  return { usedSources, response: fullResponse };
}

// Pergunta seguinte: no modo interativo (TTY), usa o leitor customizado com
// menu de comandos e histórico por seta; fora disso (pipe/script), usa o
// readline padrão — sem menu (não faz sentido sem teclado de verdade), mas
// mantém o comportamento de sempre, sem risco de regressão em automação.
async function nextQuestion({ interactive, lines, history }) {
  if (interactive) {
    // readInteractiveLine já desenha o prompt "ryuki> " sozinho.
    const line = await readInteractiveLine(history);
    return line === null ? { done: true, value: "" } : { done: false, value: line };
  }

  process.stdout.write("ryuki> ");
  const { value, done } = await lines.next();
  return { done, value: value || "" };
}

export async function runRepl({ fast: initialFast = false } = {}) {
  const state = {
    fast: initialFast,
    sessionConfig: createSessionConfig(),
    continuePrevious: false,
    lastResponse: "",
    lastResults: [],
  };

  const interactive = process.stdin.isTTY;
  const history = interactive ? loadHistory() : [];
  const rl = createInterface({ input: process.stdin, output: process.stdout, history, historySize: 200, completer });
  const lines = rl[Symbol.asyncIterator]();

  const { firecrawlKey, groqKey } = await loadConfig(lines);

  console.log("");
  console.log(welcomeBox({ firecrawlOk: !!firecrawlKey, groqOk: !!groqKey, fast: state.fast, width: boxWidth() }));
  console.log("");

  // A configuração de chaves usa o readline padrão (é só texto simples).
  // A partir daqui, sessão interativa passa a usar o leitor com menu.
  if (interactive) {
    rl.close();
    enableRawMode();
  }

  while (true) {
    const { done, value } = await nextQuestion({ interactive, lines, history });
    if (done) break; // stdin fechou ou Ctrl+C

    const question = value.trim();
    if (!question) continue;
    if (EXIT_COMMANDS.has(question.toLowerCase())) break;

    if (interactive) {
      history.unshift(question);
      saveHistory(history);
    }

    console.log("");

    // Comandos começam com "/" — sem chance de confundir com busca literal.
    if (await handleCommand(question, state)) {
      console.log("");
      continue;
    }

    try {
      let results = getCachedResults(question);

      if (!results) {
        const getTimer = startTimer();
        const timerInterval = setInterval(getTimer, 1000);

        try {
          results = await withSpinner("Buscando...", () =>
            retryWithBackoff(() => search(question, firecrawlKey), { maxRetries: 2 })
          );
          cacheResults(question, results);
          clearInterval(timerInterval);
          console.log("");
        } finally {
          clearInterval(timerInterval);
        }
      } else {
        console.log(gray("(resultado em cache)"));
      }

      if (results.length === 0) {
        console.log("Nenhum resultado encontrado.\n");
        continue;
      }

      const { usedSources, response } = await answerAndPrint(question, results, groqKey, {
        fast: state.fast,
        detail: state.sessionConfig.detail,
        lastQuestion: state.sessionConfig.lastQuestion,
        lastResponse: state.sessionConfig.lastResponse,
      });

      state.sessionConfig.lastQuestion = question;
      state.sessionConfig.lastResponse = response;
      state.lastResults = results;

      saveConversation(question, "resposta salva", { fast: state.fast });

      if (usedSources) printResults(results);
    } catch (err) {
      printError(err);
    }
  }

  if (interactive) disableRawMode();
  else rl.close();

  console.log("Até mais!");
}
