---
"@fluidkit/layout": major
---

First release.

- When the layout changes, its elements move to where they now are instead of jumping: `createLayout({ root })` watches a root and its items (its children, or `items` as a selector) and follows rows put in, taken out or reordered, their `class` and `hidden`, and their sizes, before the browser paints the change.
- Every item that moved is shown where it was drawn and goes to where it is on a spring (`translate`); another change on the way sets off from where everything is drawn then, keeping its speed.
- Sizes change for real: an item whose size changed, and the root itself, change `width` and `height` on the spring, clipped along that axis meanwhile, so text isn't squeezed and what comes after them moves with them. `size: false` moves positions only.
- A new item comes in from transparent and a little smaller (`enter`); one taken out goes out where it was (`exit`), the element itself put back for the while, inert and hidden from assistive technology, then removed. Put back meanwhile, it stays.
- Its own translation (a drag's offset) is added to, its own scale multiplied, and `transform` is left alone, so a glass press and a morph go on; an item being dragged isn't moved. In a flex container a size is held against the flex along its main axis only. Everything it writes is put back at rest. `spring`, `onStart`, `onRest`; `moving`, `update()`, `set()`, `destroy()`. Reduced motion is all at once, and so is a change while the root isn't drawn (hidden in a tab not shown, say) and its showing again.
- React (`@fluidkit/layout/react`), Vue (`@fluidkit/layout/vue`) and Svelte (`@fluidkit/layout/svelte`): `Layout.Root`, rendered as an element of yours, and `useLayout()`. ESM with TypeScript declarations. Depends on `@fluidkit/core`.
