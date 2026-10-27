# @fluidkit/morph

Animate one element into another and back with a single continuous shape. Position, size and
corners run on springs you can reverse at any point, and elements shared by both states move from
one to the other. Works with any element, and with
[`@fluidkit/blur`](https://fluidkit.mogilnikov.dev/blur) glass.

**[Documentation](https://fluidkit.mogilnikov.dev/morph)** · [Changelog](CHANGELOG.md) · Part of
[Fluid Kit](https://fluidkit.mogilnikov.dev)

```bash
npm install @fluidkit/morph
```

Lay out both states where they should appear, hide the panel with `visibility: hidden`, then:

```js
import { createMorph } from "@fluidkit/morph";

const morph = createMorph({ states: [button, panel] });
button.addEventListener("click", () => morph.to(morph.current === panel ? button : panel));
```

See the [documentation](https://fluidkit.mogilnikov.dev/morph) for options, the API, shared
elements, glass groups and limitations.

## React

`@fluidkit/morph/react` has components (each part can render as your own element with
`render`) and a `useMorph()` hook for custom markup.

```tsx
import { Morph } from "@fluidkit/morph/react";

<Morph.Root>
  <Morph.State value="button" className="lb" render={<Morph.Trigger value="panel" />}>
    More
  </Morph.State>
  <Morph.State value="panel" className="lb panel">
    <Morph.Trigger value="button">Close</Morph.Trigger>
  </Morph.State>
</Morph.Root>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/morph?framework=react#parts).

## Vue

`@fluidkit/morph/vue` has the same components (each part can render as the element in its slot
with `as-child`) and a `useMorph()` composable. Vue 3.5+.

```vue
<Morph.Root v-model="state">
  <Morph.State value="button" as-child>
    <Morph.Trigger class="lb" value="panel">More</Morph.Trigger>
  </Morph.State>
  <Morph.State value="panel" class="lb panel">
    <Morph.Trigger value="button">Close</Morph.Trigger>
  </Morph.State>
</Morph.Root>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/morph?framework=vue#parts).

## Svelte

`@fluidkit/morph/svelte` has the same components (each part can render an element of yours with a
`child` snippet) and a `useMorph()` function. Svelte 5.29+.

```svelte
<Morph.Root bind:value={shown}>
  <Morph.State value="button">
    {#snippet child({ props })}<Morph.Trigger {...props} class="lb" value="panel">More</Morph.Trigger>{/snippet}
  </Morph.State>
  <Morph.State value="panel" class="lb panel">
    <Morph.Trigger value="button">Close</Morph.Trigger>
  </Morph.State>
</Morph.Root>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/morph?framework=svelte#parts).

## License

MIT © Mikhail Mogilnikov. See [LICENSE](LICENSE).
