import { emitKeypressEvents } from "node:readline";
import { COMMANDS } from "./replCommands.js";
import { bold, cyan, gray } from "./format.js";

const PROMPT = "ryuki> ";

function matchingCommands(input) {
  if (!input.startsWith("/")) return [];
  return COMMANDS.filter((c) => c.name.startsWith(input));
}

function render(input, matches, selected) {
  process.stdout.write(`\r\x1b[0J${PROMPT}${input}`);

  if (matches.length > 0) {
    const menu = matches
      .map((c, i) => {
        const active = i === selected;
        const marker = active ? cyan("❯ ") : "  ";
        const name = active ? bold(cyan(c.name)) : c.name;
        return `${marker}${name}  ${gray(c.description)}`;
      })
      .join("\n");
    process.stdout.write(`\n${menu}`);
    process.stdout.write(`\x1b[${matches.length}A`);
    process.stdout.write(`\r\x1b[${(PROMPT + input).length}C`);
  }
}

// Lê uma linha via teclas cruas (versão enxuta: digitar, apagar, e navegar
// com seta — sem cursor no meio da linha nem atalhos tipo Ctrl+A/E/W).
// Setas navegam o menu de comandos quando a linha começa com "/", ou o
// histórico de perguntas quando não começa. Retorna a linha digitada, o
// comando escolhido no menu, ou null se a pessoa apertou Ctrl+C.
export function readInteractiveLine(history) {
  return new Promise((resolve) => {
    let input = "";
    let selected = 0;
    let historyIndex = -1;
    let draft = "";

    function onKeypress(str, key) {
      if (key.ctrl && key.name === "c") {
        cleanup();
        process.stdout.write("\x1b[0J\n");
        resolve(null);
        return;
      }

      const matches = matchingCommands(input);
      const inMenu = matches.length > 0;

      if (key.name === "return") {
        const chosen = inMenu ? matches[selected].name : input;
        process.stdout.write("\x1b[0J\n");
        cleanup();
        resolve(chosen);
        return;
      }

      if (key.name === "escape") {
        input = "";
        selected = 0;
        historyIndex = -1;
        render(input, matchingCommands(input), selected);
        return;
      }

      if (key.name === "up") {
        if (inMenu) {
          selected = (selected - 1 + matches.length) % matches.length;
        } else if (history.length > 0) {
          if (historyIndex === -1) draft = input;
          historyIndex = Math.min(historyIndex + 1, history.length - 1);
          input = history[historyIndex];
          selected = 0;
        }
        render(input, matchingCommands(input), selected);
        return;
      }

      if (key.name === "down") {
        if (inMenu) {
          selected = (selected + 1) % matches.length;
        } else if (historyIndex > -1) {
          historyIndex -= 1;
          input = historyIndex === -1 ? draft : history[historyIndex];
          selected = 0;
        }
        render(input, matchingCommands(input), selected);
        return;
      }

      if (key.name === "backspace") {
        input = input.slice(0, -1);
        selected = 0;
        historyIndex = -1;
        render(input, matchingCommands(input), selected);
        return;
      }

      if (str && !key.ctrl && !key.meta) {
        input += str;
        selected = 0;
        historyIndex = -1;
        render(input, matchingCommands(input), selected);
      }
    }

    function cleanup() {
      process.stdin.off("keypress", onKeypress);
    }

    process.stdin.on("keypress", onKeypress);
    render(input, matchingCommands(input), selected);
  });
}

export function enableRawMode() {
  emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.resume();
}

export function disableRawMode() {
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  process.stdin.pause();
}
