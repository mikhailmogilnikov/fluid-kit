---
"@fluidkit/blur": patch
---

`Glass` from `@fluidkit/blur/vue` type-checks in an app that checks libraries (`skipLibCheck: false`): its declaration no longer spells out Vue's instance type, which `vue-tsc` rejected.
