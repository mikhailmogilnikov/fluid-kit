---
"@fluidkit/drag": patch
---

A finger dragging along one axis keeps the drag when it strays across: the page no longer starts scrolling mid-drag (Safari did, and took the pointer). A gesture that sets off across the axis still scrolls the page.
