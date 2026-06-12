# @vespera-ui/vue

## 0.11.0

### Minor Changes

- c089b5f: Add `EventCalendar` to the Vue and Svelte packages, matching React — the final component for full parity. A month / week / agenda calendar with click-and-drag day selection and an inline "new event" dialog. Events live in local state; the `change` event reports every mutation so a host can persist them. Composes the already-ported Segmented, Dialog, Field, Input, Select, Button, and `toast`. (Angular ships the same as `vsp-event-calendar`, version 0.16.0.)

  With this, `@vespera-ui/{vue,svelte,angular}` are at full component parity with `@vespera-ui/react`.

## 0.10.0

### Minor Changes

- 3a01889: Add the date pickers — `Calendar`, `DatePicker`, and `DateRangePicker` (plus the `fmtDate` helper) — to the Vue and Svelte packages, matching React. They reuse the anchored portal panel from the Select family.

  - `Calendar` — the bare month grid (prev/next nav, today/selected/in-range states).
  - `DatePicker` — single-date trigger + popover calendar.
  - `DateRangePicker` — start/end range selection with in-range highlighting, a day-count footer, and Clear / Done actions.

  Two-way binding via `v-model` (Vue) / `bind:value` (Svelte). (Angular ships the same as `vsp-calendar` / `vsp-date-picker` / `vsp-date-range-picker`, version 0.15.0.)

## 0.9.0

### Minor Changes

- 42608a9: Add `FileDropzone` to the Vue and Svelte packages, matching React. Click to browse or drag-and-drop files; highlights on drag-over and emits the selected `File[]`. Supports `accept`, `multiple`, and a custom `hint`. (Angular ships the same as `vsp-file-dropzone`, version 0.14.0.)

## 0.8.0

### Minor Changes

- 02c0c4c: Add the Select family — `Select`, `Combobox`, `MultiSelect`, and `TokenInput` — to the Vue and Svelte packages, matching React. These share an anchored, portal-rendered floating panel that tracks its trigger on scroll/resize, plus a searchable option list with ↑/↓/↵ keyboard navigation.

  - `Select` — themed drop-in single select; auto-enables search at ≥8 options (override with `searchable`).
  - `Combobox` — searchable single select with optional `clearable`.
  - `MultiSelect` — searchable, tagged multi select with optional `max` and a selected-count footer.
  - `TokenInput` — creatable free-text tags (Enter / comma to add, Backspace to remove).

  Two-way binding via `v-model` (Vue) / `bind:value` (Svelte). Options accept plain strings/numbers or `{ value, label, swatch }`.

  **Breaking (type rename):** the existing native-select option type exported as `SelectOption` is renamed to `NativeSelectOption` (used by `NativeSelect`/`RadioGroup`), freeing `SelectOption` for the richer Combobox option shape — aligning with React. (Angular ships the same components as `vsp-select` / `vsp-combobox` / `vsp-multi-select` / `vsp-token-input`, version 0.13.0, with the same `SelectOption` → `NativeSelectOption` rename.)

## 0.7.0

### Minor Changes

- 18d0a57: Add `CommandPalette` (⌘K-style command modal) to the Vue and Svelte packages, matching React. Controlled via `open` + `onclose`, takes `groups` of `CommandItem`s; supports live filtering, keyboard navigation (↑/↓/↵), Escape to close, and backdrop-dismiss. (Angular ships the same as `vsp-command-palette`, version 0.12.0.)
- 166b117: Add Toast system (`toast()` + `ToastHost`) to the Vue and Svelte packages, matching React. Mount `ToastHost` once inside your `.vsp-root` and call `toast({ title, body, tone, duration })` from anywhere. Auto-dismisses after `duration` (default 3600ms) with a manual dismiss control. (Angular ships the same as `vsp-toast-host` + `toast()`, version 0.11.0.)
- 1d054b5: Add the first overlays — `Dialog` (modal) and `Sheet` (side drawer) — to the Vue and Svelte
  wrappers, with Escape-to-close and click-outside. Vue portals via `<Teleport>`, Svelte via a
  `portal` action (both into the nearest `.vsp-root`). (Angular gains `vsp-dialog` / `vsp-sheet`,
  rendered in place since `.ui-overlay` is `position: fixed` — published separately.)
- 6a7b9e3: Add anchored/floating overlays — `Anchored` (positioning base), `DropdownMenu`, and `Popover` —
  to the Vue and Svelte wrappers. They anchor a fixed-positioned layer to a trigger, with
  click-outside, Escape, and reposition-on-resize. (Angular gains `vsp-anchored`,
  `vsp-dropdown-menu`, `vsp-popover` — published separately.)
- ce74367: Add `Tooltip` (hover/focus tooltip, top or bottom) to the Vue and Svelte wrappers. Shows on
  hover and keyboard focus, positioned against the trigger. (Angular gains `vsp-tooltip` —
  published separately.)

## 0.6.0

### Minor Changes

- 6c9c964: Add `AreaChart` and `BarChart` (fixed-`width` static versions — axes, grid, smooth area, dual
  series, bars) to the Vue and Svelte wrappers, completing the chart family. (Angular gains
  `vsp-area-chart` / `vsp-bar-chart` — published separately.) The responsive/hover behavior of the
  React originals isn't included; pass an explicit `width`.
- 123164f: Add `OTPInput` (one-time-code field with auto-advance + backspace navigation) to the Vue and
  Svelte wrappers. (Angular gains `vsp-otp-input` — published separately.)
- a420f93: Add `Tree` (recursive, expand/collapse + selection) to the Vue and Svelte wrappers. (Angular
  gains `vsp-tree` — via a recursive `ng-template` — published separately.)

## 0.5.0

### Minor Changes

- 7a54015: Add form-extra components to the Vue and Svelte wrappers: `NumberStepper`, `CopyButton`
  (clipboard), and `InlineEdit`. (Angular gains the same — `vsp-number-stepper`, `vsp-copy-button`,
  `vsp-inline-edit` — published separately.)

## 0.4.0

### Minor Changes

- bcc25ab: Add charts to the Vue and Svelte wrappers: `Sparkline`, `Donut`, and `StatCard` (with embedded
  sparkline). (Angular gains the same — `vsp-sparkline`, `vsp-donut`, `vsp-stat-card` — published
  separately.) The responsive `AreaChart`/`BarChart` (with hover) remain React-only for now.

## 0.3.0

### Minor Changes

- 5c2e08d: Add structural components to the Vue and Svelte wrappers: `Banner`, `EmptyState`, and
  `Accordion` (multi/single-open). (Angular gains the same — `vsp-banner`, `vsp-empty-state`,
  `vsp-accordion` — published separately.) Default banner/empty icons are inlined as SVG.

## 0.2.0

### Minor Changes

- 9af0cbf: Add data-display components to the Vue and Svelte wrappers: `CircularProgress`, `Stat`,
  `Timeline`, and `DescriptionList`. (Angular gains the same — `vsp-circular-progress`, `vsp-stat`,
  `vsp-timeline`, `vsp-description-list` — published separately.)
- 22701a6: Add display & feedback components to the Vue and Svelte wrappers: `Progress`, `Skeleton`,
  `Avatar`, `AvatarGroup`, and `Segmented`. (Angular gains the same — `vsp-progress`,
  `vsp-skeleton`, `vsp-avatar`, `vsp-avatar-group`, `vsp-segmented` — published separately.)
- 5843e13: Add form controls to the Vue and Svelte wrappers: `Radio`, `RadioGroup`, `Slider`, and
  `NativeSelect`. (Angular gains the same — `vsp-radio`, `vsp-radio-group`, `vsp-slider`,
  `vsp-native-select` — published separately.)
- c246205: Add navigation components to the Vue and Svelte wrappers: `Tabs`, `Breadcrumb`, `Pagination`,
  and `Stepper`. (Angular gains the same — `vsp-tabs`, `vsp-breadcrumb`, `vsp-pagination`,
  `vsp-stepper` — published separately.) Chevron/check icons are inlined as SVG, so the wrappers
  stay dependency-free.
