---
"@fluidkit/morph": minor
"@fluidkit/drag": minor
"@fluidkit/blur": minor
---

React components and hooks: `@fluidkit/morph/react`, `@fluidkit/drag/react` and `@fluidkit/blur/react`. React is an optional peer dependency (18+).

- Morph: `Morph.Root`, `Morph.State`, `Morph.Trigger` and `Morph.Match`, plus `useMorph()`. States have a `value` (`value` / `defaultValue` / `onValueChange`), and callbacks receive values instead of elements. A state can also be a trigger via `render`. The animation starts after the new value renders, so labels and matches changed by the same click animate correctly. States added or removed later are handled automatically.
- Drag: `Drag.Root`, `Drag.Handle` and `Drag.Scroll`, plus `useDrag()`. Snap points and bounds can be a function of the parent's size, recomputed on resize and re-render. `snap` / `defaultSnap` / `onSnapChange`; if the parent keeps `snap` unchanged, the element goes back to it.
- Blur: `Glass` with variants as props (`clear`, `tint`, `lens`, `transparency`, `depth`, `interactive`, `highlight`, `swell`, `stretch`), which sets up press effects automatically, and `Glass.Group` for glass groups. Also `glass()`, `usePress()` and `useGlassGroup()`.
