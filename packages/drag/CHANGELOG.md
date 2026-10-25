# @fluidkit/drag

## 1.2.1

### Patch Changes

- 4bfcfcc: A pointer catches the element on its way only while it visibly moves (more than 2px from where it's headed, or faster than 40px/s). In the last of a spring's tail it's put in place instead: a finger on a sheet that has as good as stopped scrolls its list with the list's own momentum, where it used to be caught and scroll the list without any.
- 4bfcfcc: A finger dragging along one axis keeps the drag when it strays across: the page no longer starts scrolling mid-drag (Safari did, and took the pointer). A gesture that sets off across the axis still scrolls the page.

## 1.2.0

### Minor Changes

- 1e8374a: `follow`: a spring the element chases the pointer on while dragged, instead of sitting exactly under it, so a pointer flung back and forth is followed through, as iOS 27's switches do. Where a flick goes is still judged from the pointer. And a first move that goes far past the slop at once (a pointer flung) now moves the element by all but the slop, where it used to be lost.

## 1.1.0

### Minor Changes

- 0fbbcd2: `scroll`: an area inside that scrolls along the drag's axis, such as a sheet's list, shares one finger's gesture with the element, as iOS sheets do. A finger in the list moves the sheet when it pulls toward the later snap points with the list at its start, or pushes back while the sheet isn't at its first; else the list scrolls with its own momentum. A sheet pushed all the way hands the rest of the push to the list, and pulled back, the list scrolls back to its start before the sheet moves; a list scrolled back to its start and still pulled hands the gesture to the sheet where the browser lets the scroll be stopped. With `scroll`, the handle's `touch-action` is left alone: fingers are followed by their touch events.

## 1.0.0

### Major Changes

- cebb15b: First release.
  
  - One element dragged by a pointer: `createDrag({ element })`, along `x`, `y` or `both`, following the pointer exactly, in the element's own pixels (a scaled container works). It moves by its inline `translate` alone, so `transform` and `scale` stay free for the page and press behaviors.
  - Rubber-band edges past its `bounds` (the farthest snap points unless given), on iOS's curve, dragged or swinging past them on its spring; `rubberband: 0` stops it there instead.
  - Let go, it heads for the snap point nearest to where it would have come to rest by itself, slowing down as a scroll does (`deceleration`), so a flick reaches a far point and a slow drag settles on the near one. With no snap points it comes to rest where it would have, within its bounds. Snap points are offsets along the axis, or points for `both`; snap points and bounds given as functions are read again when the element, its parent or the window is resized.
  - The spring it settles on starts at the pointer's speed; caught on its way, it stops under the pointer and is dragged from there, or, let go without being moved, goes on where it was going and the tap is the page's click. In nested handles the innermost drag that starts has the pointer.
  - A drag starts after a few pixels, and along one axis only when the pointer moves along it first; on touch the handle's `touch-action` leaves the other axis (and pinch-zoom) to the browser. The click a drag would end in is dropped; text fields don't start one; text isn't selected and links aren't dragged off while it goes.
  - `handle`, `initial`, `spring`; `onStart`, `onMove` with the position and speed, `onEnd` with the snap point, `onRest`; `position`, `velocity`, `dragging`, `moving`, `current`, `disabled`, `snap()`, `to()`, `update()`, `destroy()`. `data-dragging` while a pointer drags it. With reduced motion it's on its point at once when let go.
  - ESM with TypeScript declarations. Depends on `@fluidkit/core`.
  
  ### Compatibility
  
  - Rotated ancestors aren't supported. A sheet holding a list that scrolls doesn't yet take over from the list scrolled to its top.

### Patch Changes

- Updated dependencies [73190c8]
  - @fluidkit/core@1.1.0
