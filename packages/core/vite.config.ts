import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite-plus";

export default defineConfig({
  // Svelte components, for the tests. Typed against Vite itself, not Vite+'s copy of it
  plugins: [svelte() as never],
  resolve: process.env.VITEST ? { conditions: ["browser"] } : undefined,
  pack: {
    // `settings` on its own: the Svelte adapter, packaged apart, imports it by path
    entry: ["src/index.ts", "src/react.ts", "src/vue.ts", "src/settings.ts"],
    format: "esm",
    platform: "browser",
    target: "es2022",
    dts: true,
    sourcemap: true,
  },
  test: {
    // The spring runs on requestAnimationFrame
    environment: "happy-dom",
  },
});
