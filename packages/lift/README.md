# @fluidkit/lift

Long-press, right-click or press the menu key to lift any element above the page, with the
background dimmed and blurred, and open your menu next to it. The iOS context menu, for the web. The
same finger can slide onto an item to pick it. A copy of the element is lifted in a modal `<dialog>`,
above any `overflow`, `z-index` or transform; the original stays in place.

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

You write the menu; Lift positions it below (or above) the element, opens and closes it. See the
[documentation](https://fluidkit.mogilnikov.dev/lift) for options and the API.

## React

`@fluidkit/lift/react` has components (each part can render as your own element with
`render`) and a `useLift()` hook for custom markup.

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

More in the [documentation](https://fluidkit.mogilnikov.dev/lift?framework=react#parts).

## Vue

`@fluidkit/lift/vue` has the same components (each part can render as the element in its slot with
`as-child`) and a `useLift()` composable. Vue 3.5+.

```vue
<script setup lang="ts">
import { Lift } from "@fluidkit/lift/vue";
</script>

<template>
  <Lift.Root @select="(value) => act(value)">
    <Lift.Target as-child><img :src="src" alt="" /></Lift.Target>
    <Lift.Menu class="menu">
      <Lift.Item value="copy">Copy</Lift.Item>
      <Lift.Item value="share">Share</Lift.Item>
    </Lift.Menu>
  </Lift.Root>
</template>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/lift?framework=vue#parts).

## License

MIT © Mikhail Mogilnikov. See [LICENSE](LICENSE).
