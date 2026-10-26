---
"@fluidkit/core": minor
"@fluidkit/lift": minor
"@fluidkit/indicator": minor
---

React: `@fluidkit/lift/react` and `@fluidkit/indicator/react`, React an optional peer (18 or later).

- Components by default, composed of parts: `Lift.Root`, `Lift.Target`, `Lift.Menu`, `Lift.Item`, `Lift.Separator`, `Lift.Preview`; `Indicator.Root`, `Indicator.Thumb`, `Indicator.Item`. Each part renders as an element of yours with `render`, as in Base UI (`render={<img src={src} />}`, or a function of its props and state), our props merged into it. Headless: their state is in data attributes (`data-state`, `data-selected`, `data-active`, `data-disabled`) for any CSS.
- Controlled or not: `open` / `defaultOpen` / `onOpenChange` for a lift; `value` / `defaultValue` / `onValueChange` for an indicator, and `active` for an item pointed at from elsewhere (the finger on a lift's menu, say). A lift's items have values, `onSelect` on the root is given the one chosen, and an item's own `onSelect` can `preventDefault()` to keep the menu open.
- Hooks for markup of your own: `useLift()` and `useIndicator()` give refs to bind the engine to your elements, its state and the engine itself.
- An engine is made once its elements are in the page and given new props by `set()`, never made again for them; callbacks are always the latest. Strict mode, React 18's and 19's refs, server rendering and unmounting while a lift is open all work.
- `@fluidkit/core/react`: what the adapters are made of (`renderPart`, `mergeProps`, `useMergedRefs`, `useAttach`, `useControllable`, `useSettings`…), for a component of your own.
