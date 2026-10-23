# @fluidkit/core

What the [Fluid Kit](https://liquid-web.mogilnikov.dev) packages share: an interruptible,
velocity-keeping spring every moving part runs on, boxes read as the browser draws them, and the
DOM attributes they meet by. You get it with `@fluidkit/blur`, `@fluidkit/morph` or
`@fluidkit/indicator`; install it on its own for the spring.

**[Documentation](https://liquid-web.mogilnikov.dev/core)** · [Changelog](CHANGELOG.md)

```bash
npm install @fluidkit/core
```

```js
import { SpringAnimator } from "@fluidkit/core";

const spring = new SpringAnimator({ width: 100 }, { duration: 0.4, bounce: 0.2 }, ({ width }) => {
  el.style.width = `${width}px`;
});

spring.to({ width: 240 });
```

## License

MIT © Mikhail Mogilnikov. See [LICENSE](LICENSE).
