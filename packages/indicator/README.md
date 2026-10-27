# @fluidkit/indicator

One element that moves to whichever item is hovered, pressed, focused or selected: a menu
highlight, a tab thumb, a segmented control's pill. The items stay put; only the indicator moves,
on springs that keep their speed when redirected, with a slight motion blur like in iOS. Works with
any element, and with [`@fluidkit/blur`](https://fluidkit.mogilnikov.dev/blur) glass.

**[Documentation](https://fluidkit.mogilnikov.dev/indicator)** · [Changelog](CHANGELOG.md) · Part of
[Fluid Kit](https://fluidkit.mogilnikov.dev)

```bash
npm install @fluidkit/indicator
```

Add the indicator to the container, absolutely positioned and behind the items:

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

It follows the mouse or pen on hover, and a finger pressing across items (releasing on another
item clicks it). For a selected item, like a tab, set `rest`; for full control, use
`trigger: "manual"` and `to()`. See the [documentation](https://fluidkit.mogilnikov.dev/indicator)
for options and the API.

## React

`@fluidkit/indicator/react` has components (each part can render as your own element with
`render`) and a `useIndicator()` hook for custom markup.

```tsx
import { Indicator } from "@fluidkit/indicator/react";

<Indicator.Root value={tab} onValueChange={setTab} trigger="press">
  <Indicator.Thumb className="thumb" />
  <Indicator.Item value="overview">Overview</Indicator.Item>
  <Indicator.Item value="releases">Releases</Indicator.Item>
</Indicator.Root>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/indicator?framework=react#parts).

## Vue

`@fluidkit/indicator/vue` has the same components (each part can render as the element in its slot
with `as-child`) and a `useIndicator()` composable. Vue 3.5+.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Indicator } from "@fluidkit/indicator/vue";

const tab = ref("overview");
</script>

<template>
  <Indicator.Root v-model="tab" trigger="press">
    <Indicator.Thumb class="thumb" />
    <Indicator.Item value="overview">Overview</Indicator.Item>
    <Indicator.Item value="releases">Releases</Indicator.Item>
  </Indicator.Root>
</template>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/indicator?framework=vue#parts).

## License

MIT © Mikhail Mogilnikov. See [LICENSE](LICENSE).
