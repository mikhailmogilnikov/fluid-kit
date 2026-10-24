---
"@fluidkit/drag": minor
---

`scroll`: an area inside that scrolls along the drag's axis, such as a sheet's list, shares one finger's gesture with the element, as iOS sheets do. A finger in the list moves the sheet when it pulls toward the later snap points with the list at its start, or pushes back while the sheet isn't at its first; else the list scrolls with its own momentum. A sheet pushed all the way hands the rest of the push to the list, and pulled back, the list scrolls back to its start before the sheet moves; a list scrolled back to its start and still pulled hands the gesture to the sheet where the browser lets the scroll be stopped. With `scroll`, the handle's `touch-action` is left alone: fingers are followed by their touch events.
