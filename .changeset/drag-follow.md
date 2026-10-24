---
"@fluidkit/drag": minor
---

`follow`: a spring the element chases the pointer on while dragged, instead of sitting exactly under it, so a pointer flung back and forth is followed through, as iOS 27's switches do. Where a flick goes is still judged from the pointer. And a first move that goes far past the slop at once (a pointer flung) now moves the element by all but the slop, where it used to be lost.
