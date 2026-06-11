---
title: Installation
description: Add Vespera's framework-agnostic CSS to your project.
---

Vespera's styling ships as a single framework-agnostic package: **`@vespera-ui/css`**. It
works in any framework, or in plain HTML.

## With a bundler (Vite, Next, Astro, etc.)

```bash
npm install @vespera-ui/css
```

Import it once, anywhere in your app's entry:

```js
import '@vespera-ui/css';
```

## Plain HTML / no build step

Link the stylesheet directly:

```html
<link rel="stylesheet" href="https://unpkg.com/@vespera-ui/css" />
```

## Wrap your app in `.vsp-root`

Vespera's tokens live on a root element. Wrap your app (or any subtree) in `.vsp-root` and
set the theming data-attributes:

```html
<div class="vsp-root" data-theme="dark" data-density="comfortable" data-corners="round">
  <button class="btn btn-primary">Get started</button>
</div>
```

## React components

Prefer typed components over raw classes? Add the React package (and the CSS, which it
relies on for styling):

```bash
npm install @vespera-ui/react @vespera-ui/css @vespera-ui/icons
```

```tsx
import '@vespera-ui/css';
import { Button, Badge } from '@vespera-ui/react';

export function App() {
  return (
    <div className="vsp-root" data-theme="dark">
      <Button variant="primary">Get started</Button>
      <Badge tone="pos" dot>
        Active
      </Badge>
    </div>
  );
}
```

See the [React components API](/vespera-ui/reference/react/) for every component and its props.

## Other frameworks

Vespera ships typed component wrappers for **Vue**, **Svelte**, and **Angular** too — each is a
thin layer over the same `@vespera-ui/css`, so they render identical markup and theme the same
way. See the [Frameworks guide](/vespera-ui/guides/frameworks/) for install and usage in each.

## The package family

| Package                | What it is                                              |
| ---------------------- | ------------------------------------------------------ |
| `@vespera-ui/css`      | Framework-agnostic CSS — the source of truth           |
| `@vespera-ui/react`    | React components                                        |
| `@vespera-ui/vue`      | Vue 3 components                                        |
| `@vespera-ui/svelte`   | Svelte 5 components                                     |
| `@vespera-ui/angular`  | Angular 20 components                                   |
| `@vespera-ui/icons`    | Framework-neutral SVG icon set                          |
| `@vespera-ui/tokens`   | Design tokens as data (TS + `tokens.json`)             |
| `@vespera-ui/tailwind` | Tailwind CSS preset                                     |
| `@vespera-ui/cli`      | Copy components into your project (`npx vespera add`)   |

---

That's it — see [Quick start](/vespera-ui/guides/quick-start/) to build something, or
[Theming](/vespera-ui/guides/theming/) to make it yours.
