import { spawn } from "node:child_process";

const children = [];

function start(name, command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: false
  });

  child.on("exit", (code, signal) => {
    if (signal || code !== 0) {
      for (const proc of children) {
        if (proc !== child) {
          proc.kill("SIGTERM");
        }
      }
      process.exit(code ?? 1);
    }
  });

  children.push(child);
  return child;
}

const web = start("web", "npm", ["run", "dev:web"]);
const bot = start("bot", "npm", ["run", "dev:bot"]);

function shutdown(signal) {
  for (const child of [web, bot]) {
    child.kill(signal);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
