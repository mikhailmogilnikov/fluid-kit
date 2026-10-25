# @fluidkit/lift

## 1.0.0

### Major Changes

- 6593269: First release.
  
  - A long press, a right click or the menu key lifts an element above everything, the page dimmed and blurred behind it, and opens your menu beside it: `createLift({ element, menu })`, as iOS's context menus.
  - What lifts is a copy dressed as the element is drawn (every computed style written on it), in a modal `<dialog>` over any `overflow`, `z-index` and transform; the element is hidden where it is and keeps its room. `preview` lifts an element of your own instead: something live, or a bigger preview.
  - The menu, yours, is moved into the dialog while it's open and put back after; it opens under the element, or over it with no room under, on the element's side of the screen, and the element moves up for it with room neither way.
  - The same finger slides onto an item and lets go to choose it: items it's over are marked `data-highlighted` and handed to `onHighlight`; let go without moving, the menu stays open. A choice clicks the item, calls `onSelect` and closes the menu.
  - The press: held still for `delay` (500ms), it lifts; moved, or taken by a scroll, it doesn't. `data-lifting` while it's held, `data-lifted` while open; no text selected, no iOS callout, and the click a long press would end in is dropped.
  - Springs: it rises from where it's drawn to a little bigger (`scale`), the dim and the menu coming in with it, and settles exactly back before the element shows again. `dim`, `blur`, `placement`, `spring`; `onOpen`, `onClose`; `opened`, `open()`, `close()`, `destroy()`. Escape closes it, focus goes back; the page doesn't scroll under it; reduced motion is all at once.
  - ESM with TypeScript declarations. Depends on `@fluidkit/core`.
  
  ### Compatibility
  
  - A copy is a picture of the element as it was. Pseudo-elements are dressed only where the page's rules still match the copy out of its place.
