---
"@fluidkit/morph": patch
---

A state that's a popover keeps its surface on the way: the shape's fill and the copies no longer take its `popover` attribute, which hid them (a popover that isn't open is `display: none`).
