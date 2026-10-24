/**
 * Drops the click a gesture's release would make on its own (a drag let go, a press that clicked
 * another item itself): the next click in the document within `ms`, but for one on `except`, which
 * passes and leaves the wait on. Returns a function that stops waiting; call it before waiting
 * again and on destroy.
 */
export const swallowClick = (doc: Document, except?: Element | null, ms = 400): (() => void) => {
  const win = doc.defaultView ?? window;
  const swallow = (e: MouseEvent) => {
    if (except && e.composedPath().includes(except)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    stop();
  };
  const timer = win.setTimeout(() => stop(), ms);
  const stop = () => {
    win.clearTimeout(timer);
    doc.removeEventListener("click", swallow, true);
  };
  doc.addEventListener("click", swallow, true);
  return stop;
};
