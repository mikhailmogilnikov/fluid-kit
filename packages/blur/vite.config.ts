import { fileURLToPath } from "node:url";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite-plus";

const source = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  // Svelte components, for the tests. Typed against Vite itself, not Vite+'s copy of it
  plugins: [svelte() as never],
  resolve: process.env.VITEST ? { conditions: ["browser"] } : undefined,
  pack: {
    entry: [
      "src/press.ts",
      "src/melt.ts",
      "src/auto.ts",
      "src/styles.ts",
      "src/liquid-blur.css",
      "src/react.tsx",
      "src/vue.ts",
      // On their own: the Svelte adapter, packaged apart, imports them by path
      "src/group.ts",
      "src/interaction.ts",
      "src/variants.ts",
    ],
    format: "esm",
    platform: "browser",
    target: "es2022",
    dts: true,
    sourcemap: true,
    /*
     * The stylesheet, minified for the oldest browsers it supports: where `pow()` (Chrome 120,
     * Firefox 118) and `color-mix()` (Safari 16.2) came in. Nothing there needs lowering, and Safari
     * before 18 keeps its `-webkit-backdrop-filter`, which a target-less build would drop.
     */
    css: { fileName: "style.css", minify: true, target: ["chrome120", "firefox118", "safari16.2"] },
  },
  test: {
    environment: "happy-dom",
    // Core from its source: tests don't wait on a build
    alias: [
      { find: /^@fluidkit\/core$/, replacement: source("../core/src/index.ts") },
      { find: /^@fluidkit\/core\/react$/, replacement: source("../core/src/react.ts") },
      { find: /^@fluidkit\/core\/vue$/, replacement: source("../core/src/vue.ts") },
      { find: /^@fluidkit\/core\/svelte$/, replacement: source("../core/src/svelte/index.ts") },
    ],
  },
});
