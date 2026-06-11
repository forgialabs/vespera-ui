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

That's it — see [Quick start](/vespera-ui/guides/quick-start/) to build something, or
[Theming](/vespera-ui/guides/theming/) to make it yours.
