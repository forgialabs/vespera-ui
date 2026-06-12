---
'@vespera-ui/vue': minor
'@vespera-ui/svelte': minor
---

Begin porting the composite **Blocks** to the Vue and Svelte packages (batch 1): `Block` (the titled card frame), `SystemStatusBlock` (service health with 30-day uptime bars), and `AuditLogBlock` (a timeline of privileged actions). Also adds an inline icon helper — `blockIcon()` (Vue) / `Icon` (Svelte) / `vsp-icon` (Angular) — so the wrappers can render named icons without depending on `@vespera-ui/icons`. (Angular ships the same as `vsp-block` / `vsp-system-status-block` / `vsp-audit-log-block` + `vsp-icon`, version 0.17.0.)
