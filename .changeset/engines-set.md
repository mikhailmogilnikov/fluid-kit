---
"@fluidkit/lift": minor
"@fluidkit/drag": minor
"@fluidkit/indicator": minor
"@fluidkit/morph": minor
---

`set(settings)`: a lift, drag, indicator or morph takes new options once made, the rest kept, without being made again: what a component needs as its props change. Everything but the elements it's made on.

- Lift: all but `element` and `menu`. Open, it takes them as it goes (its dim, blur, callbacks) or the next time it opens. `LiftSettings` is their type.
- Drag: all but `element`, `handle`, `axis`, `scroll` and `initial`. New snap points or bounds are followed at once, as by `update()`. `DragSettings`.
- Indicator: all but `container`, `indicator` and `rest`, which is a property of its own. A new `trigger` (or `focus`) takes over at once, and what pointed at it under the old one lets go. `IndicatorSettings`.
- Morph: its `spring` and callbacks; new springs take the next flight. `MorphSettings`.
