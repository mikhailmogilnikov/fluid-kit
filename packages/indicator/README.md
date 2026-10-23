# @liquid-web/indicator

One element that flies onto whichever item is hovered, pressed, focused or chosen: the highlight
of a menu, the thumb of tabs, the pill of a segmented control. The items stay where they are;
only the indicator moves, its center, size and corners on springs that keep their speed when sent
elsewhere, blurred by its own speed on the way, as iOS does. Works on any element; with
[`@liquid-web/blur`](https://liquid-web.mogilnikov.dev/blur) it can be glass.

**[Documentation](https://liquid-web.mogilnikov.dev/indicator)** · [Changelog](CHANGELOG.md) · Part of
[liquid-web](https://liquid-web.mogilnikov.dev)

```bash
npm install @liquid-web/indicator
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
import { createIndicator } from "@liquid-web/indicator";

createIndicator({
  container: document.querySelector(".menu"),
  indicator: document.querySelector(".menu__highlight"),
});
```

It follows a hovering mouse or pen, and a pressing finger across items (released over another
item, that one is clicked). Over a separator it stays on the last item, then crosses in a few
frames. For a chosen item, such as a tab, set `rest`; for full control, `trigger: "manual"` and
`to()`. Options, the API and the layout rules are in the
[documentation](https://liquid-web.mogilnikov.dev/indicator).

## License

MIT © Mikhail Mogilnikov. See [LICENSE](LICENSE).
