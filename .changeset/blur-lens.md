---
"@fluidkit/blur": minor
---

A lens: `lb-lens`, or `--lb-lens` from 0 to 1. The same glass with no blur, so what's under it shows sharp, as a thumb that's held is in iOS. `--lb-lens` is inherited and registered, so it transitions and any selector can set it: `.thumb[data-dragging] { --lb-lens: 1 }` turns a held thumb into a lens and back. `--lb-transparency` is registered now too, so it transitions as well.
