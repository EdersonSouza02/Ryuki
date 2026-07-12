export async function search(query, apiKey, { limit = 6, lang = "pt", country = "br" } = {}) {
  const response = await fetch("https://api.firecrawl.dev/v1/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    // Sem scrapeOptions: só busca (sem renderizar/extrair cada página inteira),
    // o que deixa a resposta bem mais rápida.
    body: JSON.stringify({ query, limit, lang, country }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Firecrawl search falhou (${response.status}): ${body}`);
  }

  const payload = await response.json();
  if (!payload.success) {
    throw new Error(`Firecrawl search retornou erro: ${JSON.stringify(payload)}`);
  }

  return (payload.data || []).map((item) => ({
    url: item.url,
    title: item.title,
    content: item.description || "",
  }));
}
