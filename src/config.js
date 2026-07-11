import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

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

async function promptForKey(lines, label, signupUrl) {
  console.log(`\n${label} não encontrada.`);
  console.log(`Crie uma gratuitamente em: ${signupUrl}`);
  process.stdout.write("Cole sua chave aqui: ");
  const { value, done } = await lines.next();
  return done ? "" : value.trim();
}

export async function loadConfig(lines) {
  const fileConfig = readConfigFile();

  let firecrawlKey = process.env.FIRECRAWL_API_KEY || fileConfig.firecrawlApiKey;

  if (firecrawlKey) {
    return { firecrawlKey };
  }

  firecrawlKey = await promptForKey(lines, "Chave da Firecrawl", "https://www.firecrawl.dev");

  saveConfigFile({ firecrawlApiKey: firecrawlKey });
  console.log(`\nChave salva em ${CONFIG_PATH}\n`);

  return { firecrawlKey };
}
