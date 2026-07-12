#!/usr/bin/env node
import { runRepl } from "../src/repl.js";
import { runOnce } from "../src/oneshot.js";

const question = process.argv.slice(2).join(" ").trim();

const run = question ? () => runOnce(question) : runRepl;

run().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
