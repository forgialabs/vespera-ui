# AGENTS.md — Aether Design System & Admin Template

Persistent project notes. Read this before editing anything in this project.

---

## 1. What this project is

Two linked deliverables built on one design system called **Aether**:

| File | Role |
|---|---|
| `Aether UI.html` | The **design-system showcase + documentation** site (copy-in component library). |
| `Aether Admin.html` | The flagship **admin/operational template** (analytics console) built from Aether. |

They cross-link: the admin topbar has a **Library** button and a sidebar **Design system** link; the showcase has a **Live admin demo** link.

**Aesthetic:** "weightless / deep-space" — deep navy/near-black backgrounds, an electric cornflower accent (`#4a7cff` default), hairline borders, glassy surfaces, uppercase mono micro-labels, subtle accent glow, tasteful motion. Geometric sans (**Plus Jakarta Sans**) for UI + **JetBrains Mono** for metrics/labels. Avoid AI-slop tropes (no heavy gradients, no emoji unless asked, no rounded-corner-left-border-accent containers).

---

## 2. Architecture & file map (MODULAR — "copy-in" library)

Aether is a **copy-in library** — no package, no runtime. Each `.jsx` file registers its components onto `window` via `Object.assign(window, {...})` at the end. You include only the files whose components you use. Two CSS files are always required.

| File | Provides | Depends on |
|---|---|---|
| `styles.css` | **Design tokens**, theme blocks (`[data-theme]`), density/corners, base, **app-shell** (`.ag-*` sidebar/topbar), `.btn`/`.card`/`.badge`/`.chip`, animated glow background. | — (required) |
| `ui.css` | All **component** styles (`.ui-*`): inputs, selects, overlays, menus, command palette, tables, calendar, accordion, tree, timeline, nav, docs, etc. | required |
| `icons.jsx` | Stroke icon set → `window.Icon.<name>`. | required by most |
| `tweaks-panel.jsx` | Starter Tweaks panel + `useTweaks`, `TweakToggle/Radio/Color/Section`. Host-protocol wired. | — |
| `components.jsx` | Charts: `AreaChart, BarChart, Donut, Sparkline, StatCard, Av (Avatar), Segmented`. | — |
| `aether-ui.jsx` | **Core primitives:** `cx, Button (has loading), IconButton, Field, Input, Textarea, Select(base — overridden), InputAffix, Checkbox, Radio, RadioGroup, Switch, Slider, Badge, Tag, Kbd, Divider, Alert, Progress, Skeleton, Tabs, Tooltip, Breadcrumb, Pagination, Stepper, CardHead`. | icons |
| `aether-overlays.jsx` | `Dialog, Sheet, Anchored, DropdownMenu, Popover, ToastHost, CommandPalette, useCmdK, useEsc`. Defines `agPortal()`. | aether-ui |
| `aether-select.jsx` | `Select` (**themed, overrides the native one in aether-ui**), `Combobox, MultiSelect, TokenInput`. Defines `SelPanel`, `ComboList`. | overlays |
| `aether-datepicker.jsx` | `Calendar, DatePicker, DateRangePicker`. | icons |
| `aether-extras.jsx` | `Spinner, CircularProgress, Accordion, FileDropzone, EmptyState, Banner, OTPInput, CopyButton, AvatarGroup, NumberStepper, Tree, Timeline, DescriptionList, InlineEdit, Stat, SettingRow, VerticalTabs, NavItem, NavGroup`. | aether-ui |
| `data.jsx` | Mock datasets (`CUSTOMERS, STATUSES, PLANS, revenue30, channelDonut, ...`). | — |
| `aether-blocks.jsx` | Pro **operational blocks**: `OrdersBlock, TeamRolesBlock, SystemStatusBlock, ApiKeysBlock, AuditLogBlock, KanbanBlock`, `Block`. | all above |
| `aether-forms.jsx` | Pro **form blocks**: `OnboardingWizard, AccountForm, BillingForm, FilterPanelBlock, AuthCardBlock`. | all above |

**Showcase-only files:** `showcase-foundations.jsx` (Demo helper + Foundations/Buttons/Forms sections), `showcase-components.jsx` (DataDisplay[overridden]/Feedback/Navigation), `showcase-datadisplay.jsx` (overrides `DataDisplaySection` — the live one), `showcase-docs.jsx` (Documentation), `showcase-app.jsx` (shell, sidebar, router, ⌘K index).

**Admin-only files:** `app.jsx` (shell/router/tweaks/command palette), `screens-main.jsx` (Dashboard, Analytics), `screens-data.jsx` (TableScreen, DetailScreen), `screens-misc.jsx` (Settings, Login, States), `screens-ops.jsx` (ApprovalsScreen, OpsHead, MiniKpi), `screens-ops2.jsx` (Audit, Insights, Notifications).

---

## 3. CRITICAL conventions & gotchas (follow these)

- **Separate Babel scopes:** every `<script type="text/babel">` is transpiled in its **own scope**. Components are shared **only** via `Object.assign(window, {...})` at file end, and referenced by bare name (resolves to the global) in other files. A top-level `const X` in one file is invisible to another — and re-declaring `const agPortal` in multiple files is FINE (separate scopes).
- **Never name a styles object `styles`** — give unique names (`terminalStyles`) or use inline styles. Name collisions across files break things.
- **`.ag-root` is the theming root.** Tokens live on `.ag-root[data-theme=...]`. The app root `<div className="ag-root" data-theme data-density data-corners data-dxside data-bganim style="--accent;--font-sans;--bg-accent">`.
- **Overlays MUST portal into `.ag-root`, not `document.body`** — otherwise they lose all CSS variables (transparent bg / black text). `agPortal = () => document.querySelector('.ag-root') || document.body`. This applies to Dialog, Sheet, DropdownMenu/Popover (Anchored), Toast, CommandPalette, Tooltip, SelPanel, DatePicker panel.
- **Use the themed `Select`, never a raw `<select>`.** `aether-select.jsx` overrides `window.Select` with a themed dropdown that is **API-compatible** with native: `options`, `value`/`defaultValue`, `onChange` is called with an **event-like `{ target: { value } }`**, optional `searchable` (auto-on at ≥8 options). Native selects also get `color-scheme` from theme as a fallback.
- **Caret color:** all inputs use `caret-color: var(--accent)` (so the text cursor is visible in both themes).
- **Sticky/frozen-column tables** require `table-layout: fixed` so column widths equal the offset math (`.ui-sticky`).
- **Kanban** is pointer-based (not HTML5 DnD): a floating clone follows the cursor, an **insertion placeholder** shows position, and the **source slot is held** (placeholder starts at origin) until dropped elsewhere.
- **React + Babel script tags** must use the pinned versions with integrity hashes already in the HTML files. Don't use `type="module"`.
- **Canonical HTML** for direct-edit: close every non-void element, double-quote attrs, don't self-close non-void elements.

---

## 4. Theming system (all via CSS vars on `.ag-root`)

| Attribute / var | Values | Effect |
|---|---|---|
| `data-theme` | `dark` \| `light` | full token swap (+ `color-scheme`). |
| `--accent` (inline) | hex | brand/primary color everywhere. |
| `--font-sans` (inline) | font stack | typeface (Jakarta/Grotesk/Sora options). `.ag-root` applies it so descendants inherit. |
| `data-density` | `compact` \| `comfortable` \| `spacious` | drives `--pad, --gap, --row-py, --ctrl-h, --fs-base` → control heights, row padding, gaps. |
| `data-corners` | `round` \| `soft` \| `sharp` | `--r-sm/md/lg`. |
| `data-dxside` (showcase) / `data-sidebar` (admin) | `full` \| `compact`(rail) \| `float` \| `hidden` | sidebar layout. |
| `data-bganim` + `--bg-accent` | `on/off` + hex | animated blurred glow orbs (`.ag-bg`), color-pickable. |

Key tokens: `--bg, --surface-1..3, --text/-dim/-faint, --border/-strong, --success/--danger/--warning, --r-sm/md/lg, --pad/--gap, --ctrl-h, --shadow/-lg`. Re-theme the whole system by overriding these — never hardcode hex in components; use tokens or `color-mix(in oklab, var(--accent) N%, ...)`.

---

## 5. The showcase (`Aether UI.html`)

- **Left sidebar = nested, collapsible nav** (groups collapse via chevron). Groups: Get started, Components, Blocks·PRO, Resources.
- **Multi-section pages use nested side-nav sub-items, NOT in-page tabs.** `Data Display` → Essentials/Tables/Pagination/Charts; `Documentation` → Get started/Modularity/Components API/Theming. These are **controlled** by `Showcase` state (`dataSub`/`docSub`) passed as `sub`/`onSub` props; the sub-setter is also exposed on `window.__dataSub`/`window.__docSub` for ⌘K deep-links. (Shallow per-screen tabs like account-detail stay as `Tabs`.)
- **⌘K command palette** is a real **search index** (`SC_INDEX`, ~76 entries) over every component/block with keywords; `goToSec(page, sub, anchor)` navigates + switches sub-tab + smooth-scrolls to the matching heading.
- **Documentation** page (`showcase-docs.jsx`): Get started (copyable install + working example), Modularity (file→components→deps table), Components API (per-component description + **props table** + copy-to-clipboard code), Theming. `DocCode` = copyable code block; `PropsTable`.

---

## 6. The admin template (`Aether Admin.html`)

- Shell: collapsible sidebar (grouped: Workspace / Operations / System / Resources) + glassy topbar (sidebar toggle, title+breadcrumb, **Library** link, ⌘K search, **Create** dropdown, theme toggle, notifications menu).
- Screens (all flows verified end-to-end): **Overview** (KPIs, revenue area, acquisition donut, activity, tasks, top accounts), **Analytics**, **Accounts** (power-style table) → **Detail** → back, **Approvals** (queue + risk + SLA + approve/reject + detail drawer with approval chain), **Insights** (AI suggestions accept/dismiss, anomaly alerts, hints), **Audit & restore** (change history diffs + restore-confirm dialog + integrity panel), **Notifications** (grouped, mark-read), **Settings** (vertical tabs, billing, toggles), **States** (loading/empty/error), **Login**.
- **⌘K palette**, **Create→dialog**, **toasts**, all wired. Tweaks panel: dark mode, accent (7), typeface (3), sidebar (4), corners (3), density (3), animated glow + glow color.

---

## 7. Build / verify workflow

1. Edit files. Reuse tokens + existing `.ui-*`/`.ag-*` classes; add new `Object.assign(window,{...})` exports for new components.
2. `show_html` the changed HTML; check `get_webview_logs` (the only expected warning is the in-browser Babel notice). The iframe can take a few seconds — `sleep` then re-check if it warns "not ready".
3. The flat **screenshot tool renders from page top and can mis-wrap flexed headings / miss portals & scroll** — prefer `eval_js` DOM checks for interactions and portaled overlays; trust computed styles over html-to-image artifacts.
4. `done` (surfaces file + returns console errors) → fix if any → `fork_verifier_agent` (background full sweep).
5. When adding a library component: add CSS to `ui.css`, component to the right `aether-*.jsx`, export to `window`, showcase it in the matching showcase section, AND add a `SC_INDEX` entry + a `showcase-docs.jsx` API entry.

---

## 8. Design principles (hold the line)

- Less is more. No filler/dummy content, no data-slop (gratuitous numbers/icons/stats). Every element earns its place; ask before adding sections.
- Minimum sizes: slide text ≥24px (n/a here), doc text ≥12pt, mobile hit targets ≥44px.
- Flex/grid with `gap` for any row/group of siblings — not bare inline-block + whitespace (survives direct-manipulation edits).
- Use `text-wrap: pretty`, CSS grid, `color-mix(in oklab, …)`. Keep files < ~1000 lines; split and import.
