---
'@vespera-ui/vue': minor
'@vespera-ui/svelte': minor
---

Add the Select family — `Select`, `Combobox`, `MultiSelect`, and `TokenInput` — to the Vue and Svelte packages, matching React. These share an anchored, portal-rendered floating panel that tracks its trigger on scroll/resize, plus a searchable option list with ↑/↓/↵ keyboard navigation.

- `Select` — themed drop-in single select; auto-enables search at ≥8 options (override with `searchable`).
- `Combobox` — searchable single select with optional `clearable`.
- `MultiSelect` — searchable, tagged multi select with optional `max` and a selected-count footer.
- `TokenInput` — creatable free-text tags (Enter / comma to add, Backspace to remove).

Two-way binding via `v-model` (Vue) / `bind:value` (Svelte). Options accept plain strings/numbers or `{ value, label, swatch }`.

**Breaking (type rename):** the existing native-select option type exported as `SelectOption` is renamed to `NativeSelectOption` (used by `NativeSelect`/`RadioGroup`), freeing `SelectOption` for the richer Combobox option shape — aligning with React. (Angular ships the same components as `vsp-select` / `vsp-combobox` / `vsp-multi-select` / `vsp-token-input`, version 0.13.0, with the same `SelectOption` → `NativeSelectOption` rename.)
