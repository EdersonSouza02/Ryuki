import { bold, gray } from "./format.js";

export function formatTable(text) {
  const lines = text.split("\n");
  const tables = [];
  let currentTable = [];
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableLine = /^\s*\|/.test(line) || /^\s*[\-\+\|:]+\s*$/.test(line);

    if (isTableLine) {
      if (!inTable) inTable = true;
      currentTable.push(line);
    } else {
      if (inTable && currentTable.length > 0) {
        tables.push({ start: i - currentTable.length, lines: currentTable });
        currentTable = [];
        inTable = false;
      }
    }
  }

  if (inTable && currentTable.length > 0) {
    tables.push({ start: lines.length - currentTable.length, lines: currentTable });
  }

  if (tables.length === 0) return text; // sem tabelas

  let result = text;
  const offset = 0;

  for (const table of tables) {
    const formatted = renderTable(table.lines);
    if (formatted) {
      const original = table.lines.join("\n");
      result = result.replace(original, formatted);
    }
  }

  return result;
}

function renderTable(lines) {
  if (lines.length < 2) return null;

  const headerLine = lines[0];
  const separatorIndex = lines.findIndex((l) => /^[\s\-\+|:]+$/.test(l));

  if (separatorIndex === -1) return null;

  const headers = headerLine
    .split("|")
    .map((h) => h.trim())
    .filter((h) => h);
  const rows = lines
    .slice(separatorIndex + 1)
    .map((line) =>
      line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell)
    )
    .filter((row) => row.length === headers.length);

  if (rows.length === 0) return null;

  const colWidths = headers.map((h, i) => {
    const maxRowWidth = Math.max(...rows.map((r) => r[i]?.length || 0));
    return Math.max(h.length, maxRowWidth);
  });

  const border = `┌${colWidths.map((w) => "─".repeat(w + 2)).join("┬")}┐`;
  const headerRow = `│${headers.map((h, i) => ` ${bold(h.padEnd(colWidths[i]))} `).join("│")}│`;
  const separator = `├${colWidths.map((w) => "─".repeat(w + 2)).join("┼")}┤`;

  const dataRows = rows
    .map((row) => `│${row.map((cell, i) => ` ${(cell || "").padEnd(colWidths[i])} `).join("│")}│`)
    .join("\n");

  const footer = `└${colWidths.map((w) => "─".repeat(w + 2)).join("┴")}┘`;

  return `\n${border}\n${headerRow}\n${separator}\n${dataRows}\n${footer}\n`;
}
