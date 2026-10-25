/** Holds on each document: how many, and the root's own styles to put back when the last lets go */
const holds = new WeakMap<Document, { count: number; userSelect: string; webkit: string; callout: string }>();

/**
 * No text is selected on the page while something is held (a drag, a stretch, a press dragged across
 * items): the root's `user-select` is `none` from the pointer going down, before the browser starts a
 * selection, and a selection already there is dropped. Holds count, so overlapping gestures share
 * one. Returns a function that lets go; calling it again does nothing.
 */
export const holdSelection = (doc: Document): (() => void) => {
  const root = doc.documentElement;
  const style = root.style;
  let hold = holds.get(doc);
  if (!hold) {
    hold = {
      count: 0,
      userSelect: style.userSelect,
      webkit: style.getPropertyValue("-webkit-user-select"),
      callout: style.getPropertyValue("-webkit-touch-callout"),
    };
    holds.set(doc, hold);
    style.userSelect = "none";
    style.setProperty("-webkit-user-select", "none");
    style.setProperty("-webkit-touch-callout", "none");
    doc.getSelection()?.removeAllRanges();
  }
  hold.count++;
  let held = true;
  return () => {
    if (!held) return;
    held = false;
    const h = holds.get(doc);
    if (!h || --h.count > 0) return;
    holds.delete(doc);
    style.userSelect = h.userSelect;
    style.setProperty("-webkit-user-select", h.webkit);
    style.setProperty("-webkit-touch-callout", h.callout);
  };
};
