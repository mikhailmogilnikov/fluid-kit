import { SpringAnimator, holdSelection, px, still, swallowClick, type SpringParams } from "@fluidkit/core";

/**
 * Lift: a long press (or a right click, or the menu key) lifts an element above everything, the page
 * dimmed and blurred behind it, and opens a menu of yours beside it, as iOS's context menus do.
 *
 * What's lifted is a copy of the element, dressed as it's drawn (every computed style written on it,
 * so it looks the same out of its place), over the element, which is hidden where it is and keeps
 * its room: moved, a frame would reload and a video stop. For something live, or a bigger preview as
 * iOS shows, give `preview` an element of your own instead. They sit in a modal `<dialog>`, in the
 * top layer over any `overflow`, `z-index` and transform: the rest of the page is inert meanwhile,
 * Escape closes it and focus goes back. The dialog is the dim and the blur itself; the menu, yours,
 * is moved into it while it's open and put back after, its listeners kept.
 *
 * The menu opens under the element, or over it with no room under, its side by the element's side
 * of the screen, kept in from the edges; with room neither way the element moves up for it, as in
 * iOS. The same finger that lifted it can slide onto an item and let go there to choose it; let go
 * without moving, the menu stays open. Each item it's over is marked `data-highlighted` and handed
 * to `onHighlight`, for an indicator, say. A choice clicks the item, then the menu closes.
 *
 * The press: held still for `delay`, it opens; moved more than a few pixels, or taken by a scroll,
 * it doesn't. While it's held the element is marked `data-lifting` (for the page to show it giving a
 * little), lifted `data-lifted`; no text is selected and iOS shows no callout. The click a long
 * press would end in is dropped.
 *
 * Springs: the copy rises from where the element is drawn, a little bigger, the dim and the menu
 * coming in with it; closing, it settles exactly back on the element before the element is shown.
 * With reduced motion it's all at once.
 */

export type LiftPlacement = "auto" | "below" | "above";

export type LiftOptions = {
  /** What's held and lifted */
  element: HTMLElement;
  /** Your menu, opened beside it; without one, only the element is lifted */
  menu?: HTMLElement;
  /** Its items, as a selector in the menu: `[role="menuitem"], button, a[href]` unless given */
  items?: string;
  /** What's lifted instead of a copy: an element, or one made from the element */
  preview?: HTMLElement | ((element: HTMLElement) => HTMLElement);
  /** How long a press is held to lift it, ms: 500 unless given */
  delay?: number;
  /** How much bigger it's lifted: 1.04 unless given */
  scale?: number;
  /** How dark the page goes behind it, 0..1: 0.2 unless given */
  dim?: number;
  /** How blurred the page goes behind it, px: 12 unless given */
  blur?: number;
  /** Where the menu goes: under it or over it by the room there (`auto`), or one of them */
  placement?: LiftPlacement;
  /** The spring it rises on; `defaultLiftSpring` unless given */
  spring?: SpringParams;
  onOpen?: () => void;
  /** Called once it's closed, back in place */
  onClose?: () => void;
  /** Called with the item a finger is over while it slides on the menu, `null` off them */
  onHighlight?: (item: HTMLElement | null) => void;
  /** Called with the item chosen, before the menu closes */
  onSelect?: (item: HTMLElement) => void;
};

export type Lift = {
  /** Lifted, its menu open */
  readonly opened: boolean;
  /** Lifts it and opens the menu, its first item focused */
  open(): void;
  close(): void;
  destroy(): void;
};

/** A lift that rises a little past its height and settles: alive, not jelly */
export const defaultLiftSpring: SpringParams = { duration: 0.42, bounce: 0.18 };
/** Closing, it settles straight back */
const SETTLE: SpringParams = { duration: 0.32, bounce: 0 };

const DELAY = 500;
const SCALE = 1.04;
const DIM = 0.2;
const BLUR = 12;
/** How far a press moves before it's not a long press, px */
const SLOP = 8;
/** Kept between the menu, the element and the screen's edges, px */
const GAP = 10;
const MARGIN = 12;
const ITEMS = "[role='menuitem'], button, a[href]";
/** Not copied onto a copy's root: where it is and how it moves are the lift's */
const NOT_ROOT = new Set([
  "position",
  "inset",
  "top",
  "right",
  "bottom",
  "left",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "transform",
  "translate",
  "scale",
  "rotate",
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height",
  "z-index",
  "visibility",
  "will-change",
  "transition",
  "animation",
  "inset-block",
  "inset-inline",
  "margin-block",
  "margin-inline",
  // Aligned in its grid or flex box, it would be aligned in the dialog too: abspos boxes align
  "justify-self",
  "align-self",
  "place-self",
  "float",
  "inset-block-start",
  "inset-block-end",
  "inset-inline-start",
  "inset-inline-end",
  // A focus ring is the element's, focused: the copy isn't
  "outline",
  "outline-color",
  "outline-style",
  "outline-width",
  "outline-offset",
]);
/** Not copied anywhere: a copy doesn't animate */
const NEVER = /^(transition|animation)/;
const ZERO = { x: 0, y: 0, s: 1, p: 0 };

/** The rule a modal dialog's own backdrop needs to be clear, once per document */
const styled = new WeakSet<Document>();
const style = (doc: Document) => {
  if (styled.has(doc)) return;
  styled.add(doc);
  const rule = "dialog[data-fk-lift]::backdrop { background: transparent; }";
  const win = doc.defaultView;
  if (win && "adoptedStyleSheets" in doc && typeof win.CSSStyleSheet === "function") {
    const sheet = new win.CSSStyleSheet();
    sheet.replaceSync(rule);
    doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
    return;
  }
  const el = doc.createElement("style");
  el.textContent = rule;
  doc.head.append(el);
};

/** Every computed style of `from` written on `to`, and so down their trees: it looks the same anywhere */
function dress(from: Element, to: Element, root: boolean) {
  const win = from.ownerDocument.defaultView ?? window;
  if (from instanceof win.HTMLElement && to instanceof win.HTMLElement) {
    const computed = win.getComputedStyle(from);
    const out = to.style;
    for (let i = 0; i < computed.length; i++) {
      const name = computed[i];
      if (NEVER.test(name) || (root && NOT_ROOT.has(name))) continue;
      out.setProperty(name, computed.getPropertyValue(name));
    }
    out.setProperty("transition", "none");
    out.setProperty("animation", "none");
  }
  // A canvas's picture isn't in the copy: drawn again
  if (from instanceof win.HTMLCanvasElement && to instanceof win.HTMLCanvasElement) {
    to.getContext("2d")?.drawImage(from, 0, 0);
  }
  const a = from.children;
  const b = to.children;
  for (let i = 0; i < a.length && i < b.length; i++) dress(a[i], b[i], false);
}

export function createLift(options: LiftOptions): Lift {
  const { element, menu, onOpen, onClose, onHighlight, onSelect } = options;
  const doc = element.ownerDocument;
  const win = doc.defaultView ?? window;
  const items = options.items ?? ITEMS;
  const delay = options.delay ?? DELAY;
  const scale = options.scale ?? SCALE;
  const dim = options.dim ?? DIM;
  const blur = options.blur ?? BLUR;
  const placement = options.placement ?? "auto";
  const rise = options.spring ?? defaultLiftSpring;
  const reduced = win.matchMedia("(prefers-reduced-motion: reduce)");
  const own = { callout: element.style.getPropertyValue("-webkit-touch-callout") };
  // A long press is the lift's, not iOS's callout
  element.style.setProperty("-webkit-touch-callout", "none");

  let opened = false;
  let closing = false;
  let destroyed = false;

  /** While open: the dialog, the dim in it, what's lifted, and how to put everything back */
  let layer: HTMLDialogElement | null = null;
  let shade: HTMLElement | null = null;
  let copy: HTMLElement | null = null;
  let restore: (() => void) | null = null;
  /** Where the menu's growth comes from, for its scale */
  let menuOrigin = "50% 0";

  const draw = ({ x, y, s, p }: typeof ZERO) => {
    if (copy) copy.style.transform = `translate(${px(x)}, ${px(y)}) scale(${s.toFixed(4)})`;
    // The dim and blur themselves, not the opacity of what blurs: Safari draws a fading backdrop
    // filter in squares
    if (shade) {
      const q = Math.max(0, Math.min(1, p));
      shade.style.backgroundColor = `rgb(0 0 0 / ${(dim * q).toFixed(4)})`;
      const filter = q > 0 ? `blur(${(blur * q).toFixed(2)}px)` : "none";
      shade.style.setProperty("-webkit-backdrop-filter", filter);
      shade.style.backdropFilter = filter;
    }
    if (menu && layer?.contains(menu)) {
      menu.style.opacity = String(Math.max(0, Math.min(1, p)));
      menu.style.transform = `scale(${(0.6 + 0.4 * p).toFixed(4)})`;
      menu.style.transformOrigin = menuOrigin;
    }
  };
  const spring = new SpringAnimator(ZERO, rise, draw, () => {
    if (closing) teardown();
  });

  /** The press under way, until it lifts, is let go or given up */
  let press: { id: number; x: number; y: number; timer: number; unhold: () => void } | null = null;
  /** The finger that lifted it, followed onto the menu until it's let go */
  let finger: { id: number; x: number; y: number; moved: boolean } | null = null;
  let highlighted: HTMLElement | null = null;
  /** The menu key or Shift+F10 just pressed: the context menu that follows is the keyboard's */
  let byKeyboard = false;

  const endPress = () => {
    if (!press) return;
    win.clearTimeout(press.timer);
    press.unhold();
    press = null;
    element.removeAttribute("data-lifting");
    win.removeEventListener("pointermove", pressMoved, true);
    win.removeEventListener("pointerup", pressEnded, true);
    win.removeEventListener("pointercancel", pressEnded, true);
  };

  const down = (e: PointerEvent) => {
    if (destroyed || opened || press || !e.isPrimary) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    press = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      timer: win.setTimeout(() => lift(e.pointerId), delay),
      unhold: holdSelection(doc),
    };
    element.setAttribute("data-lifting", "");
    win.addEventListener("pointermove", pressMoved, true);
    win.addEventListener("pointerup", pressEnded, true);
    win.addEventListener("pointercancel", pressEnded, true);
  };
  const pressMoved = (e: PointerEvent) => {
    if (!press || e.pointerId !== press.id) return;
    if (Math.hypot(e.clientX - press.x, e.clientY - press.y) > SLOP) endPress();
  };
  const pressEnded = (e: PointerEvent) => {
    if (press && e.pointerId === press.id) endPress();
  };

  /** Lifted by a long press: the finger is followed onto the menu */
  const lift = (id: number) => {
    const at = press;
    endPress();
    if (!at) return;
    open(false);
    finger = { id, x: at.x, y: at.y, moved: false };
    // Hit-tested from here on, not kept by the element: what's under it now is the menu
    try {
      element.releasePointerCapture(id);
    } catch {
      // Never captured
    }
    win.addEventListener("pointermove", fingerMoved, true);
    win.addEventListener("pointerup", fingerUp, true);
    win.addEventListener("pointercancel", fingerUp, true);
  };

  const itemAt = (x: number, y: number) => {
    if (!menu) return null;
    const hit = doc.elementFromPoint(x, y)?.closest<HTMLElement>(items) ?? null;
    return hit && menu.contains(hit) && !hit.matches(":disabled, [aria-disabled='true']") ? hit : null;
  };
  const highlight = (item: HTMLElement | null) => {
    if (item === highlighted) return;
    highlighted?.removeAttribute("data-highlighted");
    highlighted = item;
    item?.setAttribute("data-highlighted", "");
    onHighlight?.(item);
  };

  const fingerMoved = (e: PointerEvent) => {
    if (!finger || e.pointerId !== finger.id) return;
    if (!finger.moved && Math.hypot(e.clientX - finger.x, e.clientY - finger.y) > SLOP) finger.moved = true;
    if (finger.moved) highlight(itemAt(e.clientX, e.clientY));
  };
  const endFinger = () => {
    finger = null;
    win.removeEventListener("pointermove", fingerMoved, true);
    win.removeEventListener("pointerup", fingerUp, true);
    win.removeEventListener("pointercancel", fingerUp, true);
  };
  const fingerUp = (e: PointerEvent) => {
    if (!finger || e.pointerId !== finger.id) return;
    const item = e.type === "pointerup" && finger.moved ? itemAt(e.clientX, e.clientY) : null;
    endFinger();
    // The click this release would make on its own is dropped: on the element it lifted, or on the
    // dim, which would close it. A chosen item gets its click from us
    swallowClick(doc, item);
    if (item) item.click();
    else highlight(null);
  };

  const contextMenu = (e: MouseEvent) => {
    if (destroyed) return;
    e.preventDefault();
    const keyboard = byKeyboard;
    byKeyboard = false;
    if (opened) return;
    // A browser's own long press, ahead of ours: the finger is still followed
    if (press) return lift(press.id);
    open(keyboard);
  };
  /** The finger that lifted it doesn't scroll the page: its touches are the element's, wherever it goes */
  const stillFinger = (e: TouchEvent) => {
    if (finger && e.cancelable) e.preventDefault();
  };
  const keyDown = (e: KeyboardEvent) => {
    byKeyboard = e.key === "ContextMenu" || (e.shiftKey && e.key === "F10");
  };

  /** A choice: told, then closed. Its own click has run by then */
  const chosen = (e: MouseEvent) => {
    const item = (e.target as Element | null)?.closest<HTMLElement>(items);
    if (!item || !menu?.contains(item)) return;
    onSelect?.(item);
    close();
  };

  /** Where everything goes: the copy's lift and shift, the menu's place and where it grows from */
  const place = (box: DOMRect, menuSize: { w: number; h: number }) => {
    const vw = win.innerWidth;
    const vh = win.innerHeight;
    // Lifted around its center
    const w = box.width * scale;
    const h = box.height * scale;
    let top = box.top - (h - box.height) / 2;
    const left = box.left - (w - box.width) / 2;
    let dy = 0;
    let menuTop = 0;
    let above = false;
    if (menu) {
      const roomBelow = vh - MARGIN - (top + h + GAP);
      const roomAbove = top - GAP - MARGIN;
      above = placement === "above" || (placement === "auto" && roomBelow < menuSize.h && roomAbove >= menuSize.h);
      if (above) {
        menuTop = top - GAP - menuSize.h;
        if (menuTop < MARGIN) dy = MARGIN - menuTop;
      } else {
        menuTop = top + h + GAP;
        // No room under: it moves up for the menu, as far as the top allows
        const over = menuTop + menuSize.h - (vh - MARGIN);
        if (over > 0) dy = -Math.min(over, Math.max(0, top - MARGIN));
      }
      menuTop += dy;
      top += dy;
    }
    // Its side by the element's side of the screen, kept in from the edges
    const leftAligned = box.left + box.width / 2 < vw / 2;
    const menuLeft = Math.min(Math.max(MARGIN, leftAligned ? left : left + w - menuSize.w), vw - MARGIN - menuSize.w);
    const originX = Math.min(Math.max(0, left + w / 2 - menuLeft), menuSize.w);
    return { dy, menuTop, menuLeft, origin: `${px(originX)} ${above ? "100%" : "0"}` };
  };

  const open = (focusFirst = true) => {
    if (destroyed || opened) return;
    opened = true;
    closing = false;
    style(doc);

    // Its box as drawn now (giving a little under the press, say), and as laid out: its transitions
    // off for that, or a press's scale would still be easing back and the copy laid out smaller
    const drawn = element.getBoundingClientRect();
    const ownTransition = element.style.transition;
    element.style.transition = "none";
    const box = still(element, () => element.getBoundingClientRect(), "none");
    element.style.transition = ownTransition;

    layer = doc.createElement("dialog");
    layer.setAttribute("data-fk-lift", "");
    layer.setAttribute("aria-label", menu?.getAttribute("aria-label") ?? "Menu");
    if (!focusFirst) layer.autofocus = true;
    // Written whole, so no rule of the page's reaches it: a focused dialog's rounded corners, say,
    // would clip the dim to them
    layer.style.cssText =
      "position: fixed; inset: 0; width: 100%; height: 100%; max-width: none; max-height: none; " +
      "margin: 0; padding: 0; border: 0; border-radius: 0; background: transparent; overflow: hidden; " +
      "outline: none; box-shadow: none; opacity: 1; transform: none; filter: none; clip-path: none; " +
      "mask: none; color: inherit; font: inherit;";
    shade = doc.createElement("div");
    shade.style.cssText = "position: absolute; inset: 0;";
    layer.append(shade);

    const given = typeof options.preview === "function" ? options.preview(element) : options.preview;
    copy = given ?? (element.cloneNode(true) as HTMLElement);
    if (!given) {
      dress(element, copy, true);
      for (const el of [copy, ...copy.querySelectorAll("[id]")]) el.removeAttribute("id");
      copy.removeAttribute("data-lifting");
    }
    copy.setAttribute("aria-hidden", "true");
    copy.inert = true;
    copy.setAttribute("data-lifted", "");
    copy.style.position = "absolute";
    copy.style.left = px(box.left);
    copy.style.top = px(box.top);
    copy.style.width = px(box.width);
    copy.style.height = px(box.height);
    copy.style.margin = "0";
    copy.style.boxSizing = "border-box";
    copy.style.transformOrigin = "50% 50%";
    copy.style.pointerEvents = "none";
    layer.append(copy);

    // The menu, moved in, shown, and measured where it is
    let putBack = () => {};
    let at = { dy: 0, menuTop: 0, menuLeft: 0, origin: "50% 0" };
    if (menu) {
      const mark = doc.createComment("lift");
      menu.before(mark);
      const ownMenu = { style: menu.getAttribute("style"), hidden: menu.hidden };
      menu.hidden = false;
      menu.style.position = "absolute";
      menu.style.margin = "0";
      menu.style.transition = "none";
      layer.append(menu);
      // Open before it's measured: a closed dialog isn't laid out. Nothing shows yet: the copy is
      // over the element, the dim and the menu not there
      menu.style.opacity = "0";
      doc.body.append(layer);
      layer.showModal();
      at = place(box, { w: menu.offsetWidth, h: menu.offsetHeight });
      menu.style.left = px(at.menuLeft);
      menu.style.top = px(at.menuTop);
      menuOrigin = at.origin;
      putBack = () => {
        mark.replaceWith(menu);
        if (ownMenu.style === null) menu.removeAttribute("style");
        else menu.setAttribute("style", ownMenu.style);
        menu.hidden = ownMenu.hidden;
      };
    } else {
      doc.body.append(layer);
      layer.showModal();
      at = place(box, { w: 0, h: 0 });
    }

    const ownVisibility = element.style.visibility;
    element.style.visibility = "hidden";
    element.setAttribute("data-lifted", "");

    layer.addEventListener("cancel", cancelled);
    layer.addEventListener("click", clickedLayer);
    layer.addEventListener("wheel", stillPage, { passive: false });
    layer.addEventListener("touchmove", stillPage, { passive: false });
    menu?.addEventListener("click", chosen);
    win.addEventListener("resize", resized);

    restore = () => {
      putBack();
      element.style.visibility = ownVisibility;
      element.removeAttribute("data-lifted");
    };

    if (focusFirst) menu?.querySelector<HTMLElement>(items)?.focus();

    // From as it's drawn now, up to lifted
    const from = {
      x: drawn.left + drawn.width / 2 - (box.left + box.width / 2),
      y: drawn.top + drawn.height / 2 - (box.top + box.height / 2),
      s: box.width ? drawn.width / box.width : 1,
      p: 0,
    };
    const to = { x: 0, y: at.dy, s: scale, p: 1 };
    spring.stop();
    spring.jump(from, { x: 0, y: 0, s: 0, p: 0 });
    draw(from);
    if (reduced.matches) {
      spring.jump(to, { x: 0, y: 0, s: 0, p: 0 });
      draw(to);
    } else spring.to(to, rise);
    onOpen?.();
  };

  const close = () => {
    if (!opened || closing) return;
    closing = true;
    endFinger();
    highlight(null);
    if (reduced.matches) {
      teardown();
      return;
    }
    spring.to(ZERO, SETTLE);
  };

  const teardown = () => {
    spring.stop();
    closing = false;
    if (!opened) return;
    opened = false;
    layer?.removeEventListener("cancel", cancelled);
    layer?.removeEventListener("click", clickedLayer);
    layer?.removeEventListener("wheel", stillPage);
    layer?.removeEventListener("touchmove", stillPage);
    menu?.removeEventListener("click", chosen);
    win.removeEventListener("resize", resized);
    restore?.();
    restore = null;
    if (layer?.open) layer.close();
    layer?.remove();
    layer = shade = copy = null;
    // Focus back where it was before, as a closed dialog does
    onClose?.();
  };

  /** Escape: closed with the springs, not at once as a dialog closes */
  const cancelled = (e: Event) => {
    e.preventDefault();
    close();
  };
  /** A press on the dim, anywhere but the menu, closes it */
  const clickedLayer = (e: MouseEvent) => {
    if (menu?.contains(e.target as Node)) return;
    close();
  };
  /** The page doesn't scroll under it; the menu may */
  const stillPage = (e: Event) => {
    if (!menu?.contains(e.target as Node)) e.preventDefault();
  };
  const resized = () => close();

  element.addEventListener("pointerdown", down);
  element.addEventListener("contextmenu", contextMenu);
  element.addEventListener("touchmove", stillFinger, { passive: false });
  element.addEventListener("keydown", keyDown);

  return {
    get opened() {
      return opened;
    },
    open: () => open(true),
    close,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      endPress();
      endFinger();
      teardown();
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("contextmenu", contextMenu);
      element.removeEventListener("touchmove", stillFinger);
      element.removeEventListener("keydown", keyDown);
      element.style.setProperty("-webkit-touch-callout", own.callout);
    },
  };
}
