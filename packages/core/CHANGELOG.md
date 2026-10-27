# Changelog

## 1.4.0

### Minor Changes

- c80a491: React: `@fluidkit/lift/react` and `@fluidkit/indicator/react`, React an optional peer (18 or later).
  
  - Components by default, composed of parts: `Lift.Root`, `Lift.Target`, `Lift.Menu`, `Lift.Item`, `Lift.Separator`, `Lift.Preview`; `Indicator.Root`, `Indicator.Thumb`, `Indicator.Item`. Each part renders as an element of yours with `render`, as in Base UI (`render={<img src={src} />}`, or a function of its props and state), our props merged into it. Headless: their state is in data attributes (`data-state`, `data-selected`, `data-active`, `data-disabled`) for any CSS.
  - Controlled or not: `open` / `defaultOpen` / `onOpenChange` for a lift; `value` / `defaultValue` / `onValueChange` for an indicator, and `active` for an item pointed at from elsewhere (the finger on a lift's menu, say). A lift's items have values, `onSelect` on the root is given the one chosen, and an item's own `onSelect` can `preventDefault()` to keep the menu open.
  - Hooks for markup of your own: `useLift()` and `useIndicator()` give refs to bind the engine to your elements, its state and the engine itself.
  - An engine is made once its elements are in the page and given new props by `set()`, never made again for them; callbacks are always the latest. Strict mode, React 18's and 19's refs, server rendering and unmounting while a lift is open all work.
  - `@fluidkit/core/react`: what the adapters are made of (`renderPart`, `mergeProps`, `useMergedRefs`, `useAttach`, `useControllable`, `useSettings`…), for a component of your own.

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
