import { configStatus, resetConfig } from "./config.js";
import { bold, gray } from "./format.js";

export function runConfigCommand(args) {
  if (args[0] === "reset") {
    resetConfig();
    console.log("Configuração removida. Na próxima execução, o Ryuki vai pedir as chaves de novo.");
    return;
  }

  const status = configStatus();

  console.log(bold("Configuração do Ryuki"));
  console.log("");
  console.log(gray(`Arquivo: ${status.path}`));
  console.log("");
  console.log(
    `Firecrawl: ${status.firecrawl.configured ? `configurada (${status.firecrawl.masked})` : "não configurada"}`,
  );
  console.log(`Groq:      ${status.groq.configured ? `configurada (${status.groq.masked})` : "não configurada"}`);
  console.log("");
  console.log(gray("Pra apagar as chaves salvas e configurar de novo: 'ryuki config reset' (ou '/config reset' no modo interativo)."));
}
