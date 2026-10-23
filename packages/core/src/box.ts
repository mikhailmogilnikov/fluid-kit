/**
 * Boxes as the browser draws them: where an element is, its size, and its corners, read so that
 * something else can take its shape (a morph's shape, an indicator over it). Corners are circular,
 * never an oval, and fitted the way the browser fits them; their shape, where `corner-shape` is
 * drawn, is a superellipse exponent, so it interpolates.
 */

/** Corner radii, clockwise from the top left */
export type Radii = [number, number, number, number];

/**
 * A box on screen, its corners' radii, and their shape as a superellipse exponent (the top left
 * one's: a box with corners of different shapes is rare enough)
 */
export type Box = { x: number; y: number; width: number; height: number; radii: Radii; shape: number };

/** To a hundredth of a pixel, so float noise doesn't reach the style */
export const px = (v: number) => `${Math.round(v * 100) / 100}px`;

/**
 * A computed corner radius (`10px`, `10%`, `10px 20px`) as one circular radius: a percent of the
 * box's width across and its height down, the smaller of the two, so a corner is never an oval
 */
export const cornerOf = (value: string, width: number, height: number) => {
  const [across, down = across] = value.trim().split(/\s+/);
  const resolve = (v: string | undefined, side: number) =>
    !v ? 0 : v.endsWith("%") ? (parseFloat(v) / 100) * side : parseFloat(v) || 0;
  return Math.max(0, Math.min(resolve(across, width), resolve(down, height)));
};

/**
 * Radii as the browser draws them in a box: where two corners on a side ask for more than the side
 * has, all of them shrink by the same factor (so a capsule's `9999px` is half its height)
 */
export const fitRadii = (r: Radii, width: number, height: number): Radii => {
  const room = (side: number, a: number, b: number) => (a + b > 0 ? side / (a + b) : Infinity);
  const f = Math.min(
    1,
    room(width, r[0], r[1]),
    room(width, r[3], r[2]),
    room(height, r[0], r[3]),
    room(height, r[1], r[2]),
  );
  return f < 1 ? (r.map((v) => v * f) as Radii) : r;
};

/** An element's corners from its computed style, in a box of that size, fitted */
export const radiiOf = (style: CSSStyleDeclaration, width: number, height: number): Radii =>
  fitRadii(
    [
      cornerOf(style.borderTopLeftRadius, width, height),
      cornerOf(style.borderTopRightRadius, width, height),
      cornerOf(style.borderBottomRightRadius, width, height),
      cornerOf(style.borderBottomLeftRadius, width, height),
    ],
    width,
    height,
  );

/** Radii as CSS, one value when they're all the same */
export const radiiCss = (r: Radii, scale = 1) =>
  r.every((v) => v === r[0]) ? px(r[0] / scale) : r.map((v) => px(v / scale)).join(" ");

/**
 * `corner-shape` as a superellipse exponent: round 1, squircle 2, bevel 0, scoop -1. Square and
 * notch are infinite in CSS; a large exponent draws them all but exactly and still interpolates.
 */
const CORNER_SHAPES: Record<string, number> = { round: 1, squircle: 2, bevel: 0, scoop: -1, square: 8, notch: -8 };
const exponentOf = (value: string) => {
  const v = value.trim().toLowerCase();
  if (v in CORNER_SHAPES) return CORNER_SHAPES[v];
  const arg = /^superellipse\(\s*([^)]*?)\s*\)$/.exec(v)?.[1];
  if (arg === "infinity") return 8;
  if (arg === "-infinity") return -8;
  const k = arg === undefined ? NaN : parseFloat(arg);
  return Number.isFinite(k) ? Math.min(8, Math.max(-8, k)) : 1;
};

/** The top-left corner's shape from a computed style: the longhand where it's computed, else the shorthand's first */
export const cornerShapeOf = (style: CSSStyleDeclaration) =>
  exponentOf(
    style.getPropertyValue("corner-top-left-shape") ||
      (style
        .getPropertyValue("corner-shape")
        .trim()
        .match(/^\S+\([^)]*\)|^\S+/)?.[0] ??
        "") ||
      "round",
  );

/** Whether corners can have shapes in that window; where they can't, they're round and `corner-shape` is left alone */
export const drawsCornerShape = (win: Window & typeof globalThis) =>
  win.CSS?.supports?.("corner-shape", "squircle") ?? false;

/**
 * An element's inline transforms off for a moment: a control just pressed is still swollen or
 * pulled, something flying is moved by its script. Its stylesheet's stay: they're where it is.
 * Put back in the same task, so nothing in between is ever painted.
 */
export const still = <T>(el: HTMLElement, read: () => T, to = ""): T => {
  const { transform, scale, translate, rotate } = el.style;
  el.style.transform = el.style.scale = el.style.translate = el.style.rotate = to;
  const value = read();
  Object.assign(el.style, { transform, scale, translate, rotate });
  return value;
};

/** An element's box on screen, with its corners' radii and the top-left one's shape */
export const measureBox = (el: HTMLElement, cornerShapes: boolean): Box => {
  const r = el.getBoundingClientRect();
  const style = (el.ownerDocument.defaultView ?? window).getComputedStyle(el);
  return {
    x: r.left,
    y: r.top,
    width: r.width,
    height: r.height,
    radii: radiiOf(style, r.width, r.height),
    shape: cornerShapes ? cornerShapeOf(style) : 1,
  };
};
