import { bold, cyan, gray } from "./format.js";
import { topBorder, bottomBorder, line, centerLine } from "./box.js";
import { VERSION } from "./version.js";

const FONT = {
  R: ["████ ", "█   █", "████ ", "█  █ ", "█   █"],
  Y: ["█   █", " █ █ ", "  █  ", "  █  ", "  █  "],
  U: ["█   █", "█   █", "█   █", "█   █", " ███ "],
  K: ["█   █", "█  █ ", "███  ", "█  █ ", "█   █"],
  I: ["█████", "  █  ", "  █  ", "  █  ", "█████"],
};

function renderWord(word) {
  const letters = word.split("").map((ch) => FONT[ch] || ["     ", "     ", "     ", "     ", "     "]);
  const rows = [];
  for (let row = 0; row < 5; row++) {
    rows.push(letters.map((letter) => letter[row]).join(" "));
  }
  return rows;
}

export function welcomeBox({ firecrawlOk, groqOk, fast, width }) {
  const rows = [topBorder(width), line("", width)];

  renderWord("RYUKI").forEach((r) => rows.push(centerLine(cyan(r), width)));
  rows.push(line("", width));
  rows.push(centerLine(bold("assistente de pesquisa no terminal"), width));
  rows.push(line("", width));

  const status = `v${VERSION} · firecrawl ${firecrawlOk ? "✓" : "✗"} · groq ${groqOk ? "✓" : "✗"}${fast ? " · modelo rápido" : ""}`;
  rows.push(line(gray(status), width));
  rows.push(line("", width));

  rows.push(line(bold("Dicas:"), width));
  rows.push(line('  • "notícias de hoje sobre IA"', width));
  rows.push(line("  • digite /help pra ver os comandos", width));
  rows.push(line("  • digite 'sair' pra encerrar", width));
  rows.push(line("", width));

  rows.push(bottomBorder(width));
  return rows.join("\n");
}
