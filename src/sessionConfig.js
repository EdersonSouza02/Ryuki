import { bold, gray } from "./format.js";

const DEFAULT_CONFIG = {
  temperature: 0.3,
  maxTokens: 1024,
  language: "pt",
  showSources: true,
};

export function createSessionConfig() {
  return { ...DEFAULT_CONFIG };
}

export function setSetting(config, setting, value) {
  const [key, val] = setting.split("=").map((s) => s.trim());

  if (!key || !val) {
    console.log(gray("Uso: /set chave=valor"));
    console.log(gray("Opções: temperature (0-1), maxTokens (1-2048), language (pt/en), showSources (true/false)"));
    return false;
  }

  const lowerKey = key.toLowerCase();

  switch (lowerKey) {
    case "temperature": {
      const num = parseFloat(val);
      if (isNaN(num) || num < 0 || num > 1) {
        console.log(gray("temperature deve estar entre 0 e 1"));
        return false;
      }
      config.temperature = num;
      console.log(gray(`temperatura ajustada para ${num}`));
      return true;
    }

    case "maxtokens": {
      const num = parseInt(val);
      if (isNaN(num) || num < 1 || num > 2048) {
        console.log(gray("maxTokens deve estar entre 1 e 2048"));
        return false;
      }
      config.maxTokens = num;
      console.log(gray(`máximo de tokens ajustado para ${num}`));
      return true;
    }

    case "language": {
      if (!["pt", "en", "es", "fr"].includes(val.toLowerCase())) {
        console.log(gray("idiomas suportados: pt, en, es, fr"));
        return false;
      }
      config.language = val.toLowerCase();
      console.log(gray(`idioma ajustado para ${val}`));
      return true;
    }

    case "showsources": {
      const bool = val.toLowerCase() === "true";
      config.showSources = bool;
      console.log(gray(`mostrar fontes: ${bool}`));
      return true;
    }

    default:
      console.log(gray(`configuração desconhecida: ${key}`));
      return false;
  }
}

export function printConfig(config) {
  console.log(bold("Configurações da sessão"));
  console.log("");
  console.log(`  temperature:  ${config.temperature}`);
  console.log(`  maxTokens:    ${config.maxTokens}`);
  console.log(`  language:     ${config.language}`);
  console.log(`  showSources:  ${config.showSources}`);
  console.log("");
  console.log(gray("Use /set chave=valor para alterar (ex: /set temperature=0.7)"));
}
