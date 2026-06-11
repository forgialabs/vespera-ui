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

- [ ] Component manifest (`manifest/*.json`: props, classes used, deps, framework availability)
- [ ] Generate manifest from TS types where possible
- [ ] Skills: `vespera-component` (authoring), `vespera-theming`
- [ ] Cross-link manifest from root `AGENTS.md`

### Iteration 3 — Wire components into the docs

- [ ] Live React examples in docs (MDX + React islands)
- [ ] Per-component API / props tables (auto-generated where possible)
- [ ] Expand Storybook coverage to all primitives

## 🔭 Later (per roadmap)

- [ ] Extras: `Accordion`, `Tree`, `Timeline`, `OTPInput`, `FileDropzone`, etc.
- [ ] `DatePicker` / `Calendar` / `DateRangePicker`
- [ ] Charts (`AreaChart`, `BarChart`, `Donut`, `Sparkline`, `StatCard`)
- [ ] Pro blocks / screen templates
- [ ] `@vespera-ui/tokens` (JSON) + `@vespera-ui/tailwind` preset
- [ ] Additional frameworks (Angular first)
- [ ] Pro tier (separate private repo)
