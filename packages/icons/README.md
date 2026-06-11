# @vespera-ui/icons

Framework-neutral stroke icon set for the **Vespera** design system (Lucide-style geometry).
Each icon is a React component that renders an SVG using `currentColor`.

## Install

```bash
pnpm add @vespera-ui/icons
```

## Usage

```tsx
import { Icon } from '@vespera-ui/icons';

<Icon.check />;
<Icon.bell style={{ width: 20, height: 20 }} />;
```

Icons inherit color from `currentColor` and accept any SVG props (`width`, `height`,
`className`, `style`, …). Use the `IconName` type for a name union.

## License

[Apache-2.0](../../LICENSE)
