# @fluidkit/core

Shared building blocks of the [Fluid Kit](https://fluidkit.mogilnikov.dev) packages: an
interruptible spring that keeps its velocity, element measurement, and the DOM attributes the
packages use to work together. It comes with every other package; install it on its own if you only
need the spring.

**[Documentation](https://fluidkit.mogilnikov.dev/core)** · [Changelog](CHANGELOG.md)

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
