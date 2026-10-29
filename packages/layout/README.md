# @fluidkit/layout

When the layout changes, its elements move to their new places instead of jumping: rows put in,
ticked off and reordered, a grid filtered, a section opened, a label that grew. Change the page as
you always do; every item that moved is shown where it was and goes to where it is on a spring that
keeps its speed. Works with any element, and with [`@fluidkit/blur`](https://fluidkit.mogilnikov.dev/blur) glass.

**[Documentation](https://fluidkit.mogilnikov.dev/layout)** · [Changelog](CHANGELOG.md) · Part of
[Fluid Kit](https://fluidkit.mogilnikov.dev)

```bash
npm install @fluidkit/layout
```

```js
import { createLayout } from "@fluidkit/layout";

const list = document.querySelector(".list");
createLayout({ root: list });

list.prepend(row); // the rows after it slide down, it fades in
row.remove(); // it fades where it was, the rest close up
```

Sizes change for real, on the spring: text isn't squeezed, and what comes after an item that grew
moves along with it. A new item fades in where it is; one taken out fades where it was. Another
change on the way sets off from where everything is drawn, keeping its speed. See the
[documentation](https://fluidkit.mogilnikov.dev/layout) for options, the API and performance.

## React

`@fluidkit/layout/react` has `Layout.Root` (render it as your own element with `render`) and a
`useLayout()` hook for custom markup.

```tsx
import { Layout } from "@fluidkit/layout/react";

<Layout.Root render={<ul className="list" />}>
  {todos.map((todo) => <li key={todo.id}>{todo.text}</li>)}
</Layout.Root>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/layout?framework=react#parts).

## Vue

`@fluidkit/layout/vue` has the same component (render it as the element in its slot with
`as-child`) and a `useLayout()` composable. Vue 3.5+.

```vue
<Layout.Root as-child>
  <ul class="list"><li v-for="todo in todos" :key="todo.id">{{ todo.text }}</li></ul>
</Layout.Root>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/layout?framework=vue#parts).

## Svelte

`@fluidkit/layout/svelte` has the same component (render an element of yours with a `child`
snippet) and a `useLayout()` function. Svelte 5.29+.

```svelte
<Layout.Root>
  {#snippet child({ props })}
    <ul {...props} class="list">{#each todos as todo (todo.id)}<li>{todo.text}</li>{/each}</ul>
  {/snippet}
</Layout.Root>
```

More in the [documentation](https://fluidkit.mogilnikov.dev/layout?framework=svelte#parts).

## License

MIT © Mikhail Mogilnikov. See [LICENSE](LICENSE).
