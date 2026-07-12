import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const EXPORTS_DIR = join(homedir(), ".config", "ryuki", "exports");

function ensureDir() {
  mkdirSync(EXPORTS_DIR, { recursive: true, mode: 0o700 });
}

function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, "-").slice(0, -5); // 2026-07-12T15-43-38
}

export function exportMarkdown(question, response, results) {
  ensureDir();

  const timestamp = getTimestamp();
  const filename = `resposta-${timestamp}.md`;
  const filepath = join(EXPORTS_DIR, filename);

  const sources = results
    .map((r, i) => `[${i + 1}] ${r.title || r.url}\n    ${r.url}`)
    .join("\n\n");

  const content = `# ${question}

## Resposta

${response}

## Fontes

${sources}

---
*Exportado em ${new Date().toLocaleString("pt-BR")}*
`;

  writeFileSync(filepath, content);
  return filepath;
}

export function exportJSON(question, response, results) {
  ensureDir();

  const timestamp = getTimestamp();
  const filename = `resposta-${timestamp}.json`;
  const filepath = join(EXPORTS_DIR, filename);

  const data = {
    question,
    response,
    sources: results.map((r) => ({
      title: r.title || r.url,
      url: r.url,
      content: r.content,
    })),
    exportedAt: new Date().toISOString(),
  };

  writeFileSync(filepath, JSON.stringify(data, null, 2));
  return filepath;
}
