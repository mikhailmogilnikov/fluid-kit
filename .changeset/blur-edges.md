---
"@fluidkit/blur": minor
---

Scroll edges: `lb-edge` on an element that scrolls fades its content out toward its top and bottom, as under the bars in iOS; `lb-edge-x`, toward its sides. An edge shows only while there's content past it, so at either end of the scroll its edge is gone and covers nothing. Pure CSS, a `mask` driven by scroll-driven animations; `--lb-edge-size` (28px) sets how far it reaches. Without scroll-driven animations there are no edges.
