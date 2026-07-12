import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const THEMES_DIR = join(homedir(), ".config", "ryuki");
const THEME_FILE = join(THEMES_DIR, "theme.json");

const DEFAULT_THEME = {
  name: "default",
  colors: {
    prompt: "\x1b[36m", // cyan
    success: "\x1b[32m", // green
    error: "\x1b[31m", // red
    warning: "\x1b[33m", // yellow
    info: "\x1b[90m", // gray
    highlight: "\x1b[1m\x1b[35m", // bright magenta
    reset: "\x1b[0m",
  },
};

const PRESET_THEMES = {
  dark: {
    name: "dark",
    colors: {
      prompt: "\x1b[36m",
      success: "\x1b[32m",
      error: "\x1b[31m",
      warning: "\x1b[33m",
      info: "\x1b[90m",
      highlight: "\x1b[1m\x1b[35m",
      reset: "\x1b[0m",
    },
  },
  light: {
    name: "light",
    colors: {
      prompt: "\x1b[34m", // blue
      success: "\x1b[32m",
      error: "\x1b[31m",
      warning: "\x1b[33m",
      info: "\x1b[37m", // white
      highlight: "\x1b[1m\x1b[35m",
      reset: "\x1b[0m",
    },
  },
  solarized: {
    name: "solarized",
    colors: {
      prompt: "\x1b[36m", // cyan
      success: "\x1b[32m", // green
      error: "\x1b[31m", // red
      warning: "\x1b[33m", // yellow
      info: "\x1b[90m", // gray
      highlight: "\x1b[1m\x1b[36m", // bright cyan
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
    return false;
  }

  writeFileSync(THEME_FILE, JSON.stringify(theme, null, 2));
  return true;
}

export function getAvailableThemes() {
  return Object.keys(PRESET_THEMES).concat("default");
}
