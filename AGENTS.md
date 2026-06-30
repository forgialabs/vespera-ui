# AGENTS.md — Vespera monorepo

Guidance for AI coding agents (and humans) working in this repository. Read this before
editing. For the **design conventions** of the system itself, also read
[`prototype/AGENTS.md`](./prototype/AGENTS.md).

## What this is

**Vespera** is a deep-space / "weightless" design system, being productized from the
build in `prototype/` into modular, framework-agnostic packages. The product is **Vespera**;
the studio is **Forgia** (GitHub org `forgialabs`); the legal owner is PT Sentra Digital
Kreatif. The full plan lives in [`docs/ROADMAP.md`](./docs/ROADMAP.md).

## Layout

| Path                               | Role                                                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `packages/css`                     | `@vespera-ui/css` — framework-agnostic tokens + component CSS. **The single source of truth for styling.** |
| `packages/icons`                   | `@vespera-ui/icons` — framework-neutral SVG icons.                                                         |
| `packages/react`                   | `@vespera-ui/react` — React components (flagship).                                                         |
| `prototype/`                       | The original design build (HTML + in-browser Babel JSX). Design source of truth — do not ship from here.   |
| `apps/web`                         | Docs site (Next.js + Fumadocs) → GitHub Pages (static export).                                             |
| `manifest/react.json`              | Machine-readable component API (props, types, defaults). Regenerate: `pnpm manifest`.                      |
| `.claude/skills/`                  | AI skills: `vespera-component` (authoring), `vespera-theming` (theming).                                   |
| `docs/ROADMAP.md` · `docs/TODO.md` | Phased plan + decisions · granular progress tracker.                                                       |

## Core rules

- **CSS is the source of truth.** Framework packages (`react`, future `angular`, …) consume
  `@vespera-ui/css`; they never fork or re-declare styles. Use tokens, never hardcoded hex.
- **`.vsp-root` is the theming root.** All tokens live on it via `data-*` attributes
  (`data-theme`, `data-density`, `data-corners`) and CSS variables (`--accent`, …).
  (The prototype was renamed Aether → Vespera and uses `.vsp-` throughout too.)
- **Overlays must portal into the nearest `.vsp-root`**, not `document.body`, or they lose
  the CSS variables. (See `prototype/AGENTS.md` for the full list of affected components.)
- **No `window` globals.** The prototype attaches components to `window`; productized
  packages use real ESM `import`/`export` and TypeScript.
- **Keep components thin and prop-driven.**

## Workflow

- Package manager: **pnpm** (workspaces). Lint/format: **ESLint + Prettier**. Versioning:
  **Changesets**. Component workbench: **Storybook**. Docs: **Next.js + Fumadocs** (`apps/web`,
  static-exported to GitHub Pages). _(The original Astro + Starlight docs build was retired —
  see `dacc71f`.)_
- Before committing: `pnpm lint && pnpm typecheck && pnpm build` should pass.
- User-facing package changes need a changeset (`pnpm changeset`).
- Commits are signed off (DCO): `git commit -s`.

## Conventions

- Tooling config lives at the root (`tsconfig.base.json`, `eslint.config.js`,
  `.prettierrc.json`). Packages extend the base tsconfig.
- New publishable code goes in a package under `packages/` with a scoped name
  `@vespera-ui/*`, `publishConfig.access = public`, and an entry in the README packages table.
