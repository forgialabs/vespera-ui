# @vespera-ui/react

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
