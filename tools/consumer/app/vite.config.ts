import { svelte } from "@sveltejs/vite-plugin-svelte";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// A page for each framework; React's JSX needs no plugin
export default defineConfig({
  plugins: [vue(), svelte()],
  build: { rolldownOptions: { input: ["react.html", "vue.html", "svelte.html"] } },
});
