/**
 * Debug: every frame, the boxes the packages work with, outlined and named, over everything: glass,
 * glass groups, and whatever the packages mark (`data-fk-*`, a lift's or a drag's state). It reads
 * the page only, so no package needs a debug mode of its own. Drawn into a lift's dialog while one
 * is open, so it's over the top layer too.
 */
const WATCH = [
  ".lb",
  "[data-fk-surface]",
  "[data-fk-part]",
  "[data-fk-away]",
  "[data-fk-match]",
  "[data-lifting]",
  "[data-lifted]",
  "[data-dragging]",
  "[data-highlighted]",
  "[data-pressed]",
  "[data-lb-melted]",
].join(", ");

/** What a box is called, from what marks it */
const nameOf = (el: Element) => {
  const marks: string[] = [];
  if (el.classList.contains("lb-group")) marks.push("group");
  else if (el.classList.contains("lb")) marks.push("glass");
  for (const { name, value } of el.attributes) {
    if (name.startsWith("data-fk-")) marks.push(value ? `${name.slice(8)}=${value}` : name.slice(8));
    else if (/^data-(lifting|lifted|dragging|highlighted|pressed|lb-melted)$/.test(name)) marks.push(name.slice(5));
  }
  return marks.join(" · ");
};

/** Its color: what moves or is pointed at stands out from plain glass */
const colorOf = (el: Element) =>
  el.matches("[data-fk-away]")
    ? "#ff9f0a"
    : el.matches("[data-lifted], [data-lifting], [data-dragging], [data-pressed], [data-highlighted]")
      ? "#ff375f"
      : el.matches("[data-fk-part], [data-fk-surface], .lb-group")
        ? "#30d158"
        : "#0a84ff";

export function debugOverlay(scope: HTMLElement) {
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText = "position: fixed; inset: 0; pointer-events: none; z-index: 2147483647; contain: strict;";
  const pool: HTMLElement[] = [];
  let frame = 0;
  let on = false;

  const box = (i: number) => {
    let el = pool[i];
    if (!el) {
      el = document.createElement("div");
      el.style.cssText =
        "position: absolute; box-sizing: border-box; border: 1px solid; border-radius: 3px; " +
        "font: 600 10px/1 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap;";
      const tag = document.createElement("span");
      tag.style.cssText =
        "position: absolute; left: -1px; bottom: 100%; padding: 2px 4px; color: #fff; border-radius: 3px 3px 3px 0;";
      el.append(tag);
      pool[i] = el;
      layer.append(el);
    }
    return el;
  };

  const draw = () => {
    frame = requestAnimationFrame(draw);
    // Over the top layer while a lift's dialog is up there
    const host = document.querySelector("dialog[data-fk-lift][open]") ?? document.body;
    if (layer.parentElement !== host) host.append(layer);
    const els = [...scope.querySelectorAll(WATCH), ...(host === document.body ? [] : host.querySelectorAll(WATCH))];
    let i = 0;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      const b = box(i++);
      const color = colorOf(el);
      b.style.display = "";
      b.style.transform = `translate(${r.left}px, ${r.top}px)`;
      b.style.width = `${r.width}px`;
      b.style.height = `${r.height}px`;
      b.style.borderColor = color;
      const tag = b.firstElementChild as HTMLElement;
      tag.textContent = nameOf(el);
      tag.style.background = color;
    }
    for (let j = i; j < pool.length; j++) pool[j].style.display = "none";
  };

  return {
    get on() {
      return on;
    },
    toggle(next: boolean) {
      on = next;
      cancelAnimationFrame(frame);
      if (on) draw();
      else layer.remove();
    },
  };
}
