---
'@vespera-ui/vue': minor
'@vespera-ui/svelte': minor
---

Add the first overlays — `Dialog` (modal) and `Sheet` (side drawer) — to the Vue and Svelte
wrappers, with Escape-to-close and click-outside. Vue portals via `<Teleport>`, Svelte via a
`portal` action (both into the nearest `.vsp-root`). (Angular gains `vsp-dialog` / `vsp-sheet`,
rendered in place since `.ui-overlay` is `position: fixed` — published separately.)
