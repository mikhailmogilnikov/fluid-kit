import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vite-plus/test";

/** Morph needs core and nothing else of the family: a group it meets only through the DOM */
const root = join(__dirname, "..");

describe("package boundaries", () => {
  it("imports core alone", () => {
    const source = readFileSync(join(root, "src/index.ts"), "utf8");
    const imports = [...source.matchAll(/^(?:import|export)[^;]*?from\s+"([^"]+)"/gms)].map((m) => m[1]);
    expect(imports).toEqual(["@fluidkit/core"]);
  });

  it("depends on core alone; blur only to test against", () => {
    const { dependencies, devDependencies } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    expect(Object.keys(dependencies)).toEqual(["@fluidkit/core"]);
    expect(devDependencies).toHaveProperty("@fluidkit/blur");
  });
});
