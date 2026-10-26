/**
 * Runs the playground's checks in Chromium and WebKit, against the built site, and fails if any
 * case doesn't do what it should. Build the site first (`pnpm --filter docs build`); the browsers
 * come from `playwright install chromium webkit`.
 *
 *   pnpm --filter docs check:playground            both browsers
 *   pnpm --filter docs check:playground webkit     one of them
 */
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, webkit } from "playwright";

const PORT = 4329;
const BROWSERS = { chromium, webkit };
const asked = process.argv.slice(2).filter((name) => name in BROWSERS);
const browsers = asked.length ? asked : Object.keys(BROWSERS);

// The built site, served as it would be: a folder's index.html for its path
const DIST = fileURLToPath(new URL("../dist", import.meta.url));
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json",
  ".woff2": "font/woff2",
};
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  const file = join(DIST, path, path.endsWith("/") ? "index.html" : "");
  try {
    const body = await readFile(extname(file) ? file : join(file, "index.html"));
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "text/html" });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(PORT, resolve));
const url = `http://localhost:${PORT}/playground/`;

let failed = false;
try {
  for (const name of browsers) {
    const browser = await BROWSERS[name].launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(url);
    await page.waitForFunction(() => "__playground" in window);
    const results = await page.evaluate(() => window.__playground.checkAll());
    await browser.close();

    const checked = results.filter((r) => r.checked);
    const failing = checked.filter((r) => r.failures.length);
    console.log(`${name}: ${checked.length - failing.length} / ${checked.length} passing`);
    for (const r of failing) {
      console.log(`  ✗ ${r.id}`);
      for (const f of r.failures) console.log(`      ${f}`);
    }
    for (const e of errors) console.log(`  page error: ${e}`);
    if (failing.length || errors.length) failed = true;
  }
} finally {
  server.close();
}
process.exit(failed ? 1 : 0);
