import { fileURLToPath } from "node:url";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite-plus";

const source = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  // Svelte components, for the tests. Typed against Vite itself, not Vite+'s copy of it
  plugins: [svelte() as never],
  resolve: process.env.VITEST ? { conditions: ["browser"] } : undefined,
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
      { find: /^@fluidkit\/core\/svelte$/, replacement: source("../core/src/svelte/index.ts") },
      { find: /^@fluidkit\/blur\/melt$/, replacement: source("../blur/src/melt.ts") },
    ],
  },
});
