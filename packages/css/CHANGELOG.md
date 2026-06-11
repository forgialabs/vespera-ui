# @vespera-ui/css

## 0.1.1

### Patch Changes

- 84290ed: Remove the forced `min-height: 100vh` from `.vsp-root`. It made any wrapped subtree fill the
  viewport, which is wrong for embedded use (cards, previews, panels). Components and full-page
  apps are unaffected — for a full-bleed page, set `min-height` yourself (e.g. on `.vsp-root` or
  a `.vsp-app` wrapper).
- 37db9b5: Scope the base reset to `.vsp-root`: importing `@vespera-ui/css` no longer styles the host
  page's `<body>` or sets global `box-sizing`. Components are unaffected — the `.vsp-root`
  element already carries the font, background, and color — and the package can now be embedded
  inside other styled pages (docs, dashboards, micro-frontends) without bleeding.

## 0.1.0

### Minor Changes

- a92393d: Initial port of the Vespera design system CSS. Ships framework-agnostic tokens, base styles,
  app shell, and component styles — all themed via data-attributes and CSS variables on
  `.vsp-root` (`data-theme`, `data-density`, `data-corners`, `--accent`). Split into
  `tokens.css`, `base.css`, `shell.css`, and `components.css`, with a `vespera.css` bundle entry.
