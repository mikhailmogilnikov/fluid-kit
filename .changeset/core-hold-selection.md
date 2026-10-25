---
"@fluidkit/core": minor
---

`holdSelection(document)`: no text is selected on the page until it's let go, for a gesture that pulls something around: the root's `user-select` is `none` and iOS's touch callout off, a selection already there is dropped, and holds count, so overlapping gestures share one.
