# @fluidkit/indicator

One element that flies onto whichever item is hovered, pressed, focused or chosen: the highlight
of a menu, the thumb of tabs, the pill of a segmented control. The items stay where they are;
only the indicator moves, its center, size and corners on springs that keep their speed when sent
elsewhere, blurred by its own speed on the way, as iOS does. Works on any element; with
[`@fluidkit/blur`](https://fluidkit.mogilnikov.dev/blur) it can be glass.

**[Documentation](https://fluidkit.mogilnikov.dev/indicator)** · [Changelog](CHANGELOG.md) · Part of
[Fluid Kit](https://fluidkit.mogilnikov.dev)

```bash
npm install @fluidkit/indicator
```

Put the indicator in the container, positioned and under the items:

```html
<div class="menu" role="menu">
  <span class="menu__highlight"></span>
  <button role="menuitem">Copy</button>
  <button role="menuitem">Share</button>
  <hr />
  <button role="menuitem">Delete</button>
</div>
```

```css
.menu { position: relative; isolation: isolate; }
.menu__highlight { position: absolute; z-index: -1; background: rgb(127 127 127 / 0.2); }
```

```js
import { createIndicator } from "@fluidkit/indicator";

createIndicator({
  container: document.querySelector(".menu"),
  indicator: document.querySelector(".menu__highlight"),
});
```

It follows a hovering mouse or pen, and a pressing finger across items (released over another
item, that one is clicked). Over a separator it stays on the last item, then crosses in a few
frames. For a chosen item, such as a tab, set `rest`; for full control, `trigger: "manual"` and
`to()`. Options, the API and the layout rules are in the
[documentation](https://fluidkit.mogilnikov.dev/indicator).

## React

From `@fluidkit/indicator/react`: components made of parts, each rendered as an element of yours
with `render`, and `useIndicator()` for markup of your own.

```tsx
import { Indicator } from "@fluidkit/indicator/react";

<Indicator.Root value={tab} onValueChange={setTab} trigger="press">
  <Indicator.Thumb className="thumb" />
  <Indicator.Item value="overview">Overview</Indicator.Item>
  <Indicator.Item value="releases">Releases</Indicator.Item>
</Indicator.Root>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/indicator#react).

## License

MIT © Mikhail Mogilnikov. See [LICENSE](LICENSE).
