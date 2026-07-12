const COLOR = process.stdout.isTTY;

function color(code, text) {
  return COLOR ? `\x1b[${code}m${text}\x1b[0m` : text;
}

export const bold = (text) => color("1", text);
export const cyan = (text) => color("35", text); // magenta (solarized)
export const gray = (text) => color("90", text);

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

  return {
    write(chunk) {
      buffer += chunk;
      const words = buffer.split(" ");
      buffer = words.pop() || "";

      for (const word of words) {
        const len = visibleLength(word) + 1;
        if (column + len > width) {
          process.stdout.write("\n");
          column = 0;
        }
        process.stdout.write(word + " ");
        column += len;
      }
    },
    end() {
      if (buffer) process.stdout.write(buffer);
    },
  };
}
