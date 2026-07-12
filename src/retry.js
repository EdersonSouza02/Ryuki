import { gray } from "./format.js";

export async function retryWithBackoff(fn, options = {}) {
  const { maxRetries = 3, initialDelay = 1000, maxDelay = 10000 } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (attempt === maxRetries) {
        throw err;
      }

      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
      console.log(gray(`Tentativa ${attempt + 1} falhou. Tentando novamente em ${Math.round(delay / 1000)}s...`));

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export function isRetryableError(error) {
  const message = error.message.toLowerCase();

  // Erros de rede
  if (message.includes("econnrefused") || message.includes("etimedout") || message.includes("enotfound")) {
    return true;
  }

  // Erros HTTP 5xx
  if (error.statusCode && error.statusCode >= 500) {
    return true;
  }

  // Rate limiting
  if (message.includes("429") || message.includes("quota") || message.includes("rate limit")) {
    return true;
  }

  // Timeout
  if (message.includes("timeout")) {
    return true;
  }

  return false;
}
