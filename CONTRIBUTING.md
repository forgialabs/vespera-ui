# Contributing to Vespera

Thanks for your interest in contributing! This document covers how to get set up,
the conventions we follow, and the legal sign-off we require.

## Getting set up

Requirements: **Node ≥ 20** and **pnpm ≥ 9**.

```bash
git clone git@github.com:forgialabs/vespera-ui.git
cd vespera-ui
pnpm install
pnpm build
```

Useful scripts (run from the repo root):

| Command          | What it does                          |
| ---------------- | ------------------------------------- |
| `pnpm build`     | Build all packages                    |
| `pnpm typecheck` | Type-check all packages               |
| `pnpm lint`      | Lint with ESLint                      |
| `pnpm format`    | Format with Prettier                  |
| `pnpm changeset` | Record a versioned change (see below) |

## Project principles

- **The CSS is the source of truth.** Never fork styles into a framework package — every
  framework wrapper consumes `@vespera-ui/css`. Use tokens, never hardcoded hex.
- **The prototype leads the design.** New components are designed in `prototype/` first,
  then productized into `packages/`. See [prototype/AGENTS.md](./prototype/AGENTS.md) for
  the design conventions and [docs/ROADMAP.md](./docs/ROADMAP.md) for the plan.
- **Keep components thin and prop-driven.**

## Branches & commits

- Branch off `main`: `feat/…`, `fix/…`, `docs/…`, `chore/…`.
- Write clear, present-tense commit messages.
- Open a pull request against `main`. CI (lint, type-check, build) must pass.

## Changesets

If your change affects a published package, add a changeset:

```bash
pnpm changeset
```

Choose the bump (patch / minor / major) and write a one-line summary. Commit the generated
file with your change.

## Developer Certificate of Origin

This project uses the **Developer Certificate of Origin (DCO)** instead of a CLA. The DCO
is a lightweight statement that you have the right to submit your contribution under the
project's license. You agree to it by adding a `Signed-off-by` line to each commit:

```bash
git commit -s -m "fix: correct caret color on inputs"
```

This appends:

```
Signed-off-by: Your Name <your.email@example.com>
```

The name and email must match your real identity (the ones in your git config). The full
text of the DCO is below.

<details>
<summary>Developer Certificate of Origin 1.1</summary>

```
By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I have the right to
    submit it under the open source license indicated in the file; or

(b) The contribution is based upon previous work that, to the best of my knowledge, is
    covered under an appropriate open source license and I have the right under that
    license to submit that work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am permitted to submit under a
    different license), as indicated in the file; or

(c) The contribution was provided directly to me by some other person who certified
    (a), (b) or (c) and I have not modified it.

(d) I understand and agree that this project and the contribution are public and that a
    record of the contribution (including all personal information I submit with it,
    including my sign-off) is maintained indefinitely and may be redistributed consistent
    with this project or the open source license(s) involved.
```

</details>

## License

By contributing, you agree that your contributions will be licensed under the
[Apache License 2.0](./LICENSE).
