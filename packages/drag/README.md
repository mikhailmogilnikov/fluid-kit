# @fluidkit/drag

One element dragged by a pointer, along one axis or both, as iOS drags its sheets, the rows of a
list swiped open and the thumb of a switch. Past its bounds it pulls back like rubber; let go, it
heads for the snap point nearest to where a flick would have carried it, on a spring that starts at
the finger's own speed. Caught on its way, it stops under the finger. Works on any element; with
[`@fluidkit/blur`](https://fluidkit.mogilnikov.dev/blur) it can be glass.

**[Documentation](https://fluidkit.mogilnikov.dev/drag)** · [Changelog](CHANGELOG.md) · Part of
[Fluid Kit](https://fluidkit.mogilnikov.dev)

```bash
npm install @fluidkit/drag
```

Lay the element out where it rests at offset 0; snap points are offsets from there, in pixels:

```js
import { createDrag } from "@fluidkit/drag";

createDrag({
  element: document.querySelector(".sheet"),
  axis: "y",
  // Open, half way, and down to its title; read again on a resize
  snaps: () => [0, innerHeight / 2, innerHeight - 88],
  initial: 1,
});
```

It moves the element with its inline `translate` alone, so `transform` and `scale` stay yours. On
touch the browser keeps the other axis (a list still scrolls past a row that swipes sideways), and
the click a drag would end in is dropped. Options, the API and how a snap point is chosen are in the
[documentation](https://fluidkit.mogilnikov.dev/drag).

## License

MIT © Mikhail Mogilnikov. See [LICENSE](LICENSE).
