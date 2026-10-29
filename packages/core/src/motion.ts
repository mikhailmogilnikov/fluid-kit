import { step, type SpringParams } from "./springAnimator.js";

/**
 * Motion as Apple's platforms move: springs by name, and the ways an element comes in and goes
 * out, each a function that gives the preset and, given options, tunes it, as SwiftUI's
 * `.snappy(duration:extraBounce:)` does. They're plain values: a spring is the `SpringParams` every
 * package's `spring` takes, a transition what an element looks like at the far end. `springCss`
 * writes a spring for CSS.
 */

/** A spring preset tuned: its pace, and more bounce or less */
export type SpringOptions = {
  /** Perceptual duration, seconds: the preset's unless given */
  duration?: number;
  /** Added to the preset's bounce (taken off, below 0), the sum kept from 0 to 0.99 */
  extraBounce?: number;
};

const preset =
  (duration: number, bounce: number) =>
  ({ duration: pace = duration, extraBounce = 0 }: SpringOptions = {}): SpringParams => ({
    duration: pace,
    bounce: Math.min(0.99, Math.max(0, bounce + extraBounce)),
  });

/**
 * Springs by what they're for. Quicker than SwiftUI's own (half a second there): on the web,
 * where they move rows and buttons more than whole screens, that pace reads as sluggish.
 */
export const springs = {
  /** No overshoot: fades, colors, whatever shouldn't go past where it's going */
  smooth: preset(0.3, 0),
  /** A touch of bounce, landing crisp: lists, reorders, sizes */
  snappy: preset(0.26, 0.15),
  /** A bounce you see: things popping in, toggles */
  bouncy: preset(0.36, 0.3),
  /** Quick and close: something following a finger, as SwiftUI's `interactiveSpring` */
  interactive: preset(0.15, 0.14),
};

/**
 * What an element looks like at the far end of coming in or going out: transparent, smaller,
 * blurred, moved away. `opacity` is of its own opacity and `scale` of its own scale (1 is as it
 * is), `blur` is in px, `x` and `y` are px added to its own translation. What's left out is as it is.
 */
export type TransitionParams = { opacity?: number; scale?: number; blur?: number; x?: number; y?: number };

/**
 * Ways to come in and go out. Combine them by spreading: `{ ...transitions.scale(0.9), blur: 4 }`.
 * A push is two of them, in from one side and out to the other: `move({ y: 12 })` coming in,
 * `move({ y: -12 })` going out.
 */
export const transitions = {
  /** Fades */
  opacity: (): TransitionParams => ({ opacity: 0 }),
  /** Fades, a little smaller: as iOS puts a row in a list */
  scale: (scale = 0.96): TransitionParams => ({ opacity: 0, scale }),
  /** Fades out of focus, smaller: as iOS swaps one content for another (`.blurReplace`) */
  blurReplace: ({ blur = 8, scale = 0.9 }: { blur?: number; scale?: number } = {}): TransitionParams => ({
    opacity: 0,
    scale,
    blur,
  }),
  /** Fades, moved by that much: from below unless told */
  move: ({ x = 0, y = 12 }: { x?: number; y?: number } = {}): TransitionParams => ({ opacity: 0, x, y }),
};

/** Steps the curve is solved in, seconds: finer than any frame */
const DT = 1 / 240;
/** Where it's done, of the way: a tenth of a percent, a tenth of a pixel on a hundred */
const REST = 0.001;
/** How far a point dropped may be from the line kept, of the way */
const TOLERANCE = 0.001;

const round = (n: number, digits: number) => {
  const r = Math.round(n * 10 ** digits) / 10 ** digits;
  return Object.is(r, -0) ? 0 : r;
};

/** Keeps the points the curve turns at: those off the line through the ones kept around them */
function simplify(points: [number, number][]): [number, number][] {
  const keep = new Set([0, points.length - 1]);
  const split = (from: number, to: number) => {
    const [t0, x0] = points[from];
    const [t1, x1] = points[to];
    let far = -1;
    let most = TOLERANCE;
    for (let i = from + 1; i < to; i++) {
      const [t, x] = points[i];
      const off = Math.abs(x - (x0 + ((x1 - x0) * (t - t0)) / (t1 - t0)));
      if (off > most) {
        most = off;
        far = i;
      }
    }
    if (far < 0) return;
    keep.add(far);
    split(from, far);
    split(far, to);
  };
  split(0, points.length - 1);
  return points.filter((_, i) => keep.has(i));
}

/**
 * A spring for CSS: an easing that's the spring's own curve (`linear()`, from rest, solved as the
 * springs here are), and how long it takes to come to rest, longer than its perceptual duration.
 * `transition: scale ${duration} ${easing}`. A CSS transition interrupted starts over from where
 * it is with no speed, which the springs here don't.
 */
export function springCss(params: SpringParams): { duration: string; easing: string } {
  const { duration, bounce, settle = bounce } = params;
  const omega = (2 * Math.PI) / duration;
  const zeta = (b: number) => Math.min(1, Math.max(0, 1 - b));
  const s = { x: 0, v: 0 };
  let turned = false;
  let t = 0;
  const points: [number, number][] = [[0, 0]];
  // From rest to 1, the bounce changed once it turns, as a spring here does
  while (Math.hypot(s.x - 1, s.v / omega) > REST && t < 10) {
    const before = s.v;
    step(s, 1, omega, zeta(turned ? settle : bounce), DT);
    if (!turned && before !== 0 && Math.sign(s.v) !== Math.sign(before)) turned = true;
    t += DT;
    points.push([t, s.x]);
  }
  points[points.length - 1][1] = 1;
  const kept = simplify(points);
  const stops = kept.map(([at, x], i) =>
    i === 0 ? "0" : i === kept.length - 1 ? "1" : `${round(x, 4)} ${round((at / t) * 100, 2)}%`,
  );
  return { duration: `${round(t, 3)}s`, easing: `linear(${stops.join(", ")})` };
}
