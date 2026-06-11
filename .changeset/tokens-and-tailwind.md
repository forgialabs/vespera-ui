---
'@vespera-ui/tokens': minor
'@vespera-ui/tailwind': minor
---

Add two new packages:

- **`@vespera-ui/tokens`** — the Vespera design tokens as portable data (typed TS/ESM/CJS plus a
  raw `tokens.json`). Mirrors the CSS variables that `@vespera-ui/css` sets on `.vsp-root`:
  fonts, named palette, accent, radii per corner style, density scales, and dark/light theme
  colors.
- **`@vespera-ui/tailwind`** — a Tailwind CSS preset. Semantic colors (`bg`, `surface-*`,
  `text*`, `accent`, `border*`, status) map to the live CSS variables so utilities follow
  `data-theme` / `data-density` / `data-corners` / inline `--accent`; the fixed palette comes
  from `@vespera-ui/tokens`. Also maps radii, fonts, and shadows.
