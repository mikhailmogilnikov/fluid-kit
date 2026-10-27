---
"@fluidkit/morph": patch
"@fluidkit/indicator": patch
---

`defaultValue` no longer decides the type of the values in React and Vue, as it already didn't in Svelte: `useMorph({ defaultValue: "a" })` now takes `to("b")`, and `useIndicator({ defaultValue: "a" })` takes `select("b")`, without naming the type.
