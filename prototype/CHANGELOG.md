# Changelog — Aether UI

All notable changes to the Aether design system & admin template.
Format loosely follows [Keep a Changelog](https://keepachangelog.com) + SemVer.

> **Repo layout (target):** `prototype/` holds the zero-install HTML showcase + admin demo
> (open in a browser, no build). `src/` holds the modular component sources (one component
> per file, copy-in style). Each release below is tagged; `src/` catches up to the
> prototype over time and is reflected here.

---

## [1.5.0] — 2026-06-10
### Added
- **EventCalendar** widget — Month, **Week (hourly appointment grid)**, and Agenda views; click-to-add events, **drag range-select** for bulk add, `initialEvents` + `onChange` hooks.

## [1.4.0] — 2026-06-10
### Added
- **Documentation** section — Get started, Modularity (file → components → deps), Components API (props tables + copy code), Theming.
- **In-page Customize panel** (Foundations) exposing every option live; no floating panel needed.
- **Named color set** (`--c-blue … --c-magenta`); **Accent** and **Accent 2** select from the same named palette.
- `--accent-2` token (replaces the hardcoded violet `#b16cff`).
- Typefaces: **Geist, Manrope, Outfit** (now 6 total).
### Changed
- Base **`Select`** is now a themed dropdown (drop-in for native `<select>`, auto-search ≥8 options) — every select across both apps upgraded.
- Multi-section pages (Data Display, Docs) moved from in-page tabs to **nested collapsible side-nav**.
- Semantic color tokens renamed to standards: `--pos/--neg/--warn` → **`--success/--danger/--warning`**.
### Fixed
- Rail-mode sidebar no longer clips group labels.
- Kanban: original slot is held by a placeholder until dropped elsewhere.

## [1.3.0] — 2026-06-09
### Added
- Extras: **Spinner, CircularProgress, Accordion (animated), FileDropzone, EmptyState, Banner, OTPInput, CopyButton, AvatarGroup, NumberStepper, Tree, Timeline, DescriptionList, InlineEdit, Stat, SettingRow, VerticalTabs, NavGroup**.
- **DatePicker / DateRangePicker / Calendar**.
- **Button** loading state.
### Fixed
- Overlays portal into `.ag-root` so popups inherit theme tokens (were transparent / black text).
- Accent caret on inputs; native selects follow `color-scheme`.

## [1.2.0] — 2026-06-09
### Added
- **Power table** (universal + per-column search, sortable, column show/hide, row select, rows-per-page, pagination, CSV export).
- Table variations: per-column filters, nested/combo orders, single-order detail, **sticky header + frozen columns**.
- Pagination strategies: offset, cursor, load-more.
- **Searchable selects**: Combobox, MultiSelect, TokenInput.
- Pie chart.

## [1.1.0] — 2026-06-08
### Added
- **Blocks**: Orders, Team & roles, System status, API keys, Audit log, Kanban; Onboarding wizard, Account form, Billing, Filters, Auth card.
- Admin ops screens: Approvals, Insights, Audit & restore, Notifications.
- **Command palette (⌘K)** with component search index; quick-create dialog; toasts.

## [1.0.0] — 2026-06-08
### Added
- Initial **Aether** design system: deep-space tokens, light/dark, density, corners, animated glow.
- Core primitives, charts, foundations/components/blocks showcase.
- **Aether Admin** template: dashboard, analytics, accounts table + detail, settings, login, states.
- Tweaks panel (theme, accent, typeface, sidebar, density).
