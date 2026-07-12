import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const THEMES_DIR = join(homedir(), ".config", "ryuki");
const THEME_FILE = join(THEMES_DIR, "theme.json");

const DEFAULT_THEME = {
  name: "default",
  colors: {
    prompt: "\x1b[96m", // bright cyan
    success: "\x1b[92m", // bright green
    error: "\x1b[91m", // bright red
    warning: "\x1b[93m", // bright yellow
    info: "\x1b[94m", // bright blue
    highlight: "\x1b[1m\x1b[95m", // bright magenta
    reset: "\x1b[0m",
  },
};

const PRESET_THEMES = {
  dark: {
    name: "dark",
    colors: {
      prompt: "\x1b[96m", // bright cyan
      success: "\x1b[92m", // bright green
      error: "\x1b[91m", // bright red
      warning: "\x1b[93m", // bright yellow
      info: "\x1b[94m", // bright blue
      highlight: "\x1b[1m\x1b[95m", // bright magenta
      reset: "\x1b[0m",
    },
  },
  light: {
    name: "light",
    colors: {
      prompt: "\x1b[34m", // dark blue
      success: "\x1b[32m", // dark green
      error: "\x1b[31m", // dark red
      warning: "\x1b[33m", // dark yellow
      info: "\x1b[37m", // white
      highlight: "\x1b[1m\x1b[35m", // bold magenta
      reset: "\x1b[0m",
    },
  },
  solarized: {
    name: "solarized",
    colors: {
      prompt: "\x1b[96m", // bright cyan
      success: "\x1b[92m", // bright green
      error: "\x1b[91m", // bright red
      warning: "\x1b[93m", // bright yellow
      info: "\x1b[94m", // bright blue
      highlight: "\x1b[1m\x1b[96m", // bright cyan
      reset: "\x1b[0m",
    },
  },
};

function ensureDir() {
  mkdirSync(THEMES_DIR, { recursive: true, mode: 0o700 });
}

export function loadTheme() {
  ensureDir();

  if (!existsSync(THEME_FILE)) {
    return DEFAULT_THEME;
  }

  try {
    return JSON.parse(readFileSync(THEME_FILE, "utf8"));
  } catch {
    return DEFAULT_THEME;
  }
}

export function setTheme(themeName) {
  ensureDir();

  let theme;
  if (PRESET_THEMES[themeName]) {
    theme = PRESET_THEMES[themeName];
  } else if (themeName === "default") {
    theme = DEFAULT_THEME;
  } else {
    return null;
  }

  writeFileSync(THEME_FILE, JSON.stringify(theme, null, 2));
  return theme;
}

export function getAvailableThemes() {
  return Object.keys(PRESET_THEMES).concat("default");
}
