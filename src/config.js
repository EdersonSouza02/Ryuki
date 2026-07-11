import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";

const CONFIG_DIR = join(homedir(), ".config", "ryuki");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

function readConfigFile() {
  if (!existsSync(CONFIG_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveConfigFile(config) {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

async function promptForKey(rl, label, signupUrl) {
  console.log(`\n${label} não encontrada.`);
  console.log(`Crie uma gratuitamente em: ${signupUrl}`);
  const value = await rl.question(`Cole sua chave aqui: `);
  return value.trim();
}

export async function loadConfig() {
  const fileConfig = readConfigFile();

  let firecrawlKey = process.env.FIRECRAWL_API_KEY || fileConfig.firecrawlApiKey;

  if (firecrawlKey) {
    return { firecrawlKey };
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    firecrawlKey = await promptForKey(rl, "Chave da Firecrawl", "https://www.firecrawl.dev");
  } finally {
    rl.close();
  }

  saveConfigFile({ firecrawlApiKey: firecrawlKey });
  console.log(`\nChave salva em ${CONFIG_PATH}\n`);

  return { firecrawlKey };
}
