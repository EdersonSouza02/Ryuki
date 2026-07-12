const KEYWORDS = {
  javascript: ["function", "const", "let", "var", "return", "if", "else", "for", "while", "class", "import", "export"],
  python: ["def", "class", "return", "if", "else", "for", "while", "import", "from", "async", "await"],
  java: ["public", "private", "class", "void", "int", "String", "return", "if", "else", "for", "while", "import"],
  cpp: ["int", "void", "class", "return", "if", "else", "for", "while", "#include"],
  sql: ["SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "JOIN"],
};

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function detectLanguage(code) {
  const firstLine = code.split("\n")[0];

  if (firstLine.includes("public class") || firstLine.includes("public static")) return "java";
  if (code.includes("def ") || code.includes("import ")) return "python";
  if (code.includes("const ") || code.includes("function ")) return "javascript";
  if (code.includes("#include") || code.includes("std::")) return "cpp";
  if (code.includes("SELECT") || code.includes("FROM")) return "sql";

  return null;
}

function highlightLine(line, language) {
  if (!language || !KEYWORDS[language]) return line;

  const keywords = KEYWORDS[language];
  let result = line;

  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    result = result.replace(regex, `${COLORS.bright}${COLORS.magenta}${keyword}${COLORS.reset}`);
  }

  // Destaca strings
  result = result.replace(/"([^"]*)"/g, `${COLORS.green}"$1"${COLORS.reset}`);
  result = result.replace(/'([^']*)'/g, `${COLORS.green}'$1'${COLORS.reset}`);

  // Destaca números
  result = result.replace(/\b(\d+)\b/g, `${COLORS.yellow}$1${COLORS.reset}`);

  // Destaca comentários
  result = result.replace(/\/\/(.*)$/g, `${COLORS.gray}//$1${COLORS.reset}`);

  return result;
}

export function highlightCode(text) {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;

  return text.replace(codeBlockRegex, (match, lang, code) => {
    const language = lang || detectLanguage(code);
    const lines = code.split("\n");

    const highlighted = lines
      .map((line) => highlightLine(line, language))
      .join("\n");

    return `\`\`\`\n${highlighted}\n\`\`\``;
  });
}

export function extractCodeBlocks(text) {
  const blocks = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || "text",
      code: match[2],
    });
  }

  return blocks;
}
