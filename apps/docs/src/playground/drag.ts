import { createDrag } from "@fluidkit/drag";
import type { Setup } from "./kit";

export const drag: Record<string, Setup> = {
  // Three points along the rail: the dots' centers, the card centered on them
  "drag-snap": (root) => {
    const card = root.querySelector<HTMLElement>("[data-card]")!;
    const rail = card.parentElement!;
    const dots = [...rail.querySelectorAll<HTMLElement>(".dc-dot")];
    const d = createDrag({
      element: card,
      axis: "x",
      snaps: () => dots.map((dot) => dot.offsetLeft + dot.offsetWidth / 2 - card.offsetWidth / 2),
      initial: 0,
    });
    return { steps: [1, 2, 0].map((i) => () => d.snap(i)), destroy: () => d.destroy() };
  },

  // Free inside the frame, rubber past its sides
  "drag-bounds": (root) => {
    const frame = root.querySelector<HTMLElement>("[data-frame]")!;
    const ball = root.querySelector<HTMLElement>("[data-ball]")!;
    const d = createDrag({
      element: ball,
      axis: "both",
      bounds: () => ({ x: [0, frame.clientWidth - ball.offsetWidth], y: [0, frame.clientHeight - ball.offsetHeight] }),
    });
    d.to(
      { x: (frame.clientWidth - ball.offsetWidth) / 2, y: (frame.clientHeight - ball.offsetHeight) / 2 },
      { instant: true },
    );
    return { destroy: () => d.destroy() };
  },

  "drag-switch": (root) => {
    const toggle = root.querySelector<HTMLElement>("[data-switch]")!;
    const thumb = root.querySelector<HTMLElement>("[data-thumb]")!;
    const travel = () => toggle.clientWidth - thumb.offsetWidth - 4;
    const set = (on: boolean) => toggle.setAttribute("aria-checked", String(on));
    const d = createDrag({
      element: thumb,
      handle: toggle,
      axis: "x",
      snaps: () => [0, travel()],
      initial: 0,
      rubberband: 0,
      spring: { duration: 0.3, bounce: 0 },
      follow: { duration: 0.18, bounce: 0 },
      onMove: ({ x }) => toggle.style.setProperty("--on", String(x / travel())),
      onEnd: (snap) => set(snap === 1),
    });
    const flip = (on: boolean) => {
      set(on);
      d.snap(on ? 1 : 0);
    };
    toggle.addEventListener("click", () => flip(toggle.getAttribute("aria-checked") !== "true"));
    return { steps: [() => flip(true), () => flip(false)], destroy: () => d.destroy() };
  },

  // Open, half way, down to its title; its list hands the gesture back and forth with it
  "drag-sheet": (root) => {
    const area = root.querySelector<HTMLElement>("[data-area]")!;
    const sheet = root.querySelector<HTMLElement>("[data-sheet]")!;
    const d = createDrag({
      element: sheet,
      axis: "y",
      scroll: sheet.querySelector<HTMLElement>("[data-scroll]")!,
      snaps: () => {
        const h = area.clientHeight;
        return [0, h / 2 - 12, h - 12 - 76];
      },
      initial: 1,
    });
    return { steps: [0, 1, 2].map((i) => () => d.snap(i)), destroy: () => d.destroy() };
  },

  // The card sideways; the slider's knob along it, its own drag
  "drag-nested": (root) => {
    const card = root.querySelector<HTMLElement>("[data-card]")!;
    const slider = root.querySelector<HTMLElement>("[data-slider]")!;
    const knob = root.querySelector<HTMLElement>("[data-knob]")!;
    const outer = createDrag({ element: card, axis: "x", snaps: [0], rubberband: 0.55 });
    const travel = () => slider.clientWidth - knob.offsetWidth;
    const inner = createDrag({
      element: knob,
      handle: slider,
      axis: "x",
      bounds: () => ({ x: [0, travel()] }),
      rubberband: 0.2,
      deceleration: 0,
      spring: { duration: 0.25, bounce: 0 },
      follow: { duration: 0.12, bounce: 0 },
      onMove: ({ x }) => slider.style.setProperty("--v", String(Math.min(1, Math.max(0, x / (travel() || 1))))),
    });
    inner.to(travel() * 0.4, { instant: true });
    return {
      destroy: () => {
        inner.destroy();
        outer.destroy();
      },
    };
  },
};
