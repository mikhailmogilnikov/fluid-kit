# @fluidkit/drag

Drag an element along one axis or both, like iOS sheets, swipeable rows and switch thumbs. It
stretches like rubber past its bounds. On release, it springs to the snap point the flick points to,
starting at the finger's speed. Grab it mid-motion and it stops under your finger. Works with any
element, and with [`@fluidkit/blur`](https://fluidkit.mogilnikov.dev/blur) glass.

**[Documentation](https://fluidkit.mogilnikov.dev/drag)** · [Changelog](CHANGELOG.md) · Part of
[Fluid Kit](https://fluidkit.mogilnikov.dev)

```bash
npm install @fluidkit/drag
```

Lay out the element at its starting position. Snap points are pixel offsets from there:

```js
import { createDrag } from "@fluidkit/drag";

createDrag({
  element: document.querySelector(".sheet"),
  axis: "y",
  // Open, half way, collapsed to the title. Recomputed on resize
  snaps: () => [0, innerHeight / 2, innerHeight - 88],
  initial: 1,
});
```

It only writes the element's inline `translate`, so `transform` and `scale` stay free. On touch,
the other axis is left to the browser, so a list still scrolls past rows that swipe sideways. Pass a
sheet's list as `scroll` and one gesture can move the sheet and scroll the list, like in iOS. See
the [documentation](https://fluidkit.mogilnikov.dev/drag) for options, the API and how snap points
are picked.

## React

`@fluidkit/drag/react` has components (each part can render as your own element with
`render`) and a `useDrag()` hook for custom markup.

```tsx
import { Drag } from "@fluidkit/drag/react";

<Drag.Root axis="y" snaps={({ height }) => [0, height / 2, height - 76]} snap={snap} onSnapChange={setSnap}>
  <Drag.Handle className="grabber" />
  <Drag.Scroll render={<ul />}>{rows}</Drag.Scroll>
</Drag.Root>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/drag?framework=react#parts).

## Vue

`@fluidkit/drag/vue` has the same components (each part can render as the element in its slot with
`as-child`) and a `useDrag()` composable. Vue 3.5+.

```vue
<Drag.Root v-model:snap="snap" axis="y" :snaps="({ height }) => [0, height / 2, height - 76]">
  <Drag.Handle class="grabber" />
  <Drag.Scroll as-child><ul>…</ul></Drag.Scroll>
</Drag.Root>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/drag?framework=vue#parts).

## License

MIT © Mikhail Mogilnikov. See [LICENSE](LICENSE).
