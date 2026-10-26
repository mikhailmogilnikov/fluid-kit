import { SpringAnimator } from "@fluidkit/core";
import { expect, first } from "./check";
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
    // Docked it's melted to the bar, 8px apart; split off 64px, it isn't
    const melted = () => group.hasAttribute("data-lb-melted");
    const at = (x: number, y: number) => {
      const v = slide.values();
      return Math.abs(v.x - x) < 0.5 && Math.abs(v.y - y) < 0.5;
    };
    return {
      steps: [() => set(true), () => set(false)],
      check: (step) =>
        step === 0
          ? first(expect(at(56, -40), "the button isn't out"), expect(!melted(), "still melted, split off"))
          : first(expect(at(0, 0), "the button isn't back"), expect(melted(), "not melted, docked")),
      destroy: () => slide.stop(),
    };
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
    return {
      // 20px from the pill, past the 18px merge: apart until one is dragged in
      check: (step) =>
        step < 0 ? expect(!root.querySelector("[data-lb-melted]"), "melted before anything moved") : undefined,
      destroy: () => springs.forEach((s) => s.stop()),
    };
  },

  "blur-scroll": (root) => scrolls(root),
  "blur-edge": (root) => scrolls(root),

  "blur-lens": (root) => {
    const thumb = root.querySelector<HTMLElement>("[data-thumb]")!;
    // Transitioned: --lb-lens is registered, so it eases from glass to lens
    const set = (lens: boolean) => thumb.style.setProperty("--lb-lens", lens ? "1" : "0");
    const lens = () => Number(getComputedStyle(thumb).getPropertyValue("--lb-lens"));
    return {
      steps: [() => set(true), () => set(false)],
      check: (step) => (step < 0 ? undefined : expect(lens() === (step === 0 ? 1 : 0), `--lb-lens is ${lens()}`)),
    };
  },

  "blur-clipped": (root) => {
    const glass = root.querySelector<HTMLElement>("[data-mover]")!;
    const slide = mover(glass, { duration: 0.9, bounce: 0.2 });
    return {
      steps: [() => slide.to({ x: 200, y: 140 }), () => slide.to({ x: 0, y: 0 })],
      check: (step) => {
        if (step < 0) return undefined;
        const { x, y } = slide.values();
        const [tx, ty] = step === 0 ? [200, 140] : [0, 0];
        return expect(
          Math.abs(x - tx) < 0.5 && Math.abs(y - ty) < 0.5,
          `the glass is at ${x.toFixed(1)}, ${y.toFixed(1)}`,
        );
      },
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
    check: (step: number) => {
      if (step < 0) return undefined;
      const end = scroller.scrollHeight - scroller.clientHeight;
      return step === 0
        ? expect(scroller.scrollTop >= end - 1, `scrolled to ${scroller.scrollTop} of ${end}`)
        : expect(scroller.scrollTop <= 1, `scrolled to ${scroller.scrollTop}, not the top`);
    },
  };
}
