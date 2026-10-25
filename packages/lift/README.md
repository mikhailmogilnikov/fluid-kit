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

## License

MIT © Mikhail Mogilnikov. See [LICENSE](LICENSE).
