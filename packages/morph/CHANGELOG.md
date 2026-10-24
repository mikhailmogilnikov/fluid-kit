# Changelog

## 1.0.1

### Patch Changes

- 875cd45: A state that's a popover keeps its surface on the way: the shape's fill and the copies no longer take its `popover` attribute, which hid them (a popover that isn't open is `display: none`).

## 1.0.0

First release.

- One element flows into another: `createMorph({ states })` and `to(state)`, between any of its states, with independent springs for center, size and progress, interruptible with the velocity kept. Sent back mid-way it turns around; sent elsewhere, it starts over from where the shape is.
- The bigger state flies itself, live the whole way (pressed, typed into, playing), through transform, opacity, filter and clip-path; the smaller one rides in the shape as a copy. A translation of the bigger state's own (`translate: -50% -50%`) is kept.
- Shared elements: pieces marked with the same `data-fk-match` in two states fly from one to the other.
- Works on any element: the shape takes the states' surfaces, and where they differ one dissolves into the other. With `@fluidkit/blur` it's the same glass, and inside a glass group it lifts over the group or melts with it, through the Fluid Kit DOM contract.
- Each corner goes from one state's radius to the other's, circular all the way; corner shapes interpolate as a superellipse where `corner-shape` is supported.
- Follows scrolling, window resizes and the states' own size changes during a flight; `update()` for any other move.
- The bigger state, coming in magnified, doesn't widen the page on its way: the nearest element spanning the page clips sideways while it flies (iOS Safari pans past the body's own `overflow`).
- A state that holds focus as it goes stays focusable and readable (`opacity: 0`, `data-fk-away`); pressing the shape on its way presses the state under it.
- `current`, `moving`, a promise from `to()`; `{ instant: true }`; `initial`; `onStart`, `onRest` and a per-frame `onProgress`; `add()` and `remove()` for states that come and go; partial `grow` and `shrink` springs; a `container` for the shape out of a clipping parent.
- ESM with TypeScript declarations. Depends on `@fluidkit/core`.

### Compatibility

- Create morphs after mounting or hydration. Rotated or scaled ancestors aren't supported, nor a transform of the bigger state's own other than a translation.
