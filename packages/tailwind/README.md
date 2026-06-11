# @vespera-ui/tailwind

A [Tailwind CSS](https://tailwindcss.com) preset for the
[Vespera](https://github.com/forgialabs/vespera-ui) design system. Use Tailwind utilities that
follow Vespera theming.

```bash
npm install @vespera-ui/tailwind @vespera-ui/css tailwindcss
```

```js
// tailwind.config.js
import vespera from '@vespera-ui/tailwind';

export default {
  presets: [vespera],
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
};
```

Import the CSS once and wrap your app in a themed `.vsp-root`:

```js
import '@vespera-ui/css';
```

```html
<div class="vsp-root" data-theme="dark">
  <div class="bg-surface-1 text-text border border-border rounded-md font-sans">
    Themed with Tailwind utilities.
  </div>
</div>
```

## What the preset adds

| Utility group  | Examples                                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Colors (theme) | `bg`, `bg-glow`, `surface-1/2/3`, `hover`, `text`, `text-dim`, `text-faint`, `accent`, `accent-2`, `border`, `border-strong`, `success`, `danger`, `warning` |
| Colors (fixed) | `blue`, `cyan`, `indigo`, `violet`, `emerald`, `coral`, `amber`, `magenta`                                                                                   |
| Radius         | `rounded-sm/md/lg/pill`                                                                                                                                      |
| Font           | `font-sans`, `font-mono`                                                                                                                                     |
| Shadow         | `shadow-vesp`, `shadow-vesp-lg`                                                                                                                              |

The theme colors map to the live CSS variables from `@vespera-ui/css`, so they react to
`data-theme`, `data-density`, `data-corners`, and inline `--accent`. Because those are
`var(--x)` values, Tailwind opacity modifiers (e.g. `bg-accent/50`) don't apply to them — use
the fixed palette colors (e.g. `bg-violet/50`) when you need `/opacity`.

License: Apache-2.0
