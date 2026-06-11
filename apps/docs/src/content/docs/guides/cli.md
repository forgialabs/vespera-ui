---
title: CLI
description: Copy Vespera components straight into your project with the vespera CLI, shadcn-style.
---

Prefer to **own the component source**? The `vespera` CLI copies components into your project,
shadcn-style — you get the `.tsx` files and can edit them freely. Styling still comes from
`@vespera-ui/css` (the design system's source of truth), so theming stays centralized.

This is an alternative to installing [`@vespera-ui/react`](/vespera-ui/guides/installation/) — use
whichever fits your project.

## Add a component

```bash
npx vespera add button field card
```

This copies each component **and its local dependencies** into `src/components/vespera/`, then
tells you which packages to install:

```
  add   src/components/vespera/Field.tsx
  add   src/components/vespera/cx.ts

✓ 2 file(s) written to src/components/vespera

Make sure these are installed:
  npm install @vespera-ui/css @vespera-ui/icons
```

Dependencies are resolved transitively — `vespera add dialog` also brings `portal` and `hooks`;
`vespera add blocks` brings the primitives it composes.

## Commands

| Command                      | What it does                                         |
| ---------------------------- | ---------------------------------------------------- |
| `vespera add <component...>` | Copy components + their local deps into your project |
| `vespera list`               | List available components                            |
| `vespera init`               | Print setup steps for `@vespera-ui/css`              |

## Options

| Option             | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `-d, --dir <path>` | Target directory (default `src/components/vespera`)  |
| `-f, --force`      | Overwrite files that already exist                   |

## Finish setup

Install the listed dependencies, import the CSS once, and wrap your app in a themed root:

```ts
import '@vespera-ui/css';
```

```html
<div class="vsp-root" data-theme="dark">…</div>
```

See [Theming](/vespera-ui/guides/theming/) for the available `data-theme`, `data-density`,
`data-corners`, and `--accent` knobs.
