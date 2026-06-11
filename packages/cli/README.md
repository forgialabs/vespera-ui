# @vespera-ui/cli

Copy [Vespera](https://github.com/forgialabs/vespera-ui) components straight into your project —
shadcn-style. You own the source: tweak it freely. Components still rely on `@vespera-ui/css`
for styling (the design system's source of truth), so theming stays centralized.

```bash
npx vespera add button field card
```

## Commands

| Command                      | What it does                                         |
| ---------------------------- | ---------------------------------------------------- |
| `vespera add <component...>` | Copy components + their local deps into your project |
| `vespera list`               | List available components                            |
| `vespera init`               | Print setup steps for `@vespera-ui/css`              |

## Options

| Option             | Description                                         |
| ------------------ | --------------------------------------------------- |
| `-d, --dir <path>` | Target directory (default `src/components/vespera`) |
| `-f, --force`      | Overwrite files that already exist                  |

## How it works

Each component is copied from a registry generated from `@vespera-ui/react`'s real source, with
its **local dependencies resolved transitively** — so `vespera add dialog` also brings `portal`
and `hooks`, and `vespera add blocks` brings the primitives it composes. External packages it
needs (e.g. `@vespera-ui/icons`) are printed for you to install.

After copying, install the listed dependencies, import the CSS once, and wrap your app:

```ts
import '@vespera-ui/css';
```

```html
<div class="vsp-root" data-theme="dark">…</div>
```

License: Apache-2.0
