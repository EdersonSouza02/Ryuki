// Heurísticas simples pra detectar se a pergunta pede resultados recentes,
// da mais específica (dia) pra mais ampla (ano) — a primeira que bater vence.
const FRESHNESS_PATTERNS = [
  { tbs: "qdr:d", regex: /\b(hoje|agora|neste momento|nesta hora)\b/i },
  { tbs: "qdr:w", regex: /\b(essa|esta)\s+semana|últimos\s+dias\b/i },
  { tbs: "qdr:m", regex: /\b(esse|este)\s+mês|recentes?|atual(idade)?|novidades?|últimas?\s+not[íi]cias|not[íi]cias\b/i },
  { tbs: "qdr:y", regex: /\b20(2[4-9]|3\d)\b/ },
];

export function detectFreshness(query) {
  const match = FRESHNESS_PATTERNS.find(({ regex }) => regex.test(query));
  return match?.tbs;
}

// Redes sociais/vídeo raramente têm conteúdo textual útil pra busca —
// tendem a poluir resultados com legendas soltas em vez de informação real.
// A API de search não aceita "excludeDomains" nesse endpoint, então a
// exclusão é feita via operador "-site:" embutido na própria query.
const LOW_QUALITY_DOMAINS = ["tiktok.com", "instagram.com", "facebook.com", "youtube.com", "pinterest.com"];

export function buildQuery(query) {
  const exclusions = LOW_QUALITY_DOMAINS.map((domain) => `-site:${domain}`).join(" ");
  return `${query} ${exclusions}`;
}
