---
"@fluidkit/blur": patch
---

Scroll edges (`lb-edge`, `lb-edge-x`) show in minified builds. Given `animation` and `animation-timeline`, Lightning CSS (Vite's minifier) folded the timeline into the shorthand, which browsers reject, so the fade never showed; the animation is now written in longhands.
