---
"@fluidkit/react": patch
"@fluidkit/vue": patch
---

An app that imports one component no longer bundles every feature. Components made at the top level are marked pure, so a bundler drops the ones not imported: `Drag` alone from `@fluidkit/react` or `@fluidkit/vue` went from about 28 KB (40 KB in Vue) gzipped to about 7 KB. Svelte's components were dropped already.
