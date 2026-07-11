#!/usr/bin/env node
import { runRepl } from "../src/repl.js";

runRepl().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
