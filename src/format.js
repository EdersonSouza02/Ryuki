const COLOR = process.stdout.isTTY;

function color(code, text) {
  return COLOR ? `\x1b[${code}m${text}\x1b[0m` : text;
}

export const bold = (text) => color("1", text);
export const cyan = (text) => color("36", text);
export const gray = (text) => color("90", text);

export function cleanMarkdown(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // imagens
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> só o texto
    .replace(/^#{1,6}\s*/gm, "") // marcadores de heading
    .replace(/[*_`]{1,3}/g, "") // ênfase/código inline
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .replace(/\n{2,}/g, "\n");
}

export function snippet(text, maxLength = 400) {
  const cleaned = cleanMarkdown(text);

  // Prioriza linhas mais longas (parágrafos de conteúdo), descartando
  // ruído de navegação/menu/banner que tende a vir em linhas curtas.
  const lines = cleaned.split("\n");
  const substantial = lines.filter((line) => line.length >= 40).join(" ");
  const source = substantial.length >= 100 ? substantial : cleaned.replace(/\n/g, " ");

  if (source.length <= maxLength) return source;
  const cut = source.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace > 0 ? lastSpace : maxLength) + "...";
}
