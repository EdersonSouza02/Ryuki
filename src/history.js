import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const HISTORY_DIR = join(homedir(), ".config", "ryuki");
const HISTORY_PATH = join(HISTORY_DIR, "history");
const MAX_ENTRIES = 200;

// readline mantém o array com a entrada mais recente no índice 0 —
// carregamos e salvamos nessa mesma ordem pra "seta pra cima" continuar
// funcionando entre sessões.
export function loadHistory() {
  if (!existsSync(HISTORY_PATH)) return [];
  try {
    return readFileSync(HISTORY_PATH, "utf8").split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

export function saveHistory(entries) {
  mkdirSync(HISTORY_DIR, { recursive: true });
  writeFileSync(HISTORY_PATH, entries.slice(0, MAX_ENTRIES).join("\n"));
}
