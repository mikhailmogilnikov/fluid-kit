# @fluidkit/lift

A long press, a right click or the menu key lifts any element above everything, the page dimmed and
blurred behind it, and opens your menu beside it: iOS's context menu, for the web. The same finger
can slide onto an item and let go to choose it. A copy of the element lifts, dressed as it's drawn,
in a modal `<dialog>` over any `overflow`, `z-index` and transform; the element keeps its place.

**[Documentation](https://fluidkit.mogilnikov.dev/lift)** · [Changelog](CHANGELOG.md) · Part of
[Fluid Kit](https://fluidkit.mogilnikov.dev)

```bash
npm install @fluidkit/lift
```

```html
<img class="photo" src="…" alt="…" tabindex="0" />

<div class="menu" role="menu" aria-label="Photo" hidden>
  <button role="menuitem">Copy</button>
  <button role="menuitem">Delete</button>
</div>
```

```js
import { createLift } from "@fluidkit/lift";

createLift({
  element: document.querySelector(".photo"),
  menu: document.querySelector(".menu"),
  onSelect: (item) => console.log(item.textContent),
});
```

The menu is yours: Lift places it under the element (or over it), opens it and closes it. Options,
the API and how it works are in the [documentation](https://fluidkit.mogilnikov.dev/lift).

## React

From `@fluidkit/lift/react`: components made of parts, each rendered as an element of yours with
`render`, and `useLift()` for markup of your own.

```tsx
import { Lift } from "@fluidkit/lift/react";

<Lift.Root onSelect={(value) => act(value)}>
  <Lift.Target render={<img src={src} alt="" />} />
  <Lift.Menu className="menu">
    <Lift.Item value="copy">Copy</Lift.Item>
    <Lift.Item value="share">Share</Lift.Item>
  </Lift.Menu>
</Lift.Root>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/lift#react).

## License

MIT © Mikhail Mogilnikov. See [LICENSE](LICENSE).
