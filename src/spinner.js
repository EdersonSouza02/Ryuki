const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const INTERVAL_MS = 80;

function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  const secs = Math.floor(ms / 1000);
  return `${secs}s`;
}

export function startSpinner(label) {
  if (!process.stdout.isTTY) {
    console.log(label);
    return () => {};
  }

  let frame = 0;
  const startTime = Date.now();
  process.stdout.write(`${FRAMES[0]} ${label}`);

  const timer = setInterval(() => {
    frame = (frame + 1) % FRAMES.length;
    const elapsed = formatTime(Date.now() - startTime);
    process.stdout.write(`\r${FRAMES[frame]} ${label} (${elapsed})`);
  }, INTERVAL_MS);

  return function stopSpinner() {
    clearInterval(timer);
    process.stdout.write(`\r${" ".repeat(label.length + 20)}\r`);
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
