# Vespera — Open-Source Roadmap & Architecture Plan

> **Vespera** _(Latin: "evening"; the evening star)_ — a deep-space / "weightless" design system.
> Formerly prototyped under the working name "Aether."
>
> Status: **planning** (pre-`git init`). **Decisions locked:**
>
> - **Name / hosting:** product **Vespera** · GitHub: **start personal** (`williams-gunawan/vespera-ui`) → **transfer to studio org `forgialabs/vespera-ui` later** · npm scope **`@vespera-ui`** (independent of GitHub) · © **The Vespera Authors** → re-attribute to **PT Sentra Digital Kreatif** when formalized. _(all handles verified free)_.
> - **v0.1 scope:** framework-agnostic CSS package **+** React package.
> - **License:** Apache-2.0 (open-core friendly — patent grant + clean contribution terms) + DCO.
> - **Tooling:** pnpm workspaces · TypeScript · Changesets · **ESLint + Prettier** (lint+format) · **Storybook** (component workbench) · ~~**Astro + Starlight**~~ → **Next.js + Fumadocs** (public docs — see note below).
> - **Styling:** plain CSS (token-driven) is the source of truth; **optional `@vespera-ui/tailwind` preset** (shadcn-style token→Tailwind mapping); possible future copy-in CLI.
> - **Next step:** scaffold Phase 0.

---

## 0. Naming & branding

- **Brand:** "Vespera." The prototype's "Aether" name and the `.ag-` class prefix are rebranded.
- **Class prefix:** `.ag-` → **`.vsp-`**, `.ag-root` → **`.vsp-root`** (the theming root). Component classes (`.ui-*`) stay as-is for now but always live inside `.vsp-root`, which scopes them; revisit full `.vsp-`-namespacing in Phase 1 if collision risk warrants. _(Rename is mechanical — do it once, early.)_
- **Packages:** `@vespera-ui/css`, `@vespera-ui/react`, `@vespera-ui/icons`, optional `@vespera-ui/tokens`, `@vespera-ui/tailwind`. (Later, per ambition: `@vespera-ui/charts`, `@vespera-ui/widgets`.)
- **Hosting (start → later):** **start on the personal account** → repo `williams-gunawan/vespera-ui` (keep it low-ceremony while it's an early personal project). **Transfer to the studio org `forgialabs` → `forgialabs/vespera-ui` when ready** (GitHub auto-redirects the old URL; stars/issues/PRs carry over; only the `package.json` `repository` URL needs updating). The product keeps its own npm brand `@vespera-ui` regardless — npm scope is independent of GitHub location (tailwindlabs/radix-ui model). Optionally reserve the `forgialabs` org name now so it can't be taken.
- **Ownership/copyright:** use neutral **`Copyright (c) 2026 The Vespera Authors`** so attribution survives the personal→org move. Re-attribute to **PT Sentra Digital Kreatif** when formalized / before the Pro tier, to keep a clean IP chain.
- **Optional studio scope:** reserve `@forgia` on npm for studio-level shared tooling (`@forgia/eslint-config`, `@forgia/tsconfig`); product packages stay under `@vespera-ui`.
- **Immediate action:** create the GitHub org `forgialabs` and npm scope `@vespera-ui` (first-come). Optionally grab `@forgia` too.

---

## 1. Vision

Vespera is a **deep-space / "weightless"** design system. The open-source goal is to make it:

1. **Flexible** — every visual decision driven by CSS tokens on `.vsp-root` (theme, accent, density, corners, glow). Re-skin the whole system by overriding tokens, never by editing components.
2. **Modular** — pick only the pieces you use. Today that's "copy-in" `.jsx`; the OSS version becomes real, tree-shakeable packages.
3. **Multi-framework** — React first, but the CSS layer works in _any_ framework (or plain HTML) on day one. Angular/Vue/Svelte become thin official wrappers later.
4. **AI-consumable** — a machine-readable component manifest + skills + `AGENTS.md` so any coding agent can author and theme Vespera correctly.

**The Prototype stays the source of truth for design.** The Claude Design build (`prototype/`) is where new components are _designed_; `packages/` is where they're _productized_. Changes flow prototype → packages.

---

## 2. The architectural insight this plan is built on

In the prototype, concerns are already cleanly separated:

- **`styles.css` + `ui.css`** — tokens + `.ui-*`/`.ag-*`(→`.vsp-*`) classes. **100% framework-agnostic.** This is the real product.
- **`*.jsx`** — thin wrappers that emit semantic markup + those classes. Simple components (`Button`, `Input`, `Field`, `Badge`…) are ~5 lines of `className` composition. Only the **interactive** components (`Select`, `Combobox`, `Dialog`, `CommandPalette`, `Kanban`, `DatePicker`) carry real framework-specific logic.

**Consequence:** porting to a new framework = re-wrapping the same HTML+classes. The CSS is shared verbatim. N frameworks ≠ N design systems, as long as **one CSS package is the single source of truth** and no framework wrapper forks the styles.

---

## 3. License & open-core strategy

- **Core packages:** Apache-2.0.
- **Contributions:** DCO (`Signed-off-by`), not a CLA — keeps provenance clean for future Pro use without contributor friction.
- **Pro/commercial (future):** lives in a **separate private repo** under a commercial EULA. The open core's Apache-2.0 license does not restrict this. Pro = premium blocks/screens/themes/templates built _on top of_ the open core.
- **Copyright holder:** start with neutral **`The Vespera Authors`** in `LICENSE`/`NOTICE`/source headers (survives the personal→org move); re-attribute to **PT Sentra Digital Kreatif** (Forgia) when formalized, so the IP chain is clean before components move into the Pro tier.
- **Trademark:** reserve the "Vespera" (and "Forgia") name usage in a short `TRADEMARK.md` (Apache-2.0 §6 covers marks).

---

## 4. Target repository structure (monorepo)

```
forgialabs/vespera-ui/          # GitHub: forgialabs (studio org) · repo: vespera-ui
├── prototype/                  # the Claude Design build, as-is. Design source of truth.
│   └── (current _extracted contents)
├── packages/
│   ├── css/                    # @vespera-ui/css — tokens + base + shell + components CSS. Ships first. Works everywhere.
│   ├── icons/                  # @vespera-ui/icons — framework-neutral SVG set (replaces window.Icon)
│   ├── react/                  # @vespera-ui/react — flagship component package
│   ├── tokens/                 # (optional) @vespera-ui/tokens — tokens as JSON/JS (for tooling + Tailwind preset)
│   ├── tailwind/               # (optional) @vespera-ui/tailwind — shadcn-style token→Tailwind preset
│   └── headless/               # (later) framework-neutral logic for interactive components
├── apps/
│   └── web/                    # the showcase becomes the docs + landing site (Next.js + Fumadocs; was Astro + Starlight)
├── skills/                     # AI skills (component authoring, theming)
├── manifest/                   # generated component manifest (JSON) for AI/tooling
├── AGENTS.md                   # repo-root agent rules (port from prototype/AGENTS.md, rebranded)
├── CLAUDE.md                   # → alias of AGENTS.md
├── LICENSE                     # Apache-2.0
├── NOTICE
├── README.md
├── CONTRIBUTING.md             # includes DCO sign-off requirement
├── CODE_OF_CONDUCT.md
├── CHANGELOG.md                # promoted from prototype; driven by Changesets
└── package.json                # pnpm workspace root
```

**Tooling baseline:** pnpm workspaces · TypeScript · **Changesets** · build via tsup/vite · Vitest + Testing Library · **Storybook** (component workbench) · **ESLint + Prettier** (lint+format) · GitHub Actions CI.

### Dependency rules (enforced)

- `css` depends on **nothing**.
- `icons` depends on nothing.
- `react` depends on `css` (peer/asset) + `icons`. **Never forks styles.**
- `tailwind`/`tokens` derive from the same token source; never a second source of truth.
- Future `angular`/`vue` depend on the same `css` + `icons`.
- `headless` (later) depends on nothing; `react`/`angular` consume it for interactive logic.

---

## 5. Phased roadmap

### Phase 0 — Foundation

- Repo on **personal account** for now (`williams-gunawan/vespera-ui`); register npm scope `@vespera-ui`. Optionally reserve the `forgialabs` org name (+ `@forgia` scope) for the later transfer.
- `git init`; default branch `main`.
- pnpm workspace, TS config, Changesets, ESLint + Prettier config, CI skeleton.
- `LICENSE` (Apache-2.0, © The Vespera Authors), `NOTICE`, `README`, `CONTRIBUTING` (DCO), `CODE_OF_CONDUCT`, `TRADEMARK.md`.
- Move prototype into `prototype/`.
- **Exit:** repo builds empty packages, CI green, lint clean.

### Phase 1 — `@vespera-ui/css` (ships first, works everywhere)

- Extract `styles.css` + `ui.css`, behavior unchanged.
- **Rebrand classes:** `.ag-` → `.vsp-`, `.ag-root` → `.vsp-root`. Decide whether to also namespace `.ui-*` → `.vsp-*`.
- Split for clarity: `tokens.css`, `base.css`, `shell.css`, `components.css` + one bundled `vespera.css` entry.
- Document **every token** (seed from prototype `AGENTS.md` §4).
- Emit `@vespera-ui/tokens` (JSON/JS) to feed the Tailwind preset + AI tooling.
- **Exit:** anyone, any framework, can `import '@vespera-ui/css'` and apply `.vsp-root` + classes. A complete, useful release on its own.

### Phase 2 — `@vespera-ui/react` (flagship)

Port the `.jsx`, killing prototype-only conventions:

- **`window` globals → real ESM** `import`/`export` (drop `Object.assign(window, …)`).
- `window.Icon.<name>` → `@vespera-ui/icons`.
- Convert to **TypeScript** with exported prop types (feeds the manifest + AI tooling).
- Resolve gotchas (see §7): portal target, themed `Select`, sticky tables, Kanban pointer logic.
- Order: primitives → overlays → select → datepicker → extras → charts → blocks/forms.
- Each component: source + types + test + **Storybook story** (every state/variant).
- **Set up Storybook** (component workbench) with the React + Vite builder; wire `.vsp-root` theming + a11y + interaction addons. This is the dev/test surface for components and contributors — distinct from the public docs site (Phase 4, Next.js + Fumadocs).
- **Exit:** `@vespera-ui/react` installs cleanly in a fresh Vite app; all components render themed; Storybook runs with stories for each.

### Phase 2.5 — `@vespera-ui/tailwind` (optional, shadcn-style)

- Preset mapping Vespera tokens → Tailwind theme keys (`bg-accent`, `rounded-md`, `text-dim`…), all backed by the CSS vars on `.vsp-root` so runtime theming still works.
- Additive only — core stays plain CSS; Tailwind users opt in.
- (Stretch) explore a **copy-in CLI** (`npx vespera add button`) for shadcn-style source ownership, mirroring the prototype's original copy-in nature.

### Phase 3 — AI-consumability (the differentiator)

- **Component manifest** (`manifest/*.json`): per component → props, classes, deps, framework availability, snippet. Generated from TS types where possible.
- **Skills** (`skills/`) via `skill-creator`: _Vespera component authoring_, _Vespera theming_.
- Root **`AGENTS.md`/`CLAUDE.md`**.
- **Exit:** an agent given only the repo can add a correct new component + theme it.

### Phase 4 — Docs site (`apps/web`, Next.js + Fumadocs)

> **Superseded:** originally planned (and briefly built) as **Astro + Starlight**. The shipped
> docs site is **Next.js + Fumadocs** at `apps/web`, static-exported to GitHub Pages; the
> Starlight build was retired (`dacc71f`). Rationale: tighter live-React-island integration
> (the demos import `@vespera-ui/react` directly) and MDX authoring via Fumadocs. Decision #5
> below is updated accordingly.

- Promote the showcase into a real docs site; Fumadocs gives nav/search/theming; render live React examples as islands (isolated per-demo iframes, see `apps/web/components/Preview.tsx`).
- Port the `SC_INDEX` ⌘K search (custom island or Starlight search).
- Deploy (GitHub Pages / Vercel).
- **Exit:** public docs with live examples + per-component API.

### Phase 5 — Additional frameworks (Angular, then on demand)

- `@vespera-ui/angular`: same CSS + icons, re-wrap markup. Presentational set first, then interactive.
- Consider extracting `@vespera-ui/headless` if interactive logic duplication across React+Angular hurts.
- **Exit:** Angular consumers get the same Vespera look + components.

### Phase 6 — Pro / open-core (separate private repo)

- Premium blocks, full screen templates, extra themes, Figma kit. Built on the open core; commercial license.

---

## 6. Multi-framework strategy (decision rationale)

**Chosen path: CSS-first, framework wrappers as thin layers.** Not "write-once Web Components."

Why not lead with Web Components/Lit: React/Angular custom-element interop has sharp edges (events, forms, SSR); components stop feeling native — rough for a first OSS project.

Why CSS-first fits Vespera: the system is _already_ class-driven; the CSS is the portable asset. `@vespera-ui/css` makes "supports many frameworks" true from v0.1. Per-framework wrappers are commodity re-wraps, ownable by contributors. A `headless` core can be added later **if** maintenance demands it — no rearchitecting.

Effort per framework: **presentational (~25)** = mechanical re-wrap; **interactive (~6)** = real logic, candidates for shared `headless`.

---

## 7. Technical porting notes (carry-over gotchas from prototype `AGENTS.md`)

Translate, don't copy:

- **`window` exports** → ESM modules.
- **Overlays must portal into `.vsp-root`** (was `.ag-root`), not `document.body`, or they lose CSS vars. Expose a configurable portal target (default: nearest `.vsp-root`).
- **Themed `Select`** API-compatible with native: `options`, `value`/`defaultValue`, `onChange({target:{value}})`, auto-search ≥8. Keep this contract.
- **Caret color** `var(--accent)` on inputs — free with the CSS package.
- **Sticky/frozen tables** need `table-layout: fixed`.
- **Kanban** is pointer-based (floating clone + insertion placeholder + held source slot), not HTML5 DnD.
- **`.vsp-root` is the theming root** — consumers wrap their app (or a subtree) in it with the `data-*` attributes.

---

## 8. AI skills plan (`skills/`)

| Skill               | Purpose                                                                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `vespera-component` | Author a new component correctly: CSS in `css` pkg, component in `react` pkg, TS prop types, manifest entry, docs/story, conventions enforced. |
| `vespera-theming`   | Re-skin via tokens (`data-theme`, `--accent`, density, corners, glow); generate a new theme block.                                             |
| `vespera-port`      | (later) Port a component to a new framework wrapper from the shared CSS + manifest.                                                            |

Each authored with `skill-creator`; validated with evals.

---

## 9. Versioning & releases

- **Changesets**-driven; independent per-package versions + a documented compatibility matrix (`react@x` needs `css@y`).
- SemVer; `0.x` while the API settles.
- Existing `CHANGELOG.md` seeds the root changelog.

---

## 10. Resolved decisions

| #   | Decision            | Choice                                                                                                                                                                                           | Why                                                                                                                                                                            |
| --- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Name / hosting      | **Vespera** · GitHub: start personal (`williams-gunawan/vespera-ui`) → transfer to **`forgialabs/vespera-ui`** later · npm **`@vespera-ui`** · © The Vespera Authors → PT Sentra Digital Kreatif | Low-ceremony start; transfer auto-redirects. Repo name matches npm scope; product keeps its npm brand (tailwindlabs/radix-ui model). "Vespera" = evening star / twilight glow. |
| 2   | License             | **Apache-2.0 + DCO**                                                                                                                                                                             | Patent grant + clean contribution terms for open-core.                                                                                                                         |
| 3   | v0.1 scope          | **CSS + React**                                                                                                                                                                                  | Flagship + "works everywhere" from day one.                                                                                                                                    |
| 4   | Lint/format         | **ESLint + Prettier**                                                                                                                                                                            | The industry standard; lowest friction for OSS contributors. (Biome considered but less conventional for a first OSS project.)                                                 |
| 5   | Public docs         | ~~**Astro + Starlight**~~ → **Next.js + Fumadocs** (`apps/web`, static export)                                                                                                                   | Originally Astro + Starlight; migrated to Next.js + Fumadocs for first-class live-React islands (demos import `@vespera-ui/react` directly) + MDX authoring. Starlight retired (`dacc71f`).      |
| 5b  | Component workbench | **Storybook**                                                                                                                                                                                    | Industry standard for design systems — isolate components, document every state, visual + a11y testing. Distinct from the public docs site.                                    |
| 6   | Styling             | **Plain CSS (source of truth) + optional `@vespera-ui/tailwind` preset**                                                                                                                         | Keeps zero-build multi-framework portability + runtime theming; Tailwind preset is shadcn-style convenience, additive.                                                         |
| 7   | Tokens package      | **Yes** (`@vespera-ui/tokens`)                                                                                                                                                                   | Single token source feeding CSS, Tailwind preset, and AI manifest.                                                                                                             |

### Still open (non-blocking)

- Namespace `.ui-*` → `.vsp-*` fully, or keep `.ui-*` scoped under `.vsp-root`? (Phase 1.)
- Angular timing — right after docs, or demand-driven?
- Copy-in CLI — pursue in Phase 2.5 or defer?

---

## Immediate next actions (Phase 0, on approval)

1. Create repo on **personal account** (`williams-gunawan/vespera-ui`); register npm scope `@vespera-ui`. Optionally reserve `forgialabs` org + `@forgia` scope for the later transfer.
2. `git init` + `main`.
3. pnpm workspace + Changesets + Biome + CI skeleton + Apache-2.0 LICENSE/NOTICE + README/CONTRIBUTING(DCO)/CODE_OF_CONDUCT.
4. Move prototype into `prototype/`.
5. Start Phase 1 (`@vespera-ui/css` extraction + `.ag-`→`.vsp-` rebrand).
