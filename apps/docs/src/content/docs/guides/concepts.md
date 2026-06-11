---
title: Concepts
description: How Vespera fits together — the CSS-first model, the theming root, tokens, and the packages.
---

Vespera is built on one idea: **the design lives in CSS, not in the components.**
Once that clicks, everything else follows.

## CSS-first

Every visual decision — color, spacing, radius, density, the glow — is a **CSS variable**.
Components are thin: they emit semantic markup with class names and read those variables.
Because the look lives in CSS, the _same_ design works in any framework, or in plain HTML.

```text
@vespera-ui/css      the design: tokens + classes. The single source of truth.
@vespera-ui/icons    framework-neutral SVG icons.
@vespera-ui/react    thin, typed wrappers over the CSS classes.  (Vue / Svelte / … later)
```

A framework package never re-implements the look — it just renders the right class names.
That's why one design system can cover many frameworks without drifting.

## The theming root: `.vsp-root`

Everything Vespera renders must live inside an element with the `vsp-root` class. That element
**carries the theme** — the tokens are defined on it, and descendants inherit them.

```html
<div class="vsp-root" data-theme="dark" data-density="comfortable" data-corners="round">
  <!-- your UI -->
</div>
```

| Attribute | Values | Effect |
| --- | --- | --- |
| `data-theme` | `dark` · `light` | Full palette swap |
| `data-density` | `compact` · `comfortable` · `spacious` | Control heights, padding, gaps |
| `data-corners` | `round` · `soft` · `sharp` | Border radii |
| `--accent` (inline) | any color | Brand / primary color |

Change any of these and the whole subtree re-themes instantly — no rebuild. See
[Theming](/vespera-ui/guides/theming/).

:::caution[Overlays portal into the root]
Dialogs, menus, toasts, and the command palette **render into the nearest `.vsp-root`** so they
keep the theme tokens (otherwise they'd lose their colors). In React this is automatic.
:::

## The four CSS layers

`@vespera-ui/css` is split so you can take only what you need (the bundle includes all four):

| Layer | Contents |
| --- | --- |
| `tokens.css` | The variables: palette, themes, density, corners. |
| `base.css` | Reset, root background + glow, typography helpers, scrollbars. |
| `shell.css` | App-shell classes (`.vsp-*`): sidebar, topbar, nav. |
| `components.css` | Primitives (`.btn`, `.card`, `.badge`, `.chip`) + components (`.ui-*`). |

## Class families

- **Primitives** — unprefixed: `.btn`, `.card`, `.badge`, `.chip`, `.meter`.
- **Components** — `.ui-*`: `.ui-input`, `.ui-switch`, `.ui-alert`, `.ui-dialog`, …
- **Shell** — `.vsp-*`: the app chrome (sidebar / topbar).

All of them only style correctly **inside `.vsp-root`**.

## Never hardcode

Components contain no hex colors. To re-skin, override **tokens** — never edit component CSS.
Use `color-mix(in oklab, var(--accent) N%, …)` for derived shades.

## Built for AI

Every component's API is published as a machine-readable
[`manifest/react.json`](https://github.com/forgialabs/vespera-ui/blob/main/manifest/react.json),
and the repo ships skills so coding agents can author and theme Vespera correctly.
