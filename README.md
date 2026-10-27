# Fluid Kit

A family of small libraries for fluid interfaces on the web, for plain JavaScript, React or Vue. Each
package works on its own. When two are used together, they coordinate through DOM attributes
(`data-fk-*`, see [the contract](https://fluidkit.mogilnikov.dev/core#contract)) instead of
importing each other.

**[Documentation](https://fluidkit.mogilnikov.dev)**

## Packages

| Package | What |
| --- | --- |
| [`@fluidkit/blur`](packages/blur/README.md) | A glass material: backdrop blur, fill, rims, press effects, glass that merges between shapes |
| [`@fluidkit/morph`](packages/morph/README.md) | Animates one element into another and back, on interruptible springs |
| [`@fluidkit/indicator`](packages/indicator/README.md) | One element that moves to whatever is hovered, pressed or selected: menus, tabs, segmented controls |
| [`@fluidkit/drag`](packages/drag/README.md) | Drag with rubber-band edges and flick-aware snap points: sheets, swipe actions, switches |
| [`@fluidkit/lift`](packages/lift/README.md) | Long-press to lift anything above the page and open your menu, like iOS context menus |
| [`@fluidkit/core`](packages/core/README.md) | Shared pieces: the spring, element measurement, and the DOM contract |

`apps/docs` is the docs site: one page per package, written in MDX in
`apps/docs/src/content/docs/`, with live demos.

## Development

Requires Node 22.22+ (`.node-version` has 24) and pnpm. Tasks run on [Vite+](https://viteplus.dev)
(`vp`): packages build with `vp pack` and test with `vp test`, and the scripts below run each
package's task with `vp run -r`, in dependency order and cached.

```bash
pnpm install
```

Installing also sets up the git hooks (`.vite-hooks/`): before a commit, staged files are formatted
and linted; a commit message has to be a [conventional commit](https://www.conventionalcommits.org),
`type(scope): subject`, with an optional scope from `core`, `blur`, `morph`, `indicator`, `drag`, `lift`, `docs`,
`repo`, `ci`, `deps` and `release`.

| Script | What |
| --- | --- |
| `pnpm dev` | Builds the packages, then watches them and starts the docs site at http://localhost:4321 |
| `pnpm build` | Builds every package and the docs site |
| `pnpm check-types` | Type checks every package and the docs site |
| `pnpm test` | Runs every package's tests |
| `pnpm fmt` / `pnpm lint` | Formats (TS and JSON; CSS and Markdown are laid out by hand) / lints |
| `pnpm check` | Everything CI checks: format, lint, types, tests |
| `pnpm changeset` | Describes a change for the changelogs and versions |

## Release

Releases run on [changesets](https://github.com/changesets/changesets). A change a user of a package
would notice comes with a changeset: run `pnpm changeset`, pick the packages and the bump, write one
line for the changelog, and commit it with the change. CI asks for one when a package's `src` or
`package.json` changed; `pnpm changeset --empty` says none is needed. See
[.changeset/README.md](.changeset/README.md).

On `main`, the release workflow keeps a "Version packages" pull request up to date with the pending
changesets. Merging it bumps the versions, writes the changelogs, publishes to npm with provenance
and tags each package (`@fluidkit/blur@1.1.0`). Publishing goes through pnpm, which turns the
`workspace:^` dependencies on `@fluidkit/core` into real version ranges.

It publishes with [Trusted Publishing](https://docs.npmjs.com/trusted-publishers): no npm token is
stored anywhere. Each package on npm trusts this repository's `release.yml`, and the workflow proves
who it is with its own OIDC token. A new package has to be published once by hand first
(`pnpm release`, with your npm two-factor code), then trust the workflow in its settings on npm.
`pnpm exec changeset publish-plan` shows what would go out.

## License

MIT © Mikhail Mogilnikov. See [LICENSE](LICENSE).
