# Changelog

## 1.2.0

### Minor Changes

- 3e6e815: Scroll edges: `lb-edge` on an element that scrolls fades its content out toward its top and bottom, as under the bars in iOS; `lb-edge-x`, toward its sides. An edge shows only while there's content past it, so at either end of the scroll its edge is gone and covers nothing. Pure CSS, a `mask` driven by scroll-driven animations; `--lb-edge-size` (28px) sets how far it reaches. Without scroll-driven animations there are no edges.

### Patch Changes

- e5f6f44: No text on the page is selected while a gesture holds a pointer: a drag (from the pointer going down on the handle until it's let go, given up or not), glass pressed to stretch, and a press dragged across an indicator's items.
- Updated dependencies [835066d]
  - @fluidkit/core@1.2.0

## 1.1.0

### Minor Changes

- 5ab426d: A lens: `lb-lens`, or `--lb-lens` from 0 to 1. The same glass with no blur, so what's under it shows sharp, as a thumb that's held is in iOS. `--lb-lens` is inherited and registered, so it transitions and any selector can set it: `.thumb[data-dragging] { --lb-lens: 1 }` turns a held thumb into a lens and back. `--lb-transparency` is registered now too, so it transitions as well.
- 0321a06: `--lb-stretch-axis`: which way `lb-stretch` pulls, `x`, `y` or `both` (the default), read once per press like `--lb-stretch`. A switch's thumb that stays in its track stretches along `x` only.

## 1.0.0

First release.

- CSS glass material with backdrop blur, saturation, fill, volume, rims, edges and shadows; no refraction.
- Regular, clear and tinted surfaces with inherited controls for transparency, depth, colors and theme.
- Press (`@fluidkit/blur/press`): spring-driven highlight, swell and stretch, for mouse, touch and keyboard; disabled controls (`:disabled`, `aria-disabled="true"`) aren't pressed. `@fluidkit/blur/auto` installs it on import.
- Melt (`@fluidkit/blur/melt`): glass groups that merge nearby rounded shapes into one surface without blurring overlaps twice. The shared glass is clipped and masked to the melted outline, so Chromium on Windows doesn't show a blurred rectangle around it under a rounded, clipping ancestor.
- Meets `@fluidkit/morph` through the Fluid Kit DOM contract (`data-fk-surface`, `data-fk-part`, `data-fk-away`), without importing it.
- Reduced transparency, increased contrast, forced colors and reduced motion support.
- ESM entry points with TypeScript declarations, and a stylesheet declaration for TypeScript's Bundler and NodeNext module resolution. Depends on `@fluidkit/core`.

### Compatibility

- The material requires `backdrop-filter`, `color-mix()` and CSS `pow()`; registered properties have fallbacks. The stylesheet keeps `-webkit-backdrop-filter` for Safari before 18.
- Glass groups require `clip-path: path()` and Canvas 2D.
- Create groups after mounting or hydration.
