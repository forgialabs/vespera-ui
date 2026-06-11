---
'@vespera-ui/react': minor
---

Add overlay components: `Dialog`, `Sheet`, `Anchored`, `DropdownMenu`, `Popover`,
`ToastHost` + a `toast()` API (replacing the prototype's `window.toast`), and
`CommandPalette` with the `useCmdK` and `useEsc` hooks. All overlays portal into the
nearest `.vsp-root` so they keep the theme tokens.
