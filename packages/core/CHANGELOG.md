# Changelog

## 1.3.0

### Minor Changes

- 8c0c800: `SpringAnimator.timeScale`: how fast every spring runs, all of them at once. `0.25` is four times slower: slow motion to look at a transition, or to show one in a bug report. Every package's springs run on core's, so one setting slows them all.

## 1.2.1

### Patch Changes

- c5ea523: `holdSelection` writes `-webkit-user-select` before `user-select`, holding and letting go, so where the prefixed one is an alias of the other the root's own `user-select` is what's left.

## 1.2.0

### Minor Changes

- 835066d: `holdSelection(document)`: no text is selected on the page until it's let go, for a gesture that pulls something around: the root's `user-select` is `none` and iOS's touch callout off, a selection already there is dropped, and holds count, so overlapping gestures share one.

## 1.1.0

### Minor Changes

- 73190c8: `swallowClick(document, except?, ms?)` drops the click a gesture's release would make on its own, as drag and indicator need: the next click in the document within 400ms, but for one on `except`.

## 1.0.0

First release.

- `SpringAnimator`: SwiftUI-style springs (perceptual duration and bounce) over several numeric channels, shared or per channel, solved exactly at any frame rate. `to()` keeps the velocity when retargeting; `retarget()` corrects the flight under way without a second overshoot; `jump()` moves channels at once, keeping their velocity; `velocities()` reads each channel's speed to hand it on; an optional `settle` bounce after the first turn. A frame stamped before the movement was asked for doesn't step it back.
- Boxes as the browser draws them: `measureBox()` (where an element is on screen, its corners and their shape), `radiiOf()`, `cornerOf()` and `fitRadii()` for circular corners fitted the way the browser fits them, `cornerShapeOf()` for `corner-shape` as a superellipse exponent, `drawsCornerShape()`, `radiiCss()`, `px()`, and `still()` to read an element without its inline transforms.
- The Fluid Kit DOM contract: `SURFACE`, `PART` and `AWAY` (`data-fk-surface`, `data-fk-part`, `data-fk-away`).
- ESM with TypeScript declarations and no dependencies.
