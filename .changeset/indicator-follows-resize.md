---
"@fluidkit/indicator": patch
---

Resting on an item that grows or shrinks (its text animating, say), the indicator keeps to it frame by frame instead of chasing it on a spring a few frames behind. And it's no longer a fraction of a pixel off its item in a container whose width isn't a whole number: `offsetWidth` is rounded, and was taken for a scale.
