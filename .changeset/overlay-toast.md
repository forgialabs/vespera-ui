---
'@vespera-ui/vue': minor
'@vespera-ui/svelte': minor
---

Add Toast system (`toast()` + `ToastHost`) to the Vue and Svelte packages, matching React. Mount `ToastHost` once inside your `.vsp-root` and call `toast({ title, body, tone, duration })` from anywhere. Auto-dismisses after `duration` (default 3600ms) with a manual dismiss control. (Angular ships the same as `vsp-toast-host` + `toast()`, version 0.11.0.)
