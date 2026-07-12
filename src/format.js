const COLOR = process.stdout.isTTY;

function color(code, text) {
  return COLOR ? `\x1b[${code}m${text}\x1b[0m` : text;
}

export const bold = (text) => color("1", text);
export const cyan = (text) => color("36", text);
export const gray = (text) => color("90", text);

export function wrapText(text, width) {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > width && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);

  return lines.length > 0 ? lines : [""];
}

export function truncate(text, width) {
  return text.length > width ? `${text.slice(0, width - 1)}…` : text;
}
