# @vespera-ui/tokens

The design tokens behind [Vespera](https://github.com/forgialabs/vespera-ui), as portable
data. These mirror the CSS custom properties that `@vespera-ui/css` sets on `.vsp-root`.

`@vespera-ui/css` is the runtime source of truth; this package is the same values in a shape
you can feed to a Tailwind preset, Style Dictionary, Figma sync, or your own tooling.

```bash
npm install @vespera-ui/tokens
```

```ts
import tokens, { palette, radius, themes } from '@vespera-ui/tokens';

palette.blue; // '#4a7cff'
radius.default.md; // 12
themes.dark.surface1; // '#0e131f'
```

Raw JSON is also published for non-JS tooling:

```ts
import tokens from '@vespera-ui/tokens/tokens.json';
```

## What's inside

| Export    | Description                                              |
| --------- | -------------------------------------------------------- |
| `fonts`   | `sans` / `mono` font stacks                              |
| `palette` | Fixed named colors (Accent & Accent-2 select from these) |
| `accent`  | Default accent (`base` / `alt` / `ink`)                  |
| `radius`  | Corner radii (px) per `data-corners` style               |
| `density` | Spacing & sizing (px) per `data-density` scale           |
| `themes`  | Semantic colors for `dark` and `light`                   |

License: Apache-2.0
