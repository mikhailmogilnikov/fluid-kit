import { svelte } from "@sveltejs/vite-plugin-svelte";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// A page for each framework; React's JSX needs no plugin. Built for `esnext`, as Astro builds: the CSS
// minifier then has no browsers to keep to, and rewrites the most
export default defineConfig({
  plugins: [vue(), svelte()],
  build: { target: "esnext", rolldownOptions: { input: ["react.html", "vue.html", "svelte.html"] } },
});
