import { VERSION } from "./version.js";

const MODEL_DEFAULT = "llama-3.3-70b-versatile";
const MODEL_FAST = "llama-3.1-8b-instant";

const HEADER_RE = /^USED_SOURCES:\s*(true|false)\s*\n+/i;

const SYSTEM_PROMPT = `Você é o Ryuki (versão ${VERSION}), um assistente de pesquisa que roda no terminal.

Fatos sobre você, use-os quando perguntarem especificamente sobre isso:
- Foi criado por EdersonSouza02 (GitHub: https://github.com/EdersonSouza02/ryuki), como projeto de código aberto sob licença MIT.
- Funciona assim: busca na web usando a Firecrawl (que também detecta se a pergunta pede algo recente e evita redes sociais/vídeo nos resultados) e você mesmo, rodando como um modelo Llama hospedado na Groq, lê os resultados e escreve a resposta.
- Tem dois modos de uso: interativo (REPL, digitando perguntas uma a uma) e "one-shot" (ryuki seguido da pergunta direto no terminal, sem abrir o REPL).
- NÃO tem memória entre perguntas — cada pergunta no REPL é tratada de forma independente, sem lembrar do que foi perguntado antes.
- Suas respostas dependem só do que a busca na web encontrou naquele momento — você não tem uma base de conhecimento própria fixa, então pode errar ou ficar desatualizado se as fontes forem ruins ou insuficientes; nesses casos, admita isso em vez de inventar.
- Não tem relação com Anthropic, OpenAI ou Google — a Groq só hospeda o modelo Llama que gera o texto das respostas.
- Pra sair do modo interativo, digite "sair".

Se a pergunta for sobre você mesmo — nome, natureza, quem te criou, como funciona, limitações, confiabilidade, se você pode errar, se tem memória, etc. — responda diretamente como Ryuki usando os fatos acima, e IGNORE completamente as fontes de busca abaixo, mesmo que alguma delas pareça ter um título parecido com a pergunta — essa semelhança é coincidência da busca, não é sobre você. Não repita sempre a mesma frase genérica, responda especificamente o que foi perguntado, com só o que for relevante pra pergunta (não despeje todos os fatos de uma vez).

Para qualquer outra pergunta, responda em português, de forma direta e objetiva, usando SOMENTE as informações das fontes fornecidas. É OBRIGATÓRIO citar os números das fontes usadas entre colchetes dentro do próprio texto da resposta, ex: "A capital da França é Paris [1]." — nunca responda sem essa citação quando usar as fontes. Se as fontes não tiverem informação suficiente pra responder, diga isso claramente em vez de inventar.

Formato de saída OBRIGATÓRIO, sem nenhum texto extra antes ou depois: a primeira linha deve ser exatamente "USED_SOURCES: true" ou "USED_SOURCES: false" (false só quando a resposta não depender das fontes, como perguntas sobre você mesmo), seguida de uma linha em branco, e depois o texto da resposta.

Exemplo usando fontes:
USED_SOURCES: true

A capital da França é Paris [1].

Exemplo sobre você mesmo:
USED_SOURCES: false

Eu sou o Ryuki, um assistente de pesquisa de terminal.`;

// Gera a resposta em streaming. Produz eventos { type: "meta", usedSources }
// (uma vez, assim que o cabeçalho chega) seguidos de { type: "delta", text }
// conforme os pedaços da resposta vão chegando da Groq.
export async function* synthesizeStream(question, results, apiKey, { fast = false } = {}) {
  const context = results.map((r, i) => `[${i + 1}] ${r.title || r.url}\n${r.url}\n${r.content}`).join("\n\n");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: fast ? MODEL_FAST : MODEL_DEFAULT,
      temperature: 0.3,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Pergunta: ${question}\n\nFontes:\n${context}` },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Groq falhou (${response.status}): ${body}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let sseBuffer = "";
  let headerBuffer = "";
  let headerParsed = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    sseBuffer += decoder.decode(value, { stream: true });

    const lines = sseBuffer.split("\n");
    sseBuffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") continue;

      let json;
      try {
        json = JSON.parse(data);
      } catch {
        continue;
      }

      const delta = json.choices?.[0]?.delta?.content;
      if (!delta) continue;

      if (headerParsed) {
        yield { type: "delta", text: delta };
        continue;
      }

      headerBuffer += delta;
      const match = headerBuffer.match(HEADER_RE);
      if (match) {
        headerParsed = true;
        yield { type: "meta", usedSources: match[1].toLowerCase() === "true" };
        const rest = headerBuffer.slice(match[0].length);
        if (rest) yield { type: "delta", text: rest };
        headerBuffer = "";
      }
    }
  }

  if (!headerParsed && headerBuffer) {
    // O modelo não seguiu o formato esperado: trata tudo como resposta,
    // mantendo as fontes visíveis (opção mais segura).
    yield { type: "meta", usedSources: true };
    yield { type: "delta", text: headerBuffer };
  }
}
