# @fluidkit/blur

A glass material for the web: backdrop blur, fill, rims, springy press effects, and glass that
merges between shapes. Plain CSS classes plus optional scripts. No refraction, only features that
render the same in every browser.

**[Documentation](https://fluidkit.mogilnikov.dev/blur)** · [Changelog](CHANGELOG.md) · Part of
[Fluid Kit](https://fluidkit.mogilnikov.dev)

```bash
npm install @fluidkit/blur
```

```js
import "@fluidkit/blur/style.css";
```

```html
<button class="lb">Glass</button>
```

Press effects (`lb-highlight`, `lb-swell`, `lb-stretch`, `lb-interactive`) need one call:

```js
import { installPress } from "@fluidkit/blur/press";

installPress();
```

| Entry | What |
| --- | --- |
| `@fluidkit/blur/style.css` | The material |
| `@fluidkit/blur/press` | Highlight, swell and stretch on springs |
| `@fluidkit/blur/melt` | Glass groups: glass that merges between shapes |
| `@fluidkit/blur/auto` | Sets up press effects on import |
| `@fluidkit/blur/react` | `Glass` and `Glass.Group` components |
| `@fluidkit/blur/vue` | The same components for Vue |
| `@fluidkit/blur/svelte` | The same components for Svelte |

See the [documentation](https://fluidkit.mogilnikov.dev/blur) for classes, variables, theming,
accessibility, groups and the API.

## React

`@fluidkit/blur/react` has `Glass`, with variants as props and `render` for your own element, and
`Glass.Group` for merging glass. Press effects are set up automatically.

```tsx
import { Glass } from "@fluidkit/blur/react";

<Glass interactive tint="#0a84ff" render={<button />}>Follow</Glass>
<Glass.Group className="toolbar">
  <Glass interactive render={<button />}>Back</Glass>
  <Glass interactive render={<button />}>Share</Glass>
</Glass.Group>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/blur?framework=react#components).

## Vue

`@fluidkit/blur/vue` has the same `Glass` and `Glass.Group` (render your own element with
`as-child`), plus `glass()`, `usePress()` and `useGlassGroup()`. Vue 3.5+.

```vue
<Glass interactive tint="#0a84ff" as-child><button>Follow</button></Glass>
<Glass.Group class="toolbar">
  <Glass interactive as-child><button>Back</button></Glass>
  <Glass interactive as-child><button>Share</button></Glass>
</Glass.Group>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/blur?framework=vue#components).

## Svelte

`@fluidkit/blur/svelte` has the same `Glass` and `Glass.Group` (render an element of yours with a
`child` snippet), plus `glass()`, `usePress()` and `useGlassGroup()`. Svelte 5.29+.

```svelte
<Glass interactive tint="#0a84ff">
  {#snippet child({ props })}<button {...props}>Follow</button>{/snippet}
</Glass>
<Glass.Group class="toolbar">
  <Glass interactive>Back</Glass>
  <Glass interactive>Share</Glass>
</Glass.Group>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/blur?framework=svelte#components).

## License

MIT © Mikhail Mogilnikov. See [LICENSE](LICENSE).
