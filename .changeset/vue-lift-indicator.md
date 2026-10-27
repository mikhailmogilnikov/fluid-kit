---
"@fluidkit/core": minor
"@fluidkit/lift": minor
"@fluidkit/indicator": minor
---

Vue components and composables: `@fluidkit/lift/vue` and `@fluidkit/indicator/vue`. Vue is an optional peer dependency (3.5+).

- The same parts as in React: `Lift.Root`, `Lift.Target`, `Lift.Menu`, `Lift.Item`, `Lift.Separator`, `Lift.Preview`; `Indicator.Root`, `Indicator.Thumb`, `Indicator.Item`. Namespaced, so `<Lift.Root>` works in `<script setup>` templates.
- Any part can render as the element in its slot with `as-child`, as in Reka UI; the slot receives the part's state. State is exposed as the same data attributes.
- `v-model:open` on `Lift.Root`, `v-model` on `Indicator.Root`, plus `active` and `@active-change`. A lift item's `@select` event can call `preventDefault()` to keep the menu open.
- Composables for custom markup: `useLift()` and `useIndicator()` return function refs for `:ref`. Options can be an object, a ref or a getter.
- Engines are created once their elements are mounted and updated with `set()` when props change. Server rendering (including Nuxt) and unmounting while a lift is open work.
- `@fluidkit/core/vue`: the helpers the adapters are built from (`renderPart`, `attachRef`, `useControllable`, `watchSettings`…).
