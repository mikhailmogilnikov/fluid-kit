import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

const source = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  pack: {
    entry: ["src/index.ts"],
    format: "esm",
    platform: "browser",
    target: "es2022",
    dts: true,
    sourcemap: true,
  },
  test: {
    environment: "happy-dom",
    // Core from its source: tests don't wait on a build
    alias: {
      "@fluidkit/core": source("../core/src/index.ts"),
    },
  },
});
