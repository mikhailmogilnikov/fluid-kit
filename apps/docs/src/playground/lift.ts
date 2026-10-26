import { createIndicator } from "@fluidkit/indicator";
import { createLift, type Lift, type LiftOptions } from "@fluidkit/lift";
import type { Kit, Setup } from "./kit";

/**
 * Every lift case: each target lifts with the case's menu, its highlight an indicator. Gives the
 * lifts back, in the targets' order
 */
const lifts = (root: HTMLElement, kit: Kit, options: Partial<LiftOptions> = {}) => {
  const menu = root.querySelector<HTMLElement>("[data-menu]")!;
  const list = menu.matches(".lc-menu") ? menu : menu.querySelector<HTMLElement>(".lc-menu")!;
  const highlight = createIndicator({
    container: list,
    indicator: list.querySelector<HTMLElement>("[data-highlight]")!,
    items: "[data-item]",
  });
  const made: Lift[] = [...root.querySelectorAll<HTMLElement>("[data-target]")].map((element) =>
    createLift({
      element,
      menu,
      onHighlight: (item) => highlight.to(item && list.contains(item) ? item : null),
      onClose: () => {
        highlight.to(null, { instant: true });
        // Closed by a press on the dim or Escape: the step bar, under the modal, moves past its Close
        kit.skip("Close");
      },
      ...options,
    }),
  );
  kit.cleanup(() => {
    made.forEach((l) => l.destroy());
    highlight.destroy();
  });
  return made;
};

/** Where the steps want it on screen before it lifts: the menu's room is the screen's, not the stage's */
const into = (el: HTMLElement, block: ScrollLogicalPosition) => el.scrollIntoView({ block, behavior: "instant" });

const one: (block: ScrollLogicalPosition, options?: Partial<LiftOptions>) => Setup =
  (block, options) => (root, kit) => {
    const [lift] = lifts(root, kit, options);
    const target = root.querySelector<HTMLElement>("[data-target]")!;
    return {
      steps: [
        () => {
          into(target, block);
          lift.open();
        },
        () => lift.close(),
      ],
    };
  };

export const lift: Record<string, Setup> = {
  // The link's preview: a page of its own, from a template, bigger than the link
  "lift-preview": (root, kit) => {
    const template = root.querySelector<HTMLTemplateElement>("[data-preview]")!;
    const [l] = lifts(root, kit, {
      preview: () => template.content.firstElementChild!.cloneNode(true) as HTMLElement,
    });
    // A tap on the link isn't a trip away from the playground
    root.querySelector("[data-target]")!.addEventListener("click", (e) => e.preventDefault());
    return { steps: [() => l.open(), () => l.close()] };
  },

  "lift-keys": (root, kit) => {
    const [l] = lifts(root, kit);
    return { steps: [() => l.open()] };
  },

  // Open, the page scrolled from outside it, then closed: one step, the modal over the step bar
  "lift-page-scrolls": (root, kit) => {
    const [l] = lifts(root, kit);
    const target = root.querySelector<HTMLElement>("[data-target]")!;
    return {
      steps: [
        () => {
          into(target, "center");
          l.open();
          kit.later(() => scrollBy({ top: 140, behavior: "instant" }), 700);
          kit.later(() => l.close(), 1100);
        },
      ],
    };
  },

  "lift-live": (root, kit) => {
    const [l] = lifts(root, kit);
    return { steps: [() => l.open(), () => l.close()] };
  },

  "lift-one-at-a-time": (root, kit) => {
    const [first, second] = lifts(root, kit);
    return {
      steps: [
        () => {
          first.open();
          kit.later(() => second.open(), 700);
          kit.later(() => second.close(), 1600);
        },
      ],
    };
  },

  "lift-below": one("center"),
  "lift-above": one("end"),
  // Asked for under it, with no room there: it moves up for the menu
  "lift-tall": one("end", { placement: "below" }),
  "lift-message": (root, kit) => {
    const made = lifts(root, kit);
    return { steps: [() => made[1].open(), () => made[1].close()] };
  },

  "lift-edges": (root, kit) => {
    const [left, right] = lifts(root, kit);
    return { steps: [() => left.open(), () => left.close(), () => right.open(), () => right.close()] };
  },

  // The row in the middle of the list as it's scrolled
  "lift-scrolled": (root, kit) => {
    const made = lifts(root, kit);
    const scroller = root.querySelector<HTMLElement>("[data-scroller]")!;
    const rows = [...root.querySelectorAll<HTMLElement>("[data-target]")];
    let open: Lift | null = null;
    return {
      steps: [
        () => scroller.scrollBy({ top: 220, behavior: "smooth" }),
        () => {
          const r = scroller.getBoundingClientRect();
          const mid = r.top + r.height / 2;
          const i = rows.findIndex((row) => {
            const b = row.getBoundingClientRect();
            return b.top <= mid && b.bottom >= mid;
          });
          open = made[Math.max(0, i)];
          open.open();
        },
        () => open?.close(),
      ],
    };
  },
};
