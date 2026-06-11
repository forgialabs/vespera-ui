# Vespera — progress tracker

A living, granular checklist of the productization work. High-level phases and rationale
live in [ROADMAP.md](./ROADMAP.md); this tracks day-to-day progress (kept in the repo so
contributors can see what's planned and in flight).

## ✅ Done

- [x] **Phase 0** — monorepo foundation (pnpm, TypeScript, ESLint + Prettier, Changesets,
      GitHub Actions CI, Apache-2.0 governance, AGENTS.md)
- [x] **Phase 1** — `@vespera-ui/css` (tokens / base / shell / components, `.ag-` → `.vsp-`,
      live demo)
- [x] **Docs site** — Astro + Starlight + GitHub Pages deploy
- [x] **Phase 2a** — `@vespera-ui/icons` (typed icon set, replaces `window.Icon`)
- [x] **Phase 2b** — `@vespera-ui/react` primitives (27 components) + Storybook workbench

## 🚧 Planned (next iterations)

### Iteration 1 — Interactive components (`@vespera-ui/react`)

Port the components that carry real logic (from `prototype/aether-overlays.jsx` +
`prototype/aether-select.jsx`).

- [x] Overlay foundation: `getPortalTarget`, `useEsc`, `Anchored` positioning
- [x] `Dialog`, `Sheet`
- [x] `DropdownMenu`, `Popover`
- [x] `ToastHost` + `toast()` API (replaces `window.toast`)
- [x] `CommandPalette` + `useCmdK`
- [x] Stories for the overlays
- [x] Themed `Select` (auto-search ≥8), `Combobox`, `MultiSelect`, `TokenInput` (+ `NativeSelect`)

✅ **Iteration 1 complete.**

### Iteration 2 — AI-consumable layer (Phase 3)

- [x] Component manifest (`manifest/react.json`: props, types, enum values, defaults)
- [x] Generate manifest from TS types (`pnpm manifest`, react-docgen-typescript)
- [x] Skills: `vespera-component` (authoring), `vespera-theming` (in `.claude/skills/`)
- [x] Cross-link manifest + skills from root `AGENTS.md`

✅ **Iteration 2 complete.**

### Iteration 3 — Wire components into the docs

- [x] Per-component API / props tables — auto-generated from `manifest/react.json`
      (`/reference/react/`, build-time, no drift)
- [x] Update docs content for React availability (install, intro, components guide)
- [x] Live interactive playground — `/demo` is now a real `@vespera-ui/react` island
      (`@astrojs/react`): buttons fire toasts; switches, selects, dropdowns, dialog all work;
      live theme/accent/density/corners controls. Verified hydrated + interactive.
- [x] Theme the docs to feel like Vespera — Starlight tokens mapped to the Vespera palette +
      typefaces, deep-space glow background, brand logo + favicon (`src/styles/vespera.css`).
- [~] Expand Storybook coverage — stories exist for Button, Badge, Alert, Field, Select
  family, and overlays; remaining primitives still to get stories.

✅ **Iteration 3 complete** (API reference, React docs, interactive playground, Vespera theme).

## 🔭 Later (per roadmap)

- [x] Extras — all ported: `Accordion`, `Banner`, `EmptyState`, `CircularProgress`, `Stat`,
      `Timeline`, `DescriptionList`, `SettingRow`, `VerticalTabs`, `NavItem`, `NavGroup`, `Tree`,
      `OTPInput`, `InlineEdit`, `NumberStepper`, `CopyButton`, `FileDropzone`, `Avatar`,
      `AvatarGroup`, `Segmented` (57 components total)
- [x] `Calendar` / `DatePicker` / `DateRangePicker` (EventCalendar still to port)
- [x] Charts: `Sparkline`, `AreaChart`, `BarChart`, `Donut`, `StatCard` (65 components total)
- [ ] Pro blocks / screen templates
- [ ] `@vespera-ui/tokens` (JSON) + `@vespera-ui/tailwind` preset
- [ ] Additional frameworks (Angular first)
- [ ] Pro tier (separate private repo)
