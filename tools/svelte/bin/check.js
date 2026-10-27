#!/usr/bin/env node
// svelte-check as installed here, beside TypeScript 6, run in the calling package. By path: its CLI
// isn't among the package's exports
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../node_modules/svelte-check/bin/svelte-check", import.meta.url));
const { status } = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], { stdio: "inherit" });
process.exit(status ?? 1);
