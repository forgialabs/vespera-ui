# @vespera-ui/css

Framework-agnostic CSS for the **Vespera** design system — design tokens plus component
styles, all driven by CSS variables on the `.vsp-root` element. Works in **any framework, or
plain HTML**.

## Install

```bash
pnpm add @vespera-ui/css
```

## Usage

Import the bundle once, then wrap your app (or any subtree) in `.vsp-root` with the theming
data-attributes:

```js
import '@vespera-ui/css';
```

```html
<div class="vsp-root" data-theme="dark" data-density="comfortable" data-corners="round">
  <button class="btn btn-primary">Get started</button>
  <span class="badge badge-pos"><i></i>Active</span>
</div>
```

## Theming

Everything is a CSS variable on `.vsp-root`. Re-theme by overriding tokens or setting
data-attributes — never hardcode hex.

| Attribute / var     | Values                                   | Effect                           |
| ------------------- | ---------------------------------------- | -------------------------------- |
| `data-theme`        | `dark` \| `light`                        | Full token swap                  |
| `data-density`      | `compact` \| `comfortable` \| `spacious` | Control heights, padding, gaps   |
| `data-corners`      | `round` \| `soft` \| `sharp`             | Border radii                     |
| `--accent` (inline) | any color                                | Brand / primary color everywhere |

```html
<div class="vsp-root" data-theme="dark" style="--accent:#1fb574">…</div>
```

## Entry points

The bundle (`@vespera-ui/css`) includes everything. You can also import parts individually:

| Import                           | Contents                                                    |
| -------------------------------- | ----------------------------------------------------------- |
| `@vespera-ui/css`                | Everything (tokens + base + shell + components)             |
| `@vespera-ui/css/tokens.css`     | Tokens, themes, density, corners only                       |
| `@vespera-ui/css/base.css`       | Reset, root background/glow, helpers, scrollbars            |
| `@vespera-ui/css/shell.css`      | App shell (`.vsp-*`): sidebar, topbar, nav                  |
| `@vespera-ui/css/components.css` | Primitives (`.btn/.card/.badge/.chip`) + `.ui-*` components |

## Demo

Open [`demo/index.html`](./demo/index.html) in a browser for a live kitchen-sink with
theme / accent / density / corners switchers.

## License

[Apache-2.0](../../LICENSE)
