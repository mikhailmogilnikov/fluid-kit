# Changelog

## 1.7.0

### Minor Changes

- 4de0cc5: Motion: Apple's springs and transitions by name, for any package and for CSS.
  
  - `springs.smooth()`, `springs.snappy()`, `springs.bouncy()` and `springs.interactive()` give a `SpringParams` for any package's `spring`; given `{ duration, extraBounce }`, they tune it, as SwiftUI's `.snappy(duration:extraBounce:)` does.
  - `transitions.opacity()`, `transitions.scale()`, `transitions.blurReplace()` and `transitions.move()` give a `TransitionParams` (`{ opacity, scale, blur, x, y }`): how an element comes in and goes out, for Layout's `enter` and `exit`. Combined by spreading.
  - `springCss(params)` writes a spring for CSS: its own curve as a `linear()` easing, and how long it takes to come to rest.
  - `@fluidkit/core/motion.css`: each spring as `--fk-<name>` (and its `-easing` and `-duration`), and `fk-transition` with `fk-opacity`, `fk-scale`, `fk-blur-replace`, `fk-move` and the springs' classes, to bring an element in as it's put in the page or shown and take it out as it's hidden (`hidden`, a `<dialog>` or popover closed), tuned with variables. Reduced motion only fades.

## 1.6.0

### Minor Changes

- 347178f: Svelte components and functions: `@fluidkit/lift/svelte`, `@fluidkit/indicator/svelte`, `@fluidkit/morph/svelte`, `@fluidkit/drag/svelte` and `@fluidkit/blur/svelte`. Svelte is an optional peer dependency (5.29+, for attachments). The components ship as `.svelte` files your bundler compiles.
  
  - Every part renders its own element, or an element of yours with a `child` snippet, as in bits-ui: spread the `props` it gives, which carry the attachment that connects it. State is bindable (`bind:open`, `bind:value`, `bind:snap`), and a getter and setter binding lets you refuse a change. Events are callback props (`onSelect`, `onValueChange`, `onSnapChange`, …).
  - Lift: `Lift.Root`, `Lift.Target`, `Lift.Menu`, `Lift.Item`, `Lift.Separator`, `Lift.Preview`, plus `useLift()`.
  - Indicator: `Indicator.Root`, `Indicator.Thumb`, `Indicator.Item`, plus `useIndicator()`.
  - Morph: `Morph.Root`, `Morph.State`, `Morph.Trigger`, `Morph.Match`, plus `useMorph()`. The animation starts after the new value renders; states added or removed later are handled automatically.
  - Drag: `Drag.Root`, `Drag.Handle`, `Drag.Scroll`, plus `useDrag()`. Snap points and bounds can be a function of the parent's size.
  - Blur: `Glass` and `Glass.Group`, plus `glass()` (returns `{ class, style }` to spread), `usePress()` and `useGlassGroup()`.
  - Core: `@fluidkit/core/svelte`, the helpers they're built from: `mergeProps`, `PartProps`, `elementRef`, `syncSettings`.
  - The `use*()` functions take their options as a getter and return attachments for `{@attach}`. Call them in a component's script.

## 1.5.0

### Minor Changes

- 54cc634: Vue components and composables: `@fluidkit/lift/vue` and `@fluidkit/indicator/vue`. Vue is an optional peer dependency (3.5+).
  
  - The same parts as in React: `Lift.Root`, `Lift.Target`, `Lift.Menu`, `Lift.Item`, `Lift.Separator`, `Lift.Preview`; `Indicator.Root`, `Indicator.Thumb`, `Indicator.Item`. Namespaced, so `<Lift.Root>` works in `<script setup>` templates.
  - Any part can render as the element in its slot with `as-child`, as in Reka UI; the slot receives the part's state. State is exposed as the same data attributes.
  - `v-model:open` on `Lift.Root`, `v-model` on `Indicator.Root`, plus `active` and `@active-change`. A lift item's `@select` event can call `preventDefault()` to keep the menu open.
  - Composables for custom markup: `useLift()` and `useIndicator()` return function refs for `:ref`. Options can be an object, a ref or a getter.
  - Engines are created once their elements are mounted and updated with `set()` when props change. Server rendering (including Nuxt) and unmounting while a lift is open work.
  - `@fluidkit/core/vue`: the helpers the adapters are built from (`renderPart`, `attachRef`, `useControllable`, `watchSettings`…).

## 1.4.0

### Minor Changes

- c80a491: React: `@fluidkit/lift/react` and `@fluidkit/indicator/react`, React an optional peer (18 or later).
  
  - Components by default, composed of parts: `Lift.Root`, `Lift.Target`, `Lift.Menu`, `Lift.Item`, `Lift.Separator`, `Lift.Preview`; `Indicator.Root`, `Indicator.Thumb`, `Indicator.Item`. Each part renders as an element of yours with `render`, as in Base UI (`render={<img src={src} />}`, or a function of its props and state), our props merged into it. Headless: their state is in data attributes (`data-state`, `data-selected`, `data-active`, `data-disabled`) for any CSS.
  - Controlled or not: `open` / `defaultOpen` / `onOpenChange` for a lift; `value` / `defaultValue` / `onValueChange` for an indicator, and `active` for an item pointed at from elsewhere (the finger on a lift's menu, say). A lift's items have values, `onSelect` on the root is given the one chosen, and an item's own `onSelect` can `preventDefault()` to keep the menu open.
  - Hooks for markup of your own: `useLift()` and `useIndicator()` give refs to bind the engine to your elements, its state and the engine itself.
  - An engine is made once its elements are in the page and given new props by `set()`, never made again for them; callbacks are always the latest. Strict mode, React 18's and 19's refs, server rendering and unmounting while a lift is open all work.
  - `@fluidkit/core/react`: what the adapters are made of (`renderPart`, `mergeProps`, `useMergedRefs`, `useAttach`, `useControllable`, `useSettings`…), for a component of your own.

## 1.3.0

### Minor Changes

- 8c0c800: `SpringAnimator.timeScale`: how fast every spring runs, all of them at once. `0.25` is four times slower: slow motion to look at a transition, or to show one in a bug report. Every package's springs run on core's, so one setting slows them all.

## 1.2.1

### Patch Changes

- c5ea523: `holdSelection` writes `-webkit-user-select` before `user-select`, holding and letting go, so where the prefixed one is an alias of the other the root's own `user-select` is what's left.

## 1.2.0

### Minor Changes

- 835066d: `holdSelection(document)`: no text is selected on the page until it's let go, for a gesture that pulls something around: the root's `user-select` is `none` and iOS's touch callout off, a selection already there is dropped, and holds count, so overlapping gestures share one.

## 1.1.0

### Minor Changes

- 73190c8: `swallowClick(document, except?, ms?)` drops the click a gesture's release would make on its own, as drag and indicator need: the next click in the document within 400ms, but for one on `except`.

## 1.0.0

First release.

- `SpringAnimator`: SwiftUI-style springs (perceptual duration and bounce) over several numeric channels, shared or per channel, solved exactly at any frame rate. `to()` keeps the velocity when retargeting; `retarget()` corrects the flight under way without a second overshoot; `jump()` moves channels at once, keeping their velocity; `velocities()` reads each channel's speed to hand it on; an optional `settle` bounce after the first turn. A frame stamped before the movement was asked for doesn't step it back.
- Boxes as the browser draws them: `measureBox()` (where an element is on screen, its corners and their shape), `radiiOf()`, `cornerOf()` and `fitRadii()` for circular corners fitted the way the browser fits them, `cornerShapeOf()` for `corner-shape` as a superellipse exponent, `drawsCornerShape()`, `radiiCss()`, `px()`, and `still()` to read an element without its inline transforms.
- The Fluid Kit DOM contract: `SURFACE`, `PART` and `AWAY` (`data-fk-surface`, `data-fk-part`, `data-fk-away`).
- ESM with TypeScript declarations and no dependencies.
