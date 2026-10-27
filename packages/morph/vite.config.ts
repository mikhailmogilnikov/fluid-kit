import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

const source = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  pack: {
    entry: ["src/index.ts", "src/react.tsx", "src/vue.ts"],
    format: "esm",
    platform: "browser",
    target: "es2022",
    dts: true,
    sourcemap: true,
  },
  test: {
    environment: "happy-dom",
    // The packages it meets, from their source: tests don't wait on a build
    alias: [
      { find: /^@fluidkit\/core$/, replacement: source("../core/src/index.ts") },
      { find: /^@fluidkit\/core\/react$/, replacement: source("../core/src/react.ts") },
      { find: /^@fluidkit\/core\/vue$/, replacement: source("../core/src/vue.ts") },
      { find: /^@fluidkit\/blur\/melt$/, replacement: source("../blur/src/melt.ts") },
    ],
  },
});
