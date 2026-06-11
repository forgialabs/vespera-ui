---
'@vespera-ui/css': patch
---

Scope the base reset to `.vsp-root`: importing `@vespera-ui/css` no longer styles the host
page's `<body>` or sets global `box-sizing`. Components are unaffected — the `.vsp-root`
element already carries the font, background, and color — and the package can now be embedded
inside other styled pages (docs, dashboards, micro-frontends) without bleeding.
