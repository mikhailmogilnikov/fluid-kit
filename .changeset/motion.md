---
"@fluidkit/core": minor
---

Motion: Apple's springs and transitions by name, for any package and for CSS.

- `springs.smooth()`, `springs.snappy()`, `springs.bouncy()` and `springs.interactive()` give a `SpringParams` for any package's `spring`; given `{ duration, extraBounce }`, they tune it, as SwiftUI's `.snappy(duration:extraBounce:)` does.
- `transitions.opacity()`, `transitions.scale()`, `transitions.blurReplace()` and `transitions.move()` give a `TransitionParams` (`{ opacity, scale, blur, x, y }`): how an element comes in and goes out, for Layout's `enter` and `exit`. Combined by spreading.
- `springCss(params)` writes a spring for CSS: its own curve as a `linear()` easing, and how long it takes to come to rest.
- `@fluidkit/core/motion.css`: each spring as `--fk-<name>` (and its `-easing` and `-duration`), and `fk-transition` with `fk-opacity`, `fk-scale`, `fk-blur-replace`, `fk-move` and the springs' classes, to bring an element in as it's put in the page or shown and take it out as it's hidden (`hidden`, a `<dialog>` or popover closed), tuned with variables. Reduced motion only fades.
