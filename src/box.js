import { visibleLength } from "./format.js";

export function topBorder(width) {
  return `╭${"─".repeat(width + 2)}╮`;
}

export function bottomBorder(width) {
  return `╰${"─".repeat(width + 2)}╯`;
}

export function line(text, width) {
  const pad = Math.max(width - visibleLength(text), 0);
  return `│ ${text}${" ".repeat(pad)} │`;
}

export function centerLine(text, width) {
  const pad = Math.max(width - visibleLength(text), 0);
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return `│ ${" ".repeat(left)}${text}${" ".repeat(right)} │`;
}
