const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT =
  "Você é um assistente de pesquisa. Responda a pergunta do usuário em português, de forma direta e objetiva, usando SOMENTE as informações das fontes fornecidas. Cite os números das fontes relevantes entre colchetes, ex: [1]. Se as fontes não tiverem informação suficiente pra responder, diga isso claramente em vez de inventar.";

export async function synthesize(question, results, apiKey) {
  const context = results.map((r, i) => `[${i + 1}] ${r.title || r.url}\n${r.url}\n${r.content}`).join("\n\n");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
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

  const payload = await response.json();
  return payload.choices?.[0]?.message?.content?.trim() || "";
}
