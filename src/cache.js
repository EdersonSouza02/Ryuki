import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";

const CACHE_DIR = join(homedir(), ".config", "ryuki", "cache");
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

function ensureDir() {
  mkdirSync(CACHE_DIR, { recursive: true, mode: 0o700 });
}

function hashQuery(query) {
  return createHash("md5").update(query).digest("hex");
}

export function getCachedResults(query) {
  ensureDir();

  const hash = hashQuery(query);
  const filepath = join(CACHE_DIR, `${hash}.json`);

  if (!existsSync(filepath)) return null;

  try {
    const data = JSON.parse(readFileSync(filepath, "utf8"));
    const age = Date.now() - data.timestamp;

    if (age > CACHE_DURATION) {
      return null; // cache expirado
    }

    return data.results;
  } catch {
    return null;
  }
}

export function cacheResults(query, results) {
  ensureDir();

  const hash = hashQuery(query);
  const filepath = join(CACHE_DIR, `${hash}.json`);

  try {
    const data = {
      query,
      timestamp: Date.now(),
      results,
    };
    writeFileSync(filepath, JSON.stringify(data));
  } catch (err) {
    console.error(`Erro ao salvar cache: ${err.message}`);
  }
}

export function clearCache() {
  ensureDir();
  const files = require("node:fs").readdirSync(CACHE_DIR);
  for (const file of files) {
    if (file.endsWith(".json")) {
      require("node:fs").rmSync(join(CACHE_DIR, file));
    }
  }
}
