---
'@vespera-ui/css': patch
---

Remove the forced `min-height: 100vh` from `.vsp-root`. It made any wrapped subtree fill the
viewport, which is wrong for embedded use (cards, previews, panels). Components and full-page
apps are unaffected — for a full-bleed page, set `min-height` yourself (e.g. on `.vsp-root` or
a `.vsp-app` wrapper).
