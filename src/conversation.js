import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const HISTORY_DIR = join(homedir(), ".config", "ryuki", "conversations");

function ensureDir() {
  mkdirSync(HISTORY_DIR, { recursive: true, mode: 0o700 });
}

function getTimestamp() {
  return new Date().toISOString();
}

export function saveConversation(question, response, metadata = {}) {
  ensureDir();

  const timestamp = getTimestamp();
  const filename = `${timestamp.split("T")[0]}.jsonl`;
  const filepath = join(HISTORY_DIR, filename);

  const entry = {
    timestamp,
    question,
    response: response.slice(0, 500), // primeiros 500 chars
    fast: metadata.fast || false,
  };

  try {
    const content = existsSync(filepath)
      ? readFileSync(filepath, "utf8")
      : "";
    writeFileSync(filepath, content + JSON.stringify(entry) + "\n");
  } catch (err) {
    console.error(`Erro ao salvar conversa: ${err.message}`);
  }
}

export function searchHistory(query) {
  ensureDir();

  const results = [];
  const files = readdirSync(HISTORY_DIR);

  for (const file of files) {
    if (!file.endsWith(".jsonl")) continue;

    const filepath = join(HISTORY_DIR, file);
    const content = readFileSync(filepath, "utf8");
    const lines = content.trim().split("\n");

    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        if (
          entry.question.toLowerCase().includes(query.toLowerCase()) ||
          entry.response.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push(entry);
        }
      } catch {
        // linha inválida, pula
      }
    }
  }

  return results.slice(0, 10); // retorna os 10 mais recentes
}

export function getConversationPath() {
  return HISTORY_DIR;
}
