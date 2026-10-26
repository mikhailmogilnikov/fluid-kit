# Changelog

## 1.0.3

### Patch Changes

- 8a34144: Resting on an item that grows or shrinks (its text animating, say), the indicator keeps to it frame by frame instead of chasing it on a spring a few frames behind. And it's no longer a fraction of a pixel off its item in a container whose width isn't a whole number: `offsetWidth` is rounded, and was taken for a scale.
- Updated dependencies [8c0c800]
  - @fluidkit/core@1.3.0

## 1.0.2

### Patch Changes

- e5f6f44: No text on the page is selected while a gesture holds a pointer: a drag (from the pointer going down on the handle until it's let go, given up or not), glass pressed to stretch, and a press dragged across an indicator's items.
- Updated dependencies [835066d]
  - @fluidkit/core@1.2.0

## 1.0.1

### Patch Changes

- 73190c8: A release over another item drops only the browser's own click that follows it, through core's `swallowClick`, and no longer any other click in the next 400ms.
- Updated dependencies [73190c8]
  - @fluidkit/core@1.1.0

## 1.0.0

First release.

- One element that flies onto an item of a container: `createIndicator({ container, indicator })`, its center, size and corners on interruptible springs that keep their velocity, without overshoot by default, a few frames from item to item.
- Item to item, never in between: over a gap or a separator it stays on the last item, and crosses to the next blurred and a little fainter by its own speed. It shows up on its item at once; going away, it fades as it lands on the item it was headed for, so a pointer swept past leaves it on the last item it was over. Over a disabled item it goes away.
- `trigger`: hover for a mouse or a pen and press for a finger, per event (`auto`), or `hover`, `press`, `manual`. A press shows after a short delay on touch, so a finger that lands to scroll shows nothing; released over another item, that item is clicked (`click`). Keyboard focus that shows moves it too (`focus`).
- `data-pressed` on the indicator while a pointer is down on its item (a press, or a click on the hovered one), for the page to style.
- `rest`, where it stays when nothing points, such as the chosen tab; `to()`, `current`, `update()`, `destroy()`; partial springs; `onChange`.
- Each item lends it its corners, circular and fitted as the browser draws them; corner shapes where `corner-shape` is supported. An item with square corners lends it the indicator's own.
- Items are measured at rest, in the indicator's own pixels (a scaled container works), and again when anything in the container is resized or changed; pointers are hit-tested against those boxes, without layout. Reduced motion moves it at once.
- ESM with TypeScript declarations. Depends on `@fluidkit/core`.

### Compatibility

- The container needs a position of its own, and the indicator has to be under the items (an isolated container and `z-index: -1`, or positioned items). Rotated ancestors aren't supported.
- For a press to drag across items, give the container `touch-action: none` and `user-select: none`. A press the browser takes over (a drag of selected text) ends without a choice.
