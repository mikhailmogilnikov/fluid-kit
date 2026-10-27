import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vite-plus/test";

/**
 * Who may import whom. Press and melt never import each other, and the package imports nothing of
 * the family but @fluidkit/core: where it meets morph it does so through the DOM names there.
 */
const allowed: Record<string, string[]> = {
  blob: [],
  interaction: ["@fluidkit/core"],
  group: ["./blob", "@fluidkit/core"],
  // Entries
  press: ["./interaction"],
  melt: ["./group"],
  auto: ["./interaction"],
  styles: [],
  // Framework adapters: the same variants, press and groups, as components
  variants: [],
  react: ["./group", "./interaction", "./variants", "@fluidkit/core/react", "react"],
  vue: ["./group", "./interaction", "./variants", "@fluidkit/core/vue", "vue"],
  // Svelte's, packaged apart: the same modules, by path from its folder
  "svelte/helpers.svelte": ["../group", "../interaction", "../variants", "svelte", "svelte/attachments"],
  "svelte/index": ["../variants", "./Glass.svelte", "./Group.svelte", "./helpers.svelte"],
};

const root = join(__dirname, "..");
const importsOf = (file: string) =>
  [...readFileSync(join(root, "src", file), "utf8").matchAll(/^(?:import|export)[^;]*?from\s+"([^"]+?)(?:\.js)?"/gms)]
    .map((m) => m[1])
    .sort();

describe("module boundaries", () => {
  const files = [
    ...readdirSync(join(root, "src")),
    ...readdirSync(join(root, "src", "svelte")).map((f) => `svelte/${f}`),
  ].filter((f) => /\.tsx?$/.test(f));

  it("knows every source file", () => {
    expect(files.map((f) => f.replace(/\.tsx?$/, "")).sort()).toEqual(Object.keys(allowed).sort());
  });

  for (const file of files) {
    const name = file.replace(/\.tsx?$/, "");
    it(`${name} imports only what it may`, () => {
      expect(importsOf(file)).toEqual([...new Set(allowed[name])].sort());
    });
  }

  it("depends on core alone", () => {
    const { dependencies } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    expect(Object.keys(dependencies)).toEqual(["@fluidkit/core"]);
  });
});
