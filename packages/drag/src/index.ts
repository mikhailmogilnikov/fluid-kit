import { SpringAnimator, px, swallowClick, type SpringParams } from "@fluidkit/core";

/**
 * Drag: one element moved by a pointer, along one axis or both, as iOS moves its sheets, the rows
 * of a list swiped open, the thumb of a switch, a picture-in-picture thrown into a corner.
 *
 * Under the pointer it follows exactly; past its bounds it pulls back like rubber, less the further
 * it goes. Let go, it heads for one of its snap points on a spring that starts at the pointer's own
 * speed: the point nearest to where it would have come to rest by itself, slowing down as a scroll
 * does. So a flick reaches a far point and a slow drag settles on the near one. With no snap points
 * it comes to rest where it would have, within its bounds. Caught on its way, it stops under the
 * pointer and is dragged from there; let go without being moved, it goes on where it was going and
 * the tap is the page's click (a switch tapped twice quickly flips back).
 *
 * A drag starts once the pointer has moved a few pixels along its axis: moving across it first,
 * it's the page's (a finger scrolling a list past a row that swipes sideways). On touch the browser
 * gets the other axis: the handle's `touch-action` is set to pan along it, or to none for both.
 * The click that would follow a drag is dropped, so a dragged button isn't pressed. Nothing starts
 * on a text field. In nested handles (rows that swipe in a sheet) the innermost drag that starts has
 * the pointer, alone.
 *
 * Positions are offsets from where the element is laid out, in its own pixels (a scaled container
 * works), written to its inline `translate` and nothing else: its `transform` and `scale` stay free
 * for the page and for press behaviors. While a pointer drags it, it's marked `data-dragging`.
 * Snap points and bounds can be functions: read again when the element, its parent or the window
 * is resized, so a sheet's "half the screen" stays half.
 */

export type DragAxis = "x" | "y" | "both";
export type DragPoint = { x: number; y: number };
/** Offsets along the axis (`x` or `y`), or points (`both`) */
export type DragSnaps = readonly number[] | readonly DragPoint[];
/** The range of offsets on each axis it moves along; past them, it's rubber */
export type DragBounds = { x?: readonly [number, number]; y?: readonly [number, number] };

export type DragOptions = {
  /** What moves: its inline `translate` is the drag's */
  element: HTMLElement;
  /** What's grabbed, such as a sheet's grabber; the element itself unless given */
  handle?: HTMLElement;
  /** Along `x`, `y`, or `both` (the default) */
  axis?: DragAxis;
  /** Where it may come to rest; a function is read again on a resize */
  snaps?: DragSnaps | (() => DragSnaps);
  /** How far it moves before it's rubber; the farthest snap points unless given, else unbounded */
  bounds?: DragBounds | (() => DragBounds);
  /** The snap point it starts at; the first unless given */
  initial?: number;
  /**
   * How hard it pulls back past its bounds, dragged or overshooting on its spring: 0.55 as iOS has
   * it; 0 stops it there
   */
  rubberband?: number;
  /**
   * How quickly something let go would slow down by itself, per millisecond: 0.998 as a scroll
   * does, 0.99 sooner. What a flick reaches is judged by it
   */
  deceleration?: number;
  /** The spring it settles on; `defaultDragSpring` unless given */
  spring?: SpringParams;
  /** Called when a pointer starts dragging it, or catches it on its way */
  onStart?: () => void;
  /** Called with its offset and speed (px/s) whenever it moves: dragged, settling, put somewhere */
  onMove?: (position: DragPoint, velocity: DragPoint) => void;
  /** Called when it's let go, with the snap point it heads for (`null` with none) */
  onEnd?: (snap: number | null) => void;
  /** Called when it has come to rest */
  onRest?: () => void;
};

/**
 * `instant`: there at once, as with reduced motion. `velocity`: the speed it sets off at, px/s (a
 * number along the axis), the one it has unless given
 */
export type DragMove = { instant?: boolean; velocity?: number | DragPoint };

export type Drag = {
  /** Its offset now */
  readonly position: DragPoint;
  /** Its speed now, px/s */
  readonly velocity: DragPoint;
  /** A pointer is dragging it */
  readonly dragging: boolean;
  /** Dragged, or on its way somewhere */
  readonly moving: boolean;
  /** The snap point it's at or heads for; `null` when it was put elsewhere, or has none */
  readonly current: number | null;
  /** Not dragged while true; a drag under way is let go */
  disabled: boolean;
  /** To snap point `index` */
  snap(index: number, move?: DragMove): void;
  /** To an offset, within its bounds: a number along the axis, or a point */
  to(position: number | DragPoint, move?: DragMove): void;
  /** Reads the snap points and bounds again, and follows them */
  update(): void;
  destroy(): void;
};

/**
 * The spring it settles on unless given another: no bounce, yet a flick's speed carries it past
 * its point once and back, as iOS sheets go
 */
export const defaultDragSpring: SpringParams = { duration: 0.4, bounce: 0 };

const RUBBERBAND = 0.55;
const DECELERATION = 0.998;
/** How far a pointer moves before it drags, px: a finger is less exact than a mouse */
const SLOP = 4;
const TOUCH_SLOP = 8;
/** The pointer's speed is how far it went in this long before it let go, ms */
const VELOCITY_WINDOW = 100;
/** How long after a drag the click it would make may still come, ms */
const CLICK_WINDOW = 400;
/** Where a pointer down doesn't drag: text is selected there */
const NO_DRAG = "input, textarea, select, [contenteditable]:not([contenteditable='false'])";
/** On the element while a pointer drags it: the page's to style */
const DRAGGING = "data-dragging";
/** Where it's done: a quarter of a pixel */
const PRECISION = 0.25;
const ZERO: Readonly<DragPoint> = Object.freeze({ x: 0, y: 0 });

/** How far a pull of `over` px past an edge shows, for an element `size` px long (iOS's curve) */
const band = (over: number, size: number, c: number) => (1 - 1 / ((over * c) / size + 1)) * size;
/** The pull that shows `shown` px past an edge: `band` undone */
const unband = (shown: number, size: number, c: number) => (size / c) * (shown / (size - Math.min(shown, size * 0.99)));

/** Where something let go at `v` px/s comes to rest by itself, slowing by `rate` each millisecond */
const project = (v: number, rate: number) => ((v / 1000) * rate) / (1 - rate);

type Sample = { t: number; x: number; y: number };

/** Pointers a drag has: in nested handles the innermost drag that starts takes one, alone */
const claimed = new Set<number>();

export function createDrag(options: DragOptions): Drag {
  const { element, handle = element, axis = "both", onStart, onMove, onEnd, onRest } = options;
  const doc = element.ownerDocument;
  const win = doc.defaultView ?? window;
  const reduced = win.matchMedia("(prefers-reduced-motion: reduce)");
  const rubber = Math.max(0, options.rubberband ?? RUBBERBAND);
  const rate = Math.min(0.9999, Math.max(0, options.deceleration ?? DECELERATION));
  const onX = axis !== "y";
  const onY = axis !== "x";
  const own = { translate: element.style.translate, touchAction: handle.style.touchAction };

  /** Along the axis it moves on, or both */
  const point = (v: number | DragPoint): DragPoint =>
    typeof v === "number"
      ? { x: axis === "y" ? 0 : v, y: axis === "y" ? v : 0 }
      : { x: onX ? v.x : 0, y: onY ? v.y : 0 };

  let snaps: DragPoint[] = [];
  let bounds = { x: [0, 0], y: [0, 0] };
  /** Its size, how far its rubber can stretch */
  let size = { x: 0, y: 0 };
  /** The snap points, bounds and size as they are now */
  const read = () => {
    const given = typeof options.snaps === "function" ? options.snaps() : (options.snaps ?? []);
    snaps = given.map(point);
    const b = typeof options.bounds === "function" ? options.bounds() : options.bounds;
    const range = (k: "x" | "y", on: boolean) => {
      if (!on) return [0, 0];
      const set = b?.[k];
      if (set) return [Math.min(set[0], set[1]), Math.max(set[0], set[1])];
      if (!snaps.length) return [-Infinity, Infinity];
      const at = snaps.map((s) => s[k]);
      return [Math.min(...at), Math.max(...at)];
    };
    bounds = { x: range("x", onX), y: range("y", onY) };
    size = { x: element.offsetWidth, y: element.offsetHeight };
  };

  /** A pull to where it shows, past its bounds stretched as rubber */
  const stretch = (raw: DragPoint): DragPoint => {
    const one = (v: number, [lo, hi]: number[], s: number) => {
      if (v < lo) return rubber && s ? lo - band(lo - v, s, rubber) : lo;
      if (v > hi) return rubber && s ? hi + band(v - hi, s, rubber) : hi;
      return v;
    };
    return { x: one(raw.x, bounds.x, size.x), y: one(raw.y, bounds.y, size.y) };
  };
  /** Where it shows to the pull that put it there: caught past its bounds, it isn't pulled back */
  const unstretch = (shown: DragPoint): DragPoint => {
    const one = (v: number, [lo, hi]: number[], s: number) => {
      if (!rubber || !s) return v;
      if (v < lo) return lo - unband(lo - v, s, rubber);
      if (v > hi) return hi + unband(v - hi, s, rubber);
      return v;
    };
    return { x: one(shown.x, bounds.x, size.x), y: one(shown.y, bounds.y, size.y) };
  };
  const clamp = (p: DragPoint): DragPoint => ({
    x: Math.min(bounds.x[1], Math.max(bounds.x[0], p.x)),
    y: Math.min(bounds.y[1], Math.max(bounds.y[0], p.y)),
  });

  read();
  const at = (index: number) => Math.min(snaps.length - 1, Math.max(0, Math.round(index)));
  let current: number | null = snaps.length ? at(options.initial ?? 0) : null;
  let position: DragPoint = current === null ? { ...ZERO } : { ...snaps[current] };
  let velocity: DragPoint = { ...ZERO };
  /** Where it heads, or last headed: what a flight keeps going to when things are resized */
  let goal: DragPoint = position;
  let dragging = false;
  let moving = false;
  let disabled = false;
  let destroyed = false;

  const write = (p: DragPoint, v: DragPoint) => {
    position = { x: p.x, y: p.y };
    velocity = { x: v.x, y: v.y };
    element.style.translate = `${px(position.x)} ${px(position.y)}`;
    // Copies: what the page does with them is no business of the drag's
    onMove?.({ ...position }, { ...velocity });
  };

  // A spring calls back once as it's made, before it's there; its first frame is written below
  let ready = false;
  const spring = new SpringAnimator(
    { x: position.x, y: position.y },
    options.spring ?? defaultDragSpring,
    (p) => {
      // A spring that swings past the bounds is rubber there too
      if (ready) write(stretch(p), spring.velocities());
    },
    () => {
      moving = false;
      velocity = { ...ZERO };
      onRest?.();
    },
    PRECISION,
  );
  ready = true;

  /** Off to `target` at `v`, or there at once */
  const settle = (target: DragPoint, v: DragPoint, instant = false) => {
    goal = target;
    if (instant || reduced.matches) {
      // Its spring is left where it was headed: the next flight sets off from here, with `to`
      const was = moving;
      spring.stop();
      spring.jump(target, ZERO);
      moving = false;
      write(target, ZERO);
      if (was) onRest?.();
      return;
    }
    moving = true;
    spring.to(target, undefined, v);
  };

  /** Where it comes to rest let go here at `v`: the snap point nearest to where it would stop */
  const aim = (from: DragPoint, v: DragPoint) => {
    const end = { x: from.x + project(v.x, rate), y: from.y + project(v.y, rate) };
    if (!snaps.length) return { index: null, target: clamp(end) };
    let index = 0;
    let best = Infinity;
    snaps.forEach((s, i) => {
      const d = Math.hypot(s.x - end.x, s.y - end.y);
      if (d < best) [best, index] = [d, i];
    });
    return { index, target: snaps[index] };
  };

  /**
   * Screen pixels per pixel of its own: how its ancestors scale it. Its own `scale` and `transform`
   * don't count: they don't scale its `translate`
   */
  const scaleOf = () => {
    const parent = element.parentElement;
    if (!parent?.offsetWidth) return 1;
    return parent.getBoundingClientRect().width / parent.offsetWidth || 1;
  };

  // On touch the browser keeps the other axis, and pinching
  handle.style.touchAction = axis === "x" ? "pan-y pinch-zoom" : axis === "y" ? "pan-x pinch-zoom" : "none";

  /** The pointer down on the handle, until it's let go or given up */
  let pointer: {
    id: number;
    touch: boolean;
    /** Where it was when the drag started, on screen */
    x0: number;
    y0: number;
    /** The pull it started from */
    from: DragPoint;
    /** Screen pixels per pixel of the element */
    scale: number;
    /** The drag has it: the element follows it, or is held, caught on its way */
    started: boolean;
    /** It has moved past the slop: a drag, not a tap */
    moved: boolean;
    /** Where it was lately, for its speed */
    samples: Sample[];
  } | null = null;

  const listen = (on: boolean) => {
    if (on) {
      win.addEventListener("pointermove", moved, true);
      win.addEventListener("pointerup", up, true);
      win.addEventListener("pointercancel", cancelled, true);
      doc.addEventListener("selectstart", unselect, true);
      return;
    }
    win.removeEventListener("pointermove", moved, true);
    win.removeEventListener("pointerup", up, true);
    win.removeEventListener("pointercancel", cancelled, true);
    doc.removeEventListener("selectstart", unselect, true);
  };

  const unselect = (e: Event) => {
    if (pointer?.started) e.preventDefault();
  };

  /**
   * The pointer is done: let go at `v`, or with `null` nothing else happens (`snap()`, `to()` and
   * `destroy()` take over)
   */
  const finish = (v: DragPoint | null) => {
    const was = pointer;
    pointer = null;
    listen(false);
    if (!was?.started) return;
    claimed.delete(was.id);
    dragging = false;
    element.removeAttribute(DRAGGING);
    try {
      handle.releasePointerCapture(was.id);
    } catch {
      // Not captured, or gone
    }
    if (!v) return;
    // Caught, and let go without being moved: a tap. It goes on where it was going; the click is
    // the page's
    if (!was.moved) {
      settle(goal, ZERO);
      return;
    }
    const { index, target } = aim(position, v);
    current = index;
    onEnd?.(index);
    settle(target, v);
  };

  /** The drag takes the pointer: dragged from here (`moved`), or caught on its way and held */
  const begin = (e: PointerEvent, moved: boolean) => {
    if (!pointer) return;
    // A drag inside its handle has it already
    if (claimed.has(pointer.id)) {
      finish(null);
      return;
    }
    claimed.add(pointer.id);
    read();
    spring.stop();
    dragging = true;
    moving = true;
    pointer.started = true;
    pointer.moved = moved;
    pointer.x0 = e.clientX;
    pointer.y0 = e.clientY;
    pointer.from = unstretch(position);
    pointer.samples = [{ t: e.timeStamp, x: position.x, y: position.y }];
    try {
      handle.setPointerCapture(e.pointerId);
    } catch {
      // A pointer that's gone already
    }
    element.setAttribute(DRAGGING, "");
    doc.getSelection()?.removeAllRanges();
    onStart?.();
  };

  /** The speed from the first sample to the last, px/s */
  const speed = (samples: Sample[]): DragPoint => {
    if (samples.length < 2) return { ...ZERO };
    const a = samples[0];
    const b = samples[samples.length - 1];
    const dt = (b.t - a.t) / 1000;
    return dt > 0 ? { x: (b.x - a.x) / dt, y: (b.y - a.y) / dt } : { ...ZERO };
  };

  const down = (e: PointerEvent) => {
    if (disabled || destroyed || pointer || !e.isPrimary) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as Element | null)?.closest?.(NO_DRAG)) return;
    pointer = {
      id: e.pointerId,
      touch: e.pointerType === "touch",
      x0: e.clientX,
      y0: e.clientY,
      from: position,
      scale: scaleOf(),
      started: false,
      moved: false,
      samples: [],
    };
    listen(true);
    // Caught on its way: it stops under the pointer
    if (moving) begin(e, false);
  };

  const moved = (e: PointerEvent) => {
    if (!pointer || e.pointerId !== pointer.id) return;
    const dx = (e.clientX - pointer.x0) / pointer.scale;
    const dy = (e.clientY - pointer.y0) / pointer.scale;
    if (!pointer.moved) {
      if (Math.hypot(dx, dy) < (pointer.touch ? TOUCH_SLOP : SLOP)) return;
      if (pointer.started) {
        // Caught, and now dragged: from here
        pointer.moved = true;
        pointer.x0 = e.clientX;
        pointer.y0 = e.clientY;
        pointer.samples = [{ t: e.timeStamp, x: position.x, y: position.y }];
        return;
      }
      // Across its axis first: the page's, such as a list scrolled past a row that swipes
      if ((axis === "x" && Math.abs(dy) > Math.abs(dx)) || (axis === "y" && Math.abs(dx) > Math.abs(dy))) {
        finish(null);
        return;
      }
      begin(e, true);
      return;
    }
    const raw = { x: pointer.from.x + (onX ? dx : 0), y: pointer.from.y + (onY ? dy : 0) };
    const shown = stretch(raw);
    const samples = pointer.samples;
    samples.push({ t: e.timeStamp, x: shown.x, y: shown.y });
    while (samples.length > 2 && samples[0].t < e.timeStamp - VELOCITY_WINDOW) samples.shift();
    // The spring holds the pull, as it shows it stretched: let go past the bounds, it sets off from there
    spring.jump(raw);
    write(shown, speed(samples));
  };

  /** A drag ends in a click where it's let go: not a press of what's under it */
  let unswallow = () => {};

  const up = (e: PointerEvent) => {
    if (!pointer || e.pointerId !== pointer.id) return;
    if (pointer.moved) {
      unswallow();
      unswallow = swallowClick(doc, null, CLICK_WINDOW);
    }
    // Its speed as it was let go: a pointer that stopped a while before has none
    const v = pointer.started ? speed(pointer.samples.filter((s) => s.t >= e.timeStamp - VELOCITY_WINDOW)) : null;
    finish(v);
  };

  /** Taken by the browser (a scroll, a gesture of its own): it settles from where it is */
  const cancelled = (e: PointerEvent) => {
    if (!pointer || e.pointerId !== pointer.id) return;
    finish(pointer.started ? { ...ZERO } : null);
  };

  /** A link or an image in the handle isn't dragged off by the browser while a pointer is down */
  const nativeDrag = (e: DragEvent) => {
    if (pointer) e.preventDefault();
  };

  handle.addEventListener("pointerdown", down);
  handle.addEventListener("dragstart", nativeDrag);

  /** Its snap points or bounds moved: it follows, to the same point, or within them */
  const relayout = () => {
    if (destroyed) return;
    read();
    if (dragging) return;
    if (current !== null) current = snaps.length ? at(current) : null;
    const target = current !== null ? snaps[current] : clamp(goal);
    if (moving) {
      goal = target;
      spring.retarget(target);
    } else if (target.x !== position.x || target.y !== position.y) settle(target, ZERO, true);
  };
  const resized = new ResizeObserver(() => relayout());
  resized.observe(element);
  if (element.parentElement) resized.observe(element.parentElement);
  // Snap points from the window's size, such as a sheet's "half the screen"
  win.addEventListener("resize", relayout);

  write(position, ZERO);

  return {
    get position() {
      return { ...position };
    },
    get velocity() {
      return { ...velocity };
    },
    get dragging() {
      return dragging;
    },
    get moving() {
      return moving;
    },
    get current() {
      return current;
    },
    get disabled() {
      return disabled;
    },
    set disabled(value) {
      disabled = value;
      if (value && pointer) finish(pointer.started ? { ...ZERO } : null);
    },
    snap(index, move = {}) {
      if (destroyed || !snaps.length) return;
      if (pointer) finish(null);
      current = at(index);
      settle(snaps[current], move.velocity === undefined ? velocity : point(move.velocity), move.instant);
    },
    to(target, move = {}) {
      if (destroyed) return;
      if (pointer) finish(null);
      current = null;
      settle(clamp(point(target)), move.velocity === undefined ? velocity : point(move.velocity), move.instant);
    },
    update: relayout,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (pointer) finish(null);
      spring.stop();
      unswallow();
      resized.disconnect();
      win.removeEventListener("resize", relayout);
      handle.removeEventListener("pointerdown", down);
      handle.removeEventListener("dragstart", nativeDrag);
      element.removeAttribute(DRAGGING);
      element.style.translate = own.translate;
      handle.style.touchAction = own.touchAction;
    },
  };
}
