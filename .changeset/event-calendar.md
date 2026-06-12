---
'@vespera-ui/vue': minor
'@vespera-ui/svelte': minor
---

Add `EventCalendar` to the Vue and Svelte packages, matching React — the final component for full parity. A month / week / agenda calendar with click-and-drag day selection and an inline "new event" dialog. Events live in local state; the `change` event reports every mutation so a host can persist them. Composes the already-ported Segmented, Dialog, Field, Input, Select, Button, and `toast`. (Angular ships the same as `vsp-event-calendar`, version 0.16.0.)

With this, `@vespera-ui/{vue,svelte,angular}` are at full component parity with `@vespera-ui/react`.
