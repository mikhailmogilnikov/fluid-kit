import { SpringAnimator } from "@fluidkit/core";

/** What a case's setup gives back: its steps, in the order of its `steps` labels, and its cleanup */
export type Run = { steps?: Array<() => void>; destroy?: () => void };

/** What the playground lends a case: timers that follow the speed and end with the case */
export type Kit = {
  /** `fn` after `ms`, as the springs run: four times later in slow motion. Cleared on leaving */
  later(fn: () => void, ms: number): void;
  /** Run on leaving the case */
  cleanup(fn: () => void): void;
  /**
   * What the step bar would do next was done another way (a lift closed by a press on its dim,
   * the bar under its modal out of reach): the bar moves past it
   */
  skip(step: string): void;
};

export type Setup = (root: HTMLElement, kit: Kit) => Run | void;

/** Milliseconds of animation time as wall-clock time at the current speed */
export const scaled = (ms: number) => ms / SpringAnimator.timeScale;
