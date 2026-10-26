---
"@fluidkit/lift": minor
---

A strict review's fixes, and keys for the menu.

- `preview` keeps its own size, centered on the element and kept on screen, as iOS's bigger previews are; one taken from the page goes back where it was, its style and attributes as they were. It was squeezed into the element's box and left out of the page.
- Closing, what's lifted settles on the element where it is by then: a page scrolled while it was open (a dragged scrollbar, a smooth scroll still running) no longer leaves it to land where the element was, the element showing elsewhere.
- The page doesn't scroll under it by keys either: PageUp, PageDown, Space and the side arrows are kept from it.
- The arrow keys go through the menu's items, past disabled ones, Home and End to the ends.
- A copy is a picture: its form controls are in no form or radio group (a checked radio in it unchecked its original in the page), its frames are empty boxes instead of being loaded again, its videos their frame as it was.
- A disabled item (`:disabled`, `aria-disabled="true"`) is never chosen, a click on it included; opened by a key, the first item focused is the first enabled one.
- No text is selected while a mouse that lifted it slides onto the menu (Safari selected the items).
- Closed by the browser itself (a second Escape it doesn't let a page keep open), the element is shown at once, not after the springs.
- One lift is open at a time in a page: another opening closes it at once, not two modals stacked.
- A window made only shorter (a phone's bars, its keyboard) no longer closes it; narrower or wider still does.
