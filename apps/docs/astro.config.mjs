// @ts-check
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

/**
 * Where the site lives; the packages' READMEs link here too. A build for GitHub Pages says where
 * that is instead: its origin (`SITE`) and the path under it (`BASE_PATH`, `/<repository>`).
 */
const site = process.env.SITE || "https://fluidkit.mogilnikov.dev";
const base = process.env.BASE_PATH || undefined;

/**
 * Links written from the root (`href="/blur"`, in templates, Markdown and the pages' intros alike)
 * are put under the base once the pages are built, so they're written once, for a site at the root.
 * Astro's own URLs (its assets, a page's canonical) have it already and are left as they are.
 */
const underBase = () => ({
  name: "under-base",
  hooks: {
    /** @param {{ dir: URL }} options */
    "astro:build:done": async ({ dir }) => {
      const prefix = base?.replace(/\/$/, "");
      if (!prefix) return;
      const root = fileURLToPath(dir);
      const files = (await readdir(root, { recursive: true })).filter((file) => file.endsWith(".html"));
      // `href="/x"`, `src="/x"` and a redirect's `url=/x`, not `//host` or what's under the base already
      const rooted = new RegExp(`((?:href|src)="|url=)/(?!/|${prefix.slice(1)}(?:/|"|$))`, "g");
      for (const file of files) {
        const path = join(root, file);
        const html = await readFile(path, "utf8");
        const moved = html.replace(rooted, `$1${prefix}/`);
        if (moved !== html) await writeFile(path, moved);
      }
    },
  },
});

export default defineConfig({
  site,
  base,
  server: { port: 4321 },
  integrations: [mdx(), underBase()],
  markdown: {
    // The same highlighting as <CodeBlock>: both themes, switched by the page's own
    shikiConfig: { themes: { light: "vitesse-light", dark: "vitesse-dark" }, defaultColor: false },
  },
  redirects: {
    // The whole documentation was one page before the packages split
    "/docs": "/blur",
  },
});
