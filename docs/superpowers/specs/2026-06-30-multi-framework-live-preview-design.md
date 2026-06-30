# Multi-framework live preview (framework selector in docs) — Design

- **Date:** 2026-06-30
- **Status:** Approved (design); ready for implementation planning
- **Owner:** Williams Gunawan
- **Related:** `docs/ROADMAP.md` (Phase 4 docs site; Storybook workbench), `AGENTS.md`,
  `apps/web/components/Preview.tsx`, `apps/web/components/registry.ts`, `apps/web/app/embed/[demo]/page.tsx`

## Problem

Vespera ships four framework wrappers — React (`0.3.0`), Angular (`0.19.1`), Svelte
(`0.14.0`), Vue (`0.13.0`) — all consuming the single source-of-truth `@vespera-ui/css`.
They drift independently and parity is uneven (React 28 components, Angular 33, Svelte 82
files, Vue one 6,405-line `index.ts` monolith). Bugs appear in one framework but not
others, and there is **no way to see a component running in a given framework** and **no
tests anywhere** to catch per-framework regressions.

The docs site (`apps/web`, Next.js + Fumadocs, static-exported to GitHub Pages under
basePath `/vespera-ui`) currently renders **React-only** live demos via an isolated
iframe-per-demo seam: a demo registered in `components/registry.ts` is rendered at
`/embed/[demo]/` inside a `.vsp-root` and embedded by `components/Preview.tsx`, which
auto-sizes the iframe via a `vsp:frame-h` postMessage.

## Goal

A **framework selector** in the docs that renders the **real component for each framework,
live and interactive**, so per-framework bugs and gaps are visible by eye — backed by a
**story-driven source of truth** that doubles as a **cross-framework behavioral test suite**
(TDD), so regressions fail CI.

### Non-goals (for this initiative)

- A standalone cross-framework E2E harness separate from Storybook (the test-runner on
  stories covers it).
- Rewriting framework wrappers for parity (we _surface_ gaps; closing them is follow-on work).
- Replacing Fumadocs or the static-export deploy model.

## Decisions (locked during brainstorming)

| #   | Decision               | Choice                                                                |
| --- | ---------------------- | --------------------------------------------------------------------- |
| 1   | First increment        | **Selector / live-preview first** (TDD baked in via stories-as-tests) |
| 2   | Framework coverage     | **All 4, phased** — React → Angular → Svelte → Vue                    |
| 3   | Rendering architecture | **Storybook per framework, embedded story `iframe.html`**             |
| 4   | React routing          | **Uniform** — React also renders through Storybook                    |

### Why Storybook (architecture B)

Chosen over (A) bespoke per-framework embed-host apps and (C) a single multi-framework Vite
playground, weighing developer experience, integrations, review, feel, and TDD:

- First-class official support for **all four** renderers (React, Angular, Svelte, Vue).
- Addons for free: `a11y` (axe), `controls`, `interactions` (play functions), themes/viewport.
- **Unifies the two goals into one source of truth**: a _story_ is the live demo **and** the
  test (`@storybook/test-runner` runs each story's `play` as a behavioral test, per framework).
  No parallel demo-vs-test maintenance.
- The selector becomes **parity-aware** — a framework with no story for a component renders
  disabled ("not yet available"), so gaps show up _in the UI itself_.
- Cost (honest): React already has Storybook; Angular/Svelte/Vue do not — so the upfront lift
  is 3 new Storybook setups + hosting 4 static builds. Mitigated by: the roadmap already wants
  Storybook; the rollout is phased; and stories-as-tests erases duplicate maintenance.

## Architecture

```
docs page (MDX)
  └─ <FrameworkPreview component="Button" story="Variants" />
        ├─ reads manifest/stories.json  → which (framework → storyId) exist
        ├─ renders framework tabs (React | Angular | Svelte | Vue), gaps disabled
        ├─ renders Preview / Code tabs
        └─ iframe src = {basePath}/sb/{fw}/iframe.html
                          ?id={storyId}&viewMode=story&globals=theme:{t};density:{d};corners:{c}
                 ↑ swaps {fw} on tab change; rebuilds globals on theme change
                 ↓ story canvas (wrapped in .vsp-root by a global decorator) posts vsp:frame-h
        docs sizes the iframe from the height message
  Code tab ← real per-framework source for that story (from a generated source map)
```

### Components (each unit: one job, clean interface)

1. **Per-framework Storybook setups** — `packages/{react,angular,svelte,vue}/.storybook/`.
   - React: exists (`@storybook/react-vite`, titles like `Primitives/Button`). Extend with the
     shared decorators below.
   - Add `@storybook/angular`, `@storybook/svelte` (+ vite), `@storybook/vue3` (+ vite).
   - Shared **global decorators** (one per framework, same behavior):
     - **Theme decorator** — wraps every story in
       `<div class="vsp-root" data-theme data-density data-corners style="--accent:…">` and
       imports `@vespera-ui/css`; reads Storybook **globals** (`theme`, `density`, `corners`,
       `accent`) exposed as toolbar items so a story is themable via the URL `globals` param.
     - **Height decorator** — `ResizeObserver` on the canvas posts
       `{ vsp: 'frame-h', h }` to `window.parent` (mirrors current `EmbedFrame`). Test-runner
       ignores it.

2. **Story contract** (the lightweight cross-framework source of truth) — same component →
   **same Storybook story id** in every framework. Story id = kebab(`title`) + `--` +
   kebab(export). Rules:
   - **Identical `title`** across frameworks for the same component (reuse React's existing
     taxonomy: `Primitives/…`, `Overlays/…`, `Forms/…`, `Data/…`, `Blocks/…`).
   - **Canonical export names** shared across frameworks (`Default`, `Variants`, `Playground`,
     plus state stories as needed). Documented in `AGENTS.md` + the `vespera-component` skill.

3. **Story-availability manifest** — `manifest/stories.json`, generated by scanning each
   package's `*.stories.*` (titles + exports) → `{ component, title, stories: { <export>:
{ react: storyId|null, angular: …, svelte: …, vue: … } } }`. This **is the parity matrix**.
   Built by `scripts/build-stories-manifest.mjs`; wired into `pnpm manifest` (alongside the
   existing `manifest/react.json`).

4. **`FrameworkPreview`** (new, evolves `Preview.tsx`) — pure-ish presentational + selection
   logic:
   - Props: `component` (maps to a title) **or** explicit `story` id; optional default `framework`.
   - Renders framework tabs (availability-gated from the manifest), Preview/Code tabs, the iframe.
   - **Pure helpers (unit-tested first, TDD):**
     - `resolveStoryId(title, exportName)` → kebab id.
     - `frameworkAvailability(manifest, title, exportName)` → `{ react: bool, … }`.
     - `buildEmbedSrc(basePath, fw, storyId, themeState)` → URL with `globals`.
     - `onFrameHeightMessage(event)` → guarded height update.
   - Theme state comes from the existing docs theme controls; changing it rebuilds `globals`.

5. **Hosted Storybook builds** — CI runs `build-storybook` per framework into
   `apps/web/public/sb/<fw>/` (gitignored), which static-export copies into `out/sb/<fw>/`.
   Iframe loads `{basePath}/sb/<fw>/iframe.html`. Phased: only built frameworks exist; the
   manifest + availability gating keep unbuilt frameworks disabled.

6. **Code tab source** — a generated `story-source` map (raw story render source per
   framework), produced alongside the manifest, so the Code tab shows **real, copy-pasteable**
   per-framework code rather than a synthesized snippet.

## Data flow

1. MDX author writes `<FrameworkPreview component="Button" story="Variants" />`.
2. `FrameworkPreview` reads `manifest/stories.json`, computes availability, renders tabs.
3. On (framework, theme) selection → `buildEmbedSrc` → iframe `src`.
4. The framework's prebuilt Storybook serves `iframe.html`, the theme decorator wraps the
   story in a themed `.vsp-root`, the height decorator posts `vsp:frame-h`.
5. Docs sizes the iframe; Code tab reads from the source map.

## Phasing

- **Phase 0 — Foundations + React vertical proof.**
  - Introduce docs test infra: **Vitest + Testing Library** in `apps/web` (none exists).
  - Add the story contract; build `scripts/build-stories-manifest.mjs` + `manifest/stories.json`.
  - Add React SB theme + height decorators; add `@storybook/test-runner` to React.
  - Build `FrameworkPreview`; wire **one component (Button)** end-to-end, **React enabled only**
    (other tabs disabled).
  - CI: build React `storybook-static` → `apps/web/public/sb/react/`; run unit tests + test-runner.
  - **Exit:** Button renders via React SB iframe in the docs, themed + auto-sized + Code tab;
    `FrameworkPreview` unit tests + React story smoke green in CI; other tabs visibly disabled.
- **Phase 1 — React parity & convergence.** Migrate `examples.tsx`/`templates.tsx` demos →
  stories; converge `/embed` + `registry.ts` onto stories as the single source (retire or
  generate `/embed` from stories).
- **Phase 2 — Angular.** SB (`@storybook/angular`) + decorators + stories; enable Angular tab.
  Validate `.vsp-root` theming under **zoneless change detection** (recent date-picker bug area).
- **Phase 3 — Svelte.** SB + decorators + stories; enable Svelte tab.
- **Phase 4 — Vue.** Pre-req: split the 6,405-line `packages/vue/src/index.ts` monolith into
  per-component modules far enough to author stories; SB + decorators + stories; enable Vue tab.

## Testing (TDD discipline for building this)

- **Unit (red→green) for `FrameworkPreview` pure helpers:** `resolveStoryId`,
  `frameworkAvailability`, `buildEmbedSrc` (incl. basePath + globals encoding),
  `onFrameHeightMessage` guarding. Write tests before the component.
- **Manifest generator:** unit-tested against fixture story files (titles/exports → expected map).
- **Story smoke (cross-framework net):** `@storybook/test-runner` renders every built story per
  framework without throwing; `play` assertions encode behavior.
- **No regressions:** existing React stories and the current `/embed` demos stay green until
  converged; CI gates on unit tests + test-runner.

## Existing-code issues addressed as we go (targeted, not gratuitous)

- **Vue monolith** (`packages/vue/src/index.ts`, 213 KB) — split per-component in Phase 4, only
  as far as story authoring needs.
- **`/embed` + `registry.ts` ↔ Storybook overlap** once React is uniform — converge to stories
  as the single source to avoid two sources of truth.

## Risks / unknowns to validate early in implementation

- Storybook **globals → `.vsp-root` `data-*` theming** reliability per renderer, especially
  **Angular zoneless** change detection.
- **GitHub Pages basePath** (`/vespera-ui`) for `/sb/<fw>/` static hosting + the iframe URL.
- **Per-framework source extraction** for the Code tab.
- 4 Storybook static builds' **size / CI time** on Pages (acceptable; phaseable).

## Success criteria

- A docs page shows a component with a working framework selector; switching tabs renders the
  real component from that framework's Storybook, themed and interactive; unavailable
  frameworks are clearly disabled.
- `manifest/stories.json` accurately reflects per-framework parity.
- CI fails when any framework's story breaks (test-runner) or when `FrameworkPreview` logic
  regresses (unit tests).
- Rollout proceeds framework-by-framework without destabilizing earlier phases.
