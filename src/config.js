import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_DIR = join(homedir(), ".config", "ryuki");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

function readConfigFile() {
  if (!existsSync(CONFIG_PATH)) return {};
  // Corrige a permissão mesmo em instalações antigas, onde o arquivo/pasta
  // podem ter sido criados antes dessa restrição existir.
  chmodSync(CONFIG_DIR, 0o700);
  chmodSync(CONFIG_PATH, 0o600);
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveConfigFile(config) {
  // 0700/0600: só o dono da conta consegue ler as chaves salvas aqui,
  // mesmo em máquinas com outros usuários locais.
  mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  chmodSync(CONFIG_DIR, 0o700);
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), { mode: 0o600 });
  chmodSync(CONFIG_PATH, 0o600);
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
  const config = { ...fileConfig };
  let changed = false;

  let firecrawlKey = process.env.FIRECRAWL_API_KEY || fileConfig.firecrawlApiKey;
  if (!firecrawlKey) {
    firecrawlKey = await promptForKey(lines, "Chave da Firecrawl", "https://www.firecrawl.dev");
    config.firecrawlApiKey = firecrawlKey;
    changed = true;
  }

  let groqKey = process.env.GROQ_API_KEY || fileConfig.groqApiKey;
  if (!groqKey) {
    groqKey = await promptForKey(lines, "Chave da Groq (resposta gerada por IA)", "https://console.groq.com/keys");
    config.groqApiKey = groqKey;
    changed = true;
  }

  if (changed) {
    saveConfigFile(config);
    console.log(`\nChave(s) salva(s) em ${CONFIG_PATH}\n`);
  }

  return { firecrawlKey, groqKey };
}

function maskKey(key) {
  if (!key) return null;
  return key.length <= 4 ? "••••" : `${"•".repeat(Math.min(key.length - 4, 12))}${key.slice(-4)}`;
}

export function configStatus() {
  const fileConfig = readConfigFile();
  const firecrawlKey = process.env.FIRECRAWL_API_KEY || fileConfig.firecrawlApiKey || null;
  const groqKey = process.env.GROQ_API_KEY || fileConfig.groqApiKey || null;

  return {
    path: CONFIG_PATH,
    firecrawl: firecrawlKey ? { configured: true, masked: maskKey(firecrawlKey) } : { configured: false },
    groq: groqKey ? { configured: true, masked: maskKey(groqKey) } : { configured: false },
  };
}

export function resetConfig() {
  if (existsSync(CONFIG_PATH)) rmSync(CONFIG_PATH);
}
