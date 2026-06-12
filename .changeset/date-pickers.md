---
'@vespera-ui/vue': minor
'@vespera-ui/svelte': minor
---

Add the date pickers — `Calendar`, `DatePicker`, and `DateRangePicker` (plus the `fmtDate` helper) — to the Vue and Svelte packages, matching React. They reuse the anchored portal panel from the Select family.

- `Calendar` — the bare month grid (prev/next nav, today/selected/in-range states).
- `DatePicker` — single-date trigger + popover calendar.
- `DateRangePicker` — start/end range selection with in-range highlighting, a day-count footer, and Clear / Done actions.

Two-way binding via `v-model` (Vue) / `bind:value` (Svelte). (Angular ships the same as `vsp-calendar` / `vsp-date-picker` / `vsp-date-range-picker`, version 0.15.0.)
