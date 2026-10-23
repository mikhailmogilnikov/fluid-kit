# Changelog

## 1.0.0

First release.

- `SpringAnimator`: SwiftUI-style springs (perceptual duration and bounce) over several numeric channels, shared or per channel, solved exactly at any frame rate. `to()` keeps the velocity when retargeting; `retarget()` corrects the flight under way without a second overshoot; `jump()` moves channels at once, keeping their velocity; `velocities()` reads each channel's speed to hand it on; an optional `settle` bounce after the first turn. A frame stamped before the movement was asked for doesn't step it back.
- Boxes as the browser draws them: `measureBox()` (where an element is on screen, its corners and their shape), `radiiOf()`, `cornerOf()` and `fitRadii()` for circular corners fitted the way the browser fits them, `cornerShapeOf()` for `corner-shape` as a superellipse exponent, `drawsCornerShape()`, `radiiCss()`, `px()`, and `still()` to read an element without its inline transforms.
- The Fluidkit DOM contract: `SURFACE`, `PART` and `AWAY` (`data-fk-surface`, `data-fk-part`, `data-fk-away`).
- ESM with TypeScript declarations and no dependencies.
