# @vespera-ui/svelte

## 0.5.0

### Minor Changes

- bcc25ab: Add charts to the Vue and Svelte wrappers: `Sparkline`, `Donut`, and `StatCard` (with embedded
  sparkline). (Angular gains the same — `vsp-sparkline`, `vsp-donut`, `vsp-stat-card` — published
  separately.) The responsive `AreaChart`/`BarChart` (with hover) remain React-only for now.

## 0.4.0

### Minor Changes

- 5c2e08d: Add structural components to the Vue and Svelte wrappers: `Banner`, `EmptyState`, and
  `Accordion` (multi/single-open). (Angular gains the same — `vsp-banner`, `vsp-empty-state`,
  `vsp-accordion` — published separately.) Default banner/empty icons are inlined as SVG.

## 0.3.0

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

## 0.2.0

### Minor Changes

- d4c747c: Add `Tag`, `Kbd`, `Divider`, and `Textarea` to `@vespera-ui/svelte`, bringing its core component
  set to parity with `@vespera-ui/vue`.
