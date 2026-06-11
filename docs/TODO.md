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
- [ ] Live React examples as MDX islands — deferred: Vespera's `base.css` styles `body`,
      which would bleed into Starlight's chrome. The isolated `/demo` page + Storybook serve
      as the live playground for now; revisit with scoped styles or a standalone React page.
- [~] Expand Storybook coverage — stories exist for Button, Badge, Alert, Field, Select
  family, and overlays; remaining primitives still to get stories.

✅ **Iteration 3 core complete** (API reference + React docs); two polish items remain above.

## 🔭 Later (per roadmap)

- [ ] Extras: `Accordion`, `Tree`, `Timeline`, `OTPInput`, `FileDropzone`, etc.
- [ ] `DatePicker` / `Calendar` / `DateRangePicker`
- [ ] Charts (`AreaChart`, `BarChart`, `Donut`, `Sparkline`, `StatCard`)
- [ ] Pro blocks / screen templates
- [ ] `@vespera-ui/tokens` (JSON) + `@vespera-ui/tailwind` preset
- [ ] Additional frameworks (Angular first)
- [ ] Pro tier (separate private repo)
