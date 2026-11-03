# Contributing to Fluid Kit

Thanks for helping. Bugs and ideas go to [issues](https://github.com/mikhailmogilnikov/fluid-kit/issues/new/choose);
a change comes as a pull request against `main`, with a changeset if a user would notice it (see
[Release](#release)).

## Layout

- `packages/core/src`: a folder for each feature's engine, the base they share, and the stylesheet
- `packages/{react,vue,svelte}/src`: a file or folder for each feature's components
- `apps/docs`: the docs site, one page per feature in MDX (`src/content/docs/`) with live demos, and
  the playground (`/playground`), every hard case checked in Chromium, WebKit and Firefox on CI
- `tools/consumer`: the packages packed as published, installed in an app and run in React, Vue
  and Svelte, in the same three browsers

The features never import each other: each is a folder of the engine in `packages/core/src` that
imports only the shared base, and they meet through DOM attributes (`data-fk-*`, see
[the contract](https://fluidkit.mogilnikov.dev/core#contract)). A test of core's module boundaries
keeps it so.

## Development

Requires Node 22.22+ (`.node-version` has 24) and pnpm. Tasks run on [Vite+](https://viteplus.dev)
(`vp`): packages build with `vp pack` and test with `vp test`, and the scripts below run each
package's task with `vp run -r`, in dependency order and cached.

```bash
pnpm install
```

Installing also sets up the git hooks (`.vite-hooks/`): before a commit, staged files are formatted
and linted; a commit message has to be a [conventional commit](https://www.conventionalcommits.org),
`type(scope): subject`, with an optional scope: a package (`core`, `react`, `vue`, `svelte`), a
feature (`blur`, `morph`, `indicator`, `drag`, `lift`, `layout`, `motion`), or `docs`, `repo`, `ci`,
`deps` and `release`.

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

Releases run on [changesets](https://github.com/changesets/changesets). A change a user would notice
comes with a changeset: run `pnpm changeset`, pick the packages and the bump, write one line for the
changelog, and commit it with the change. The four packages are a fixed group: they always come out
together, at the same version, whichever of them changed. CI asks for one when a package's `src` or
`package.json` changed; `pnpm changeset --empty` says none is needed. See
[.changeset/README.md](.changeset/README.md).

On `main`, the release workflow keeps a "Version packages" pull request up to date with the pending
changesets. Merging it bumps the versions, writes the changelogs, publishes to npm with provenance
and tags each package (`@fluidkit/core@2.0.0`). Publishing goes through pnpm, which turns the
framework packages' `workspace:*` dependency on `@fluidkit/core` into that same exact version.

It publishes with [Trusted Publishing](https://docs.npmjs.com/trusted-publishers): no npm token is
stored anywhere. Each package on npm trusts this repository's `release.yml`, and the workflow proves
who it is with its own OIDC token. A new package has to be published once by hand first
(`pnpm release`, with your npm two-factor code), then trust the workflow in its settings on npm.
`pnpm exec changeset publish-plan` shows what would go out.
