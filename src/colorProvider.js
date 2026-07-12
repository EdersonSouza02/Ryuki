import { loadTheme } from "./themes.js";

let currentTheme = loadTheme();

export function setThemeForSession(theme) {
  currentTheme = theme;
}

export function getTheme() {
  return currentTheme;
}

export const colorize = {
  prompt: (text) => `${currentTheme.colors.prompt}${text}\x1b[0m`,
  success: (text) => `${currentTheme.colors.success}${text}\x1b[0m`,
  error: (text) => `${currentTheme.colors.error}${text}\x1b[0m`,
  warning: (text) => `${currentTheme.colors.warning}${text}\x1b[0m`,
  info: (text) => `${currentTheme.colors.info}${text}\x1b[0m`,
  highlight: (text) => `${currentTheme.colors.highlight}${text}\x1b[0m`,
  reset: () => "\x1b[0m",
};

export function bold(text) {
  return `\x1b[1m${text}\x1b[0m`;
}

export function cyan(text) {
  return colorize.prompt(text);
}

export function gray(text) {
  return colorize.info(text);
}

export function green(text) {
  return colorize.success(text);
}

export function red(text) {
  return colorize.error(text);
}

export function yellow(text) {
  return colorize.warning(text);
}
