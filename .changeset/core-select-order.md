---
"@fluidkit/core": patch
---

`holdSelection` writes `-webkit-user-select` before `user-select`, holding and letting go, so where the prefixed one is an alias of the other the root's own `user-select` is what's left.
