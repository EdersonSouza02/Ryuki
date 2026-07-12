const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const INTERVAL_MS = 80;

export function startSpinner(label) {
  if (!process.stdout.isTTY) {
    console.log(label);
    return () => {};
  }

  let frame = 0;
  process.stdout.write(`${FRAMES[0]} ${label}`);

  const timer = setInterval(() => {
    frame = (frame + 1) % FRAMES.length;
    process.stdout.write(`\r${FRAMES[frame]} ${label}`);
  }, INTERVAL_MS);

  return function stopSpinner() {
    clearInterval(timer);
    process.stdout.write(`\r${" ".repeat(label.length + 2)}\r`);
  };
}

export async function withSpinner(label, fn) {
  const stop = startSpinner(label);
  try {
    return await fn();
  } finally {
    stop();
  }
}
