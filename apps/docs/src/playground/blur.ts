import { SpringAnimator } from "@fluidkit/core";
import type { Setup } from "./kit";

/** A spring that moves an element by its `transform`, the way a script moves glass in a group */
const mover = (el: HTMLElement, params = { duration: 0.6, bounce: 0.3 }) =>
  new SpringAnimator({ x: 0, y: 0 }, params, ({ x, y }) => {
    el.style.transform = `translate(${x}px, ${y}px)`;
  });

export const blur: Record<string, Setup> = {
  "blur-dock": (root) => {
    const group = root.querySelector<HTMLElement>("[data-group]")!;
    const orb = root.querySelector<HTMLButtonElement>("[data-orb]")!;
    const slide = mover(orb);
    const set = (out: boolean) => {
      orb.setAttribute("aria-pressed", String(out));
      slide.to(out ? { x: 56, y: -40 } : { x: 0, y: 0 });
    };
    orb.addEventListener("click", () => set(orb.getAttribute("aria-pressed") !== "true"));
    const merge = root.querySelector<HTMLInputElement>("[data-merge]")!;
    const out = root.querySelector<HTMLOutputElement>("[data-merge-out]")!;
    merge.addEventListener("input", () => {
      group.style.setProperty("--lb-merge", `${merge.value}px`);
      out.value = `${merge.value}px`;
    });
    return { steps: [() => set(true), () => set(false)], destroy: () => slide.stop() };
  },

  // Played with: lb-stretch and the group do it all
  "blur-stretch": () => {},

  "blur-drops": (root) => {
    const springs: SpringAnimator<"x" | "y">[] = [];
    for (const drop of root.querySelectorAll<HTMLElement>("[data-drop]")) {
      const spring = mover(drop, { duration: 0.5, bounce: 0.35 });
      springs.push(spring);
      let start: { x: number; y: number; px: number; py: number } | null = null;
      drop.addEventListener("pointerdown", (e) => {
        drop.setPointerCapture(e.pointerId);
        const { x, y } = spring.values();
        start = { x, y, px: e.clientX, py: e.clientY };
      });
      drop.addEventListener("pointermove", (e) => {
        if (!start) return;
        spring.to(
          { x: start.x + e.clientX - start.px, y: start.y + e.clientY - start.py },
          { duration: 0.12, bounce: 0 },
        );
      });
      const release = () => {
        if (!start) return;
        start = null;
        spring.to({ x: 0, y: 0 }, { duration: 0.5, bounce: 0.35 });
      };
      drop.addEventListener("pointerup", release);
      drop.addEventListener("pointercancel", release);
    }
    return { destroy: () => springs.forEach((s) => s.stop()) };
  },

  "blur-scroll": (root) => scrolls(root),
  "blur-edge": (root) => scrolls(root),

  "blur-lens": (root) => {
    const thumb = root.querySelector<HTMLElement>("[data-thumb]")!;
    // Transitioned: --lb-lens is registered, so it eases from glass to lens
    const set = (lens: boolean) => thumb.style.setProperty("--lb-lens", lens ? "1" : "0");
    return { steps: [() => set(true), () => set(false)] };
  },

  "blur-clipped": (root) => {
    const glass = root.querySelector<HTMLElement>("[data-mover]")!;
    const slide = mover(glass, { duration: 0.9, bounce: 0.2 });
    return {
      steps: [() => slide.to({ x: 200, y: 140 }), () => slide.to({ x: 0, y: 0 })],
      destroy: () => slide.stop(),
    };
  },

  "blur-variants": () => {},
};

/** A list that scrolls to its end and back, smoothly */
function scrolls(root: HTMLElement) {
  const scroller = root.querySelector<HTMLElement>("[data-scroller]")!;
  return {
    steps: [
      () => scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" }),
      () => scroller.scrollTo({ top: 0, behavior: "smooth" }),
    ],
  };
}
