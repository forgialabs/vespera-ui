---
name: vespera-theming
description: Theme or restyle the Vespera design system — change colors/accent, dark/light, density, corners, or build a custom theme. Use when customizing the look of Vespera (@vespera-ui/css) or asked to "rebrand"/"recolor"/"theme" it.
---

# Theming Vespera

Vespera has **no hardcoded colors in components** — every visual is a CSS variable on the
`.vsp-root` element. Re-theme by setting data-attributes or overriding tokens. Never edit
component CSS to change appearance.

## The root

Everything Vespera renders must live inside `.vsp-root`, which carries the theme:

```html
<div class="vsp-root" data-theme="dark" data-density="comfortable" data-corners="round">…</div>
```

## Switches (data-attributes)

| Attribute      | Values                                   | Effect                         |
| -------------- | ---------------------------------------- | ------------------------------ |
| `data-theme`   | `dark` \| `light`                        | Full palette swap              |
| `data-density` | `compact` \| `comfortable` \| `spacious` | Control heights, padding, gaps |
| `data-corners` | `round` \| `soft` \| `sharp`             | Border radii                   |

## The accent (and any token)

Set inline or in your own CSS — it cascades everywhere:

```html
<div class="vsp-root" data-theme="dark" style="--accent: #1fb574">…</div>
```

Key tokens (defined in `packages/css/src/tokens.css`): `--bg`, `--surface-1/2/3`, `--text`,
`--text-dim`, `--text-faint`, `--border`, `--border-strong`, `--accent`, `--accent-2`,
`--accent-ink`, `--success`, `--danger`, `--warning`, `--r-sm/md/lg`, `--pad`, `--gap`,
`--ctrl-h`.

## Building a custom theme

Add a new theme block keyed off an attribute value, mirroring the `dark`/`light` blocks in
`tokens.css`:

```css
.vsp-root[data-theme='aurora'] {
  --bg: #0a0f1e;
  --surface-1: #111935;
  --text: #eaf0ff;
  --accent: #6ee7ff;
  /* …override the full token set… */
}
```

## Rules

- Override **tokens**, never component rules.
- Use `color-mix(in oklab, var(--accent) N%, …)` for derived shades, not new hex.
- When adding a token, add it to **every** theme block so themes stay complete.
- Keep `--accent-ink` readable on `--accent` (it's the on-accent text color).
