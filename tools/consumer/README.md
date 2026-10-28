# @fluidkit/consumer

Private. The packages as an app gets them: packed as they'd be published, installed with npm into
an app outside the workspace (`app/`, copied to a temporary folder), its React, Vue and Svelte code
type-checked against their declarations with `skipLibCheck` off, built with Vite, and the same scene
checked in each framework in Chromium, WebKit and Firefox.

```sh
pnpm --filter @fluidkit/consumer check            # all three browsers
pnpm --filter @fluidkit/consumer check webkit     # one of them
pnpm --filter @fluidkit/consumer check --keep     # the app left in place, its path printed
```

The browsers come from `pnpm --filter @fluidkit/consumer exec playwright install chromium webkit firefox`.
