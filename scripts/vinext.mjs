import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const command = process.argv[2];

if (!command) {
  console.error("Usage: node scripts/vinext.mjs <dev|build|start> [...args]");
  process.exit(1);
}

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const logPath = resolve(projectRoot, ".wrangler", "wrangler.log");
const cliPath = resolve(projectRoot, "node_modules", "vinext", "dist", "cli.js");

mkdirSync(dirname(logPath), { recursive: true });

const child = spawn(
  process.execPath,
  [cliPath, command, ...process.argv.slice(3)],
  {
    cwd: projectRoot,
    env: {
      ...process.env,
      WRANGLER_LOG_PATH: logPath,
    },
    stdio: "inherit",
  },
);

child.once("error", (error) => {
  console.error(`Unable to start vinext: ${error.message}`);
  process.exitCode = 1;
});

child.once("exit", (code) => {
  process.exitCode = code ?? 1;
});
