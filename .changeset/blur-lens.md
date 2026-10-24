---
"@fluidkit/blur": minor
---

A lens: `lb-lens`, or `--lb-lens` from 0 to 1. Clear glass that hardly blurs or saturates, with a ring of light at its rim, a glow inside it and a deeper shadow, as a thumb that's held is in iOS. `--lb-lens` is inherited and registered, so it transitions and any selector can set it: `.thumb[data-dragging] { --lb-lens: 1 }` turns a held thumb into a lens and back. It doesn't magnify what's under it. Solid glass (reduced transparency, more contrast) stays solid.
