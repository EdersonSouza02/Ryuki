// Re-exporta funções de colorização que usam o tema ativo
// Se colorProvider não estiver inicializado, usa cores padrão
import { colorize as themeColors, bold as themeBold, cyan as themeCyan, gray as themeGray } from "./colorProvider.js";

const COLOR = process.stdout.isTTY;

function color(code, text) {
  return COLOR ? `\x1b[${code}m${text}\x1b[0m` : text;
}

export const bold = themeBold;
export const cyan = themeCyan;
export const gray = themeGray;

export function visibleLength(text) {
  return text.replace(/\x1b\[[0-9;]*m/g, "").length;
}

export function boxWidth() {
  const cols = process.stdout.columns || 80;
  return Math.min(Math.max(cols - 4, 40), 96);
}

export function truncate(text, width) {
  return text.length > width ? `${text.slice(0, width - 1)}…` : text;
}

// Imprime texto em stdout conforme ele chega em pedaços (streaming),
// quebrando linha por palavra ao atingir a largura, sem esperar o texto
// inteiro estar pronto.
export function createStreamWriter(width) {
  let column = 0;
  let buffer = "";

  function writeWord(word) {
    if (!word) return;
    if (column > 0 && column + word.length > width) {
      process.stdout.write("\n");
      column = 0;
    }
    process.stdout.write(word);
    column += word.length;
  }

  function writeWhitespace(ws) {
    if (ws.includes("\n")) {
      process.stdout.write("\n".repeat((ws.match(/\n/g) || []).length));
      column = 0;
    } else {
      process.stdout.write(" ");
      column += 1;
    }
  }

  return {
    write(delta) {
      buffer += delta;
      let match;
      while ((match = buffer.match(/^(\S+)(\s+)/))) {
        writeWord(match[1]);
        writeWhitespace(match[2]);
        buffer = buffer.slice(match[0].length);
      }
    },
    end() {
      if (buffer) {
        writeWord(buffer);
        buffer = "";
      }
      process.stdout.write("\n");
    },
  };
}
