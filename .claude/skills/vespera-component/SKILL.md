---
name: vespera-component
description: Author or modify a component in the Vespera design system (@vespera-ui/react, @vespera-ui/css). Use when adding, editing, or reviewing a Vespera UI component, or when asked to build UI "with Vespera" in this repo.
---

# Authoring a Vespera component

Vespera separates **styling** (CSS, framework-agnostic) from **behavior** (thin React
wrappers). Follow these rules so a new component fits the system.

## Where things live

- **Styles** → `packages/css/src/` (`tokens.css` / `base.css` / `shell.css` / `components.css`).
  All visuals are CSS variables on `.vsp-root`.
- **React component** → `packages/react/src/<Name>.tsx`, re-exported from `src/index.ts`.
- **Icons** → import from `@vespera-ui/icons` (`import { Icon } from '@vespera-ui/icons'`).
- **Design source of truth** → `prototype/` (see `prototype/AGENTS.md`).
- **Machine-readable API** → `manifest/react.json` (regenerate with `pnpm manifest`).

## Rules (do not break these)

1. **CSS is the single source of truth.** Never hardcode hex — use tokens
   (`var(--accent)`, `var(--surface-1)`, …) or `color-mix(in oklab, var(--accent) N%, …)`.
   Framework packages never fork styles; they emit class names.
2. **Class names:** app-shell classes are `.vsp-*`; component classes are `.ui-*`. Everything
   lives inside a `.vsp-root` ancestor (which carries the theme tokens).
3. **Typed, prop-driven, thin.** Write TypeScript with an exported `Props` interface. Keep
   logic minimal; the component should mostly compose class names with `cx(...)`.
4. **Icon props are `ReactNode`** (pass `<Icon.plus />`), never string names.
5. **Overlays must portal into the nearest `.vsp-root`** via `getPortalTarget()` (from
   `./portal`) — not `document.body`, or they lose the theme tokens.
6. **No `window` globals.** Use real ESM imports/exports (the prototype's `window.X` pattern
   is dropped).

## Checklist for a new component

- [ ] Add or reuse CSS in `packages/css/src/components.css` (tokens only).
- [ ] Create `packages/react/src/<Name>.tsx` with a typed `Props` interface and JSDoc.
- [ ] Re-export it from `packages/react/src/index.ts`.
- [ ] Add a `<Name>.stories.tsx` Storybook story.
- [ ] Add a changeset: `pnpm changeset` (usually a `minor` for `@vespera-ui/react`).
- [ ] Regenerate the manifest: `pnpm manifest`.
- [ ] Verify: `pnpm build && pnpm typecheck && pnpm lint` (build before typecheck — `react`
      depends on the built `icons`).

## Reference: an idiomatic component

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export interface BannerProps extends ButtonHTMLAttributes<HTMLDivElement> {
  tone?: 'info' | 'warn';
  icon?: ReactNode;
}

export function Banner({ tone = 'info', icon, children, className, ...rest }: BannerProps) {
  return (
    <div className={cx('ui-banner', tone, className)} {...rest}>
      {icon}
      {children}
    </div>
  );
}
```
