---
"@fluidkit/morph": minor
"@fluidkit/drag": minor
"@fluidkit/blur": minor
---

Vue components and composables: `@fluidkit/morph/vue`, `@fluidkit/drag/vue` and `@fluidkit/blur/vue`. Vue is an optional peer dependency (3.5+).

- Morph: `Morph.Root` (`v-model`, `@start`, `@rest`, `@progress`), `Morph.State`, `Morph.Trigger`, `Morph.Match`, plus `useMorph()`. A state becomes a trigger with `as-child`. The animation starts after the new value renders, so labels and matches changed by the same click animate correctly. States added or removed later are handled automatically.
- Drag: `Drag.Root` (`v-model:snap`, `@start`, `@move`, `@end`, `@rest`), `Drag.Handle`, `Drag.Scroll`, plus `useDrag()`. Snap points and bounds can be a function of the parent's size, recomputed on resize and when what they use changes. If the parent keeps `snap` unchanged, the element goes back to it.
- Blur: `Glass` with variants as props, which sets up press effects automatically, and `Glass.Group` for glass groups. Also `glass()` (returns `{ class, style }` for `v-bind`), `usePress()` and `useGlassGroup()`.
