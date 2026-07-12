import { runRepl } from "./repl.js";
import { runOnce } from "./oneshot.js";
import { runConfigCommand } from "./configCommand.js";
import { VERSION } from "./version.js";
import { HELP } from "./help.js";

export async function main(argv) {
  if (argv.includes("-h") || argv.includes("--help")) {
    console.log(HELP);
    return;
  }

  if (argv.includes("-v") || argv.includes("--version")) {
    console.log(VERSION);
    return;
  }

  if (argv[0] === "config") {
    runConfigCommand(argv.slice(1));
    return;
  }

  const args = argv.filter((arg) => arg !== "--fast");
  const fast = args.length !== argv.length;
  const question = args.join(" ").trim();

  if (question) {
    await runOnce(question, { fast });
  } else {
    await runRepl({ fast });
  }
}
