# @vespera-ui/react

## 0.3.0

### Minor Changes

- ff0328a: Add composed **blocks** — ready-to-use, prop-driven sections built from Vespera primitives, all
  open source: `OrdersBlock` (filterable table with bulk select + row menu), `KanbanBlock`
  (drag-to-reorder board), `ApiKeysBlock` (reveal/copy/revoke), `AuditLogBlock` (activity
  timeline), `SystemStatusBlock` (uptime bars), `TeamRolesBlock` (inline role selects), plus a
  shared `Block` frame. Each accepts its data via props with sensible defaults.
- 7bf540d: Add `EventCalendar` — a month / week / agenda calendar with click-and-drag day selection and an
  inline "new event" dialog. Events live in local state and `onChange` reports every change. This
  completes the date family (`DatePicker`, `DateRangePicker`, `EventCalendar`).

## 0.2.0

### Minor Changes

- 8b912ba: Add data-display and navigation components: `Accordion`, `Banner`, `EmptyState`,
  `CircularProgress`, `Stat`, `Timeline`, `DescriptionList`, `SettingRow`, `VerticalTabs`,
  `NavItem`, and `NavGroup`. The React package now covers 48 components.
- ef726f2: Add the remaining extras: `Tree`, `Avatar`, `AvatarGroup`, `Segmented`, `NumberStepper`,
  `OTPInput`, `InlineEdit`, `CopyButton`, and `FileDropzone` (a real file dropzone with an
  `onFiles` callback). The React package now covers 57 components.
- 6be19d9: Add charts: `Sparkline`, `AreaChart` (responsive, hover tooltip, optional dual series),
  `BarChart`, `Donut`, and `StatCard`, plus the `niceNum` and `smoothPath` helpers. Gradient
  ids use `useId()` for SSR safety. 65 components total — the component port is feature-complete.
- b666d22: Add date components: `Calendar`, `DatePicker`, and `DateRangePicker` (with a `DateRange` type
  and a `fmtDate` helper). 60 components total.

## 0.1.0

### Minor Changes

- e7f4549: Add overlay components: `Dialog`, `Sheet`, `Anchored`, `DropdownMenu`, `Popover`,
  `ToastHost` + a `toast()` API (replacing the prototype's `window.toast`), and
  `CommandPalette` with the `useCmdK` and `useEsc` hooks. All overlays portal into the
  nearest `.vsp-root` so they keep the theme tokens.
- b8713e8: First set of React components and the icon set.

  - `@vespera-ui/icons` — framework-neutral stroke icon set as typed React components
    (`Icon.check`, etc.), replacing the prototype's `window.Icon` globals.
  - `@vespera-ui/react` — typed ESM primitives: `Button`, `IconButton`, `Field`, `Input`,
    `Textarea`, `Select`, `InputAffix`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider`,
    `Badge`, `Tag`, `Kbd`, `Divider`, `Alert`, `Progress`, `Skeleton`, `Spinner`, `Tabs`,
    `Tooltip`, `Breadcrumb`, `Pagination`, `Stepper`, `Card`, `CardHead`, plus the `cx` helper.
    Components consume `@vespera-ui/css` classes and render inside a `.vsp-root`. Storybook is
    set up as the component workbench.

- ba0e361: Add the themed select family: `Select` (searchable drop-in that auto-enables search at ≥8
  options), `Combobox` (searchable single-select, clearable), `MultiSelect` (tagged,
  searchable, with an optional `max`), and `TokenInput` (creatable tags). The themed `Select`
  is now the default export named `Select`; the styled native `<select>` is available as
  `NativeSelect`.

### Patch Changes

- Updated dependencies [b8713e8]
  - @vespera-ui/icons@0.1.0
