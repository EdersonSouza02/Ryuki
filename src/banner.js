import { bold, cyan } from "./format.js";

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
  return rows.join("\n");
}

export function banner() {
  const art = renderWord("RYUKI");
  return `${cyan(art)}\n${bold("assistente de pesquisa no terminal")}\n`;
}
