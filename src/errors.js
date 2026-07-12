import { bold, gray } from "./format.js";

export function formatError(error) {
  const message = error.message || String(error);

  // Erros de rede
  if (message.includes("ECONNREFUSED")) {
    return {
      title: "Erro de conexão",
      message: "Não consegui conectar. Verifique sua internet.",
      suggestion: "Tente novamente em alguns segundos.",
    };
  }

  if (message.includes("ETIMEDOUT")) {
    return {
      title: "Timeout",
      message: "A requisição demorou muito tempo.",
      suggestion: "Tente uma pergunta mais simples ou tente novamente.",
    };
  }

  if (message.includes("ENOTFOUND")) {
    return {
      title: "Host não encontrado",
      message: "Não consegui encontrar o servidor.",
      suggestion: "Verifique sua conexão de internet.",
    };
  }

  // Erros de API
  if (message.includes("401") || message.includes("unauthorized")) {
    return {
      title: "Chave inválida",
      message: "Sua chave de API parece ser inválida.",
      suggestion: "Use /config para atualizar sua chave.",
    };
  }

  if (message.includes("429") || message.includes("quota") || message.includes("rate_limit_exceeded")) {
    // Tenta extrair informações detalhadas do erro de rate limit
    const limitMatch = message.match(/Limit (\d+)/);
    const usedMatch = message.match(/Used (\d+)/);
    const timeMatch = message.match(/Please try again in ([^.]+)\./);

    if (limitMatch && usedMatch && timeMatch) {
      const limit = parseInt(limitMatch[1]);
      const used = parseInt(usedMatch[1]);
      const timeRemaining = timeMatch[1];

      return {
        title: "Limite de tokens da Groq atingido",
        message: `Você usou ${used.toLocaleString("pt-BR")} de ${limit.toLocaleString("pt-BR")} tokens hoje.`,
        suggestion: `Aguarde ${timeRemaining} para o limite resetar. Ou faça upgrade pra Dev Tier: https://console.groq.com/settings/billing`,
      };
    }

    return {
      title: "Limite de requisições",
      message: "Você atingiu o limite de uso da API.",
      suggestion: "Tente novamente em alguns minutos, ou faça upgrade na Groq.",
    };
  }

  if (message.includes("500") || message.includes("502") || message.includes("503")) {
    return {
      title: "Erro do servidor",
      message: "O servidor está com problemas.",
      suggestion: "Tente novamente em alguns momentos.",
    };
  }

  if (message.includes("no results") || message.includes("nenhum resultado")) {
    return {
      title: "Sem resultados",
      message: "Nenhuma informação foi encontrada.",
      suggestion: "Tente reformular sua pergunta.",
    };
  }

  // Erro genérico
  return {
    title: "Erro",
    message: message,
    suggestion: "Tente novamente.",
  };
}

export function printError(error) {
  const { title, message, suggestion } = formatError(error);

  console.log("");
  console.log(bold(`❌ ${title}`));
  console.log(gray(message));
  if (suggestion) {
    console.log(gray(`💡 ${suggestion}`));
  }
  console.log("");
}
