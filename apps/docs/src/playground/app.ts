import { SpringAnimator } from "@fluidkit/core";
import { installGlassGroups } from "@fluidkit/blur/melt";
import { segmented } from "../scripts/segmented";
import { CASES, PACKAGES, type CaseMeta } from "./cases";
import type { Kit, Run, Setup } from "./kit";
import { debugOverlay } from "./debug";
import { blur } from "./blur";
import { morph } from "./morph";
import { indicator } from "./indicator";
import { drag } from "./drag";
import { lift } from "./lift";

/**
 * The playground: one case on the stage at a time, cloned fresh from its template, set up by its
 * package's script, and torn down when another is opened. The step bar runs its steps in turn.
 */
installGlassGroups();

const setups: Record<string, Setup> = { ...blur, ...morph, ...indicator, ...drag, ...lift };
const page = document.querySelector<HTMLElement>("[data-pg]")!;
const $ = <T extends Element = HTMLElement>(name: string) => page.querySelector<T>(`[data-pg-${name}]`)!;

const stage = $("stage");
const mount = $("mount");
const backdrop = $("backdrop");
const side = $<HTMLDetailsElement>("side");
const bar = $("next").parentElement!;
const phone = matchMedia("(max-width: 860px)");

// ── Settings, remembered ──

const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem("fk-playground") ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
})();
const remember = (key: string, value: string) => {
  saved[key] = value;
  try {
    localStorage.setItem("fk-playground", JSON.stringify(saved));
  } catch {}
};

// ── Speed: every spring through core, CSS transitions and animations through their playback rate ──

let speed = 1;
const rate = (animation: Animation) => {
  animation.playbackRate = speed;
};
const setSpeed = (value: number) => {
  speed = value;
  SpringAnimator.timeScale = value;
  for (const animation of document.getAnimations()) rate(animation);
  remember("speed", String(value));
};
// New ones as they start: a glass's press, a stripe's slide
for (const type of ["transitionrun", "animationstart"]) {
  document.addEventListener(
    type,
    (e) => {
      for (const animation of (e.target as Element).getAnimations?.() ?? []) rate(animation);
    },
    true,
  );
}
const speedControl = segmented($("speed"), (v) => setSpeed(Number(v)));
const speedLabel = () => ({ 1: "real time", 0.25: "slow (×4)", 0.1: "slower (×10)" })[speed] ?? `×${speed}`;

// ── Backdrop ──

let bg = "aurora";
const setBackdrop = (value: string) => {
  bg = value;
  stage.dataset.bg = value;
  backdrop.className = "pg__backdrop bd";
  if (value === "aurora") backdrop.classList.add("bd-aurora");
  if (value === "stripes") backdrop.classList.add("bd-stripes", "is-live");
  remember("bg", value);
};
const bgControl = segmented($("bg"), setBackdrop);

// ── Debug: the boxes the packages work with, drawn over everything ──

const debug = debugOverlay(mount);
const debugButton = $("debug");
const setDebug = (on: boolean) => {
  debugButton.setAttribute("aria-pressed", String(on));
  debug.toggle(on);
  remember("debug", on ? "1" : "");
};
debugButton.addEventListener("click", () => setDebug(debugButton.getAttribute("aria-pressed") !== "true"));

// ── The case on the stage ──

let meta: CaseMeta = CASES[0];
let run: Run = {};
let step = 0;
let leave: Array<() => void> = [];
let auto = 0;

const kit = (): Kit => ({
  later(fn, ms) {
    const id = window.setTimeout(fn, ms / SpringAnimator.timeScale);
    leave.push(() => window.clearTimeout(id));
  },
  cleanup(fn) {
    leave.push(fn);
  },
  skip(label) {
    if (meta.steps[step] !== label) return;
    step = (step + 1) % meta.steps.length;
    showStep();
  },
});

const showStep = () => {
  const n = meta.steps.length;
  bar.dataset.steps = String(n);
  $("only").hidden = n > 0;
  $("step").textContent = n ? `${step + 1} / ${n}` : "";
  $("next-label").textContent = meta.steps[step] ?? "";
};

const stopAuto = () => {
  window.clearTimeout(auto);
  auto = 0;
  $("auto").setAttribute("aria-pressed", "false");
};

const teardown = () => {
  stopAuto();
  run.destroy?.();
  for (const fn of leave) fn();
  leave = [];
  run = {};
  mount.replaceChildren();
};

const open = (id: string, focusList = false) => {
  const next = CASES.find((c) => c.id === id) ?? CASES[0];
  const template = page.querySelector<HTMLTemplateElement>(`template[data-case="${next.id}"]`);
  teardown();
  meta = next;
  step = 0;
  if (template) mount.append(template.content.cloneNode(true));
  run = setups[meta.id]?.(mount, kit()) ?? {};

  $("title").textContent = meta.title;
  $("pkg").textContent = PACKAGES.find(([p]) => p === meta.pkg)![1];
  $("tags").replaceChildren(...meta.tags.map((t) => Object.assign(document.createElement("span"), { textContent: t })));
  $("expect").textContent = meta.expect;
  $("current").textContent = meta.title;
  for (const link of page.querySelectorAll<HTMLAnchorElement>("[data-pg-link]")) {
    if (link.dataset.pgLink === meta.id) {
      link.setAttribute("aria-current", "true");
      if (focusList) link.scrollIntoView({ block: "nearest" });
    } else link.removeAttribute("aria-current");
  }
  showStep();
  if (location.hash.slice(1) !== meta.id) history.replaceState(null, "", `#${meta.id}`);
};

const next = () => {
  if (!meta.steps.length) return;
  run.steps?.[step]?.();
  step = (step + 1) % meta.steps.length;
  showStep();
};

$("next").addEventListener("click", () => {
  stopAuto();
  next();
});
$("reset").addEventListener("click", () => open(meta.id));
// Auto: a step, then the next once it has had time to play out, at the speed it plays at
$("auto").addEventListener("click", () => {
  if (auto) return stopAuto();
  $("auto").setAttribute("aria-pressed", "true");
  const tick = () => {
    next();
    auto = window.setTimeout(tick, 1400 / SpringAnimator.timeScale);
  };
  tick();
});

page.addEventListener("click", (e) => {
  const link = (e.target as Element).closest<HTMLAnchorElement>("[data-pg-link]");
  if (!link) return;
  e.preventDefault();
  open(link.dataset.pgLink!);
  if (phone.matches) side.open = false;
});
addEventListener("hashchange", () => {
  const id = location.hash.slice(1);
  if (id && id !== meta.id) open(id, true);
});

// ── Search ──

$<HTMLInputElement>("search").addEventListener("input", (e) => {
  const q = (e.target as HTMLInputElement).value.trim().toLowerCase();
  let any = false;
  for (const group of page.querySelectorAll<HTMLElement>("[data-pg-group]")) {
    let shown = 0;
    for (const link of group.querySelectorAll<HTMLElement>("[data-pg-link]")) {
      const match = !q || link.dataset.search!.includes(q);
      link.hidden = !match;
      if (match) shown++;
    }
    group.hidden = !shown;
    any ||= shown > 0;
  }
  $("none").hidden = any;
});

// ── Copy issue: the case, the settings and the browser, ready for a GitHub issue ──

$("copy").addEventListener("click", async () => {
  const theme = document.documentElement.dataset.theme ?? "auto";
  const report = [
    `### Case`,
    ``,
    `${PACKAGES.find(([p]) => p === meta.pkg)![1]}: ${meta.title} (\`${meta.id}\`)`,
    `${location.origin}${location.pathname}#${meta.id}`,
    ``,
    `### What should happen`,
    ``,
    meta.expect,
    ``,
    `### What happens instead`,
    ``,
    ``,
    ``,
    `### Setup`,
    ``,
    meta.steps.length ? `- Step: ${step + 1} / ${meta.steps.length} (next: ${meta.steps[step]})` : `- No steps`,
    `- Speed: ${speedLabel()} · Backdrop: ${bg} · Theme: ${theme} · Debug: ${debug.on ? "on" : "off"}`,
    `- Browser: ${navigator.userAgent}`,
    `- Viewport: ${innerWidth}×${innerHeight} @${devicePixelRatio}x`,
    `- Packages: ${page.dataset.versions}`,
  ].join("\n");
  const label = $("copy-label");
  try {
    await navigator.clipboard.writeText(report);
    label.textContent = "Copied";
  } catch {
    label.textContent = "Couldn't copy";
  }
  window.setTimeout(() => (label.textContent = "Copy issue"), 1600);
});

// ── Start: what was set last time, the case in the address ──

speedControl.select(saved.speed && ["1", "0.25", "0.1"].includes(saved.speed) ? saved.speed : "1");
bgControl.select(saved.bg ?? "aurora");
setDebug(saved.debug === "1");
if (phone.matches) side.open = false;
open(location.hash.slice(1), true);
