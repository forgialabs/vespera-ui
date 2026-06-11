# @vespera-ui/react

Typed React components for the **Vespera** design system (the flagship framework package).
Styling comes from [`@vespera-ui/css`](../css); icons from [`@vespera-ui/icons`](../icons).

> 🚧 **Pre-release (0.x).** The first set of primitives is here; overlays, the searchable
> Select, data components, and blocks follow.

## Install

```bash
pnpm add @vespera-ui/react @vespera-ui/css
```

## Usage

Import the CSS once, wrap your app in a themed `.vsp-root`, then use the components:

```tsx
import '@vespera-ui/css';
import { Button, Badge, Field, Input } from '@vespera-ui/react';

export function App() {
  return (
    <div className="vsp-root" data-theme="dark" data-density="comfortable">
      <Field label="Email">
        <Input placeholder="you@example.com" />
      </Field>
      <Button variant="primary">Save</Button>
      <Badge tone="pos" dot>
        Active
      </Badge>
    </div>
  );
}
```

Icon props take any node, so pass icons from `@vespera-ui/icons` (or your own):

```tsx
import { Icon } from '@vespera-ui/icons';
<Button leadingIcon={<Icon.plus />}>Create</Button>;
```

## Components

`Button`, `IconButton`, `Field`, `Input`, `Textarea`, `Select`, `InputAffix`, `Checkbox`,
`Radio`, `RadioGroup`, `Switch`, `Slider`, `Badge`, `Tag`, `Kbd`, `Divider`, `Alert`,
`Progress`, `Skeleton`, `Spinner`, `Tabs`, `Tooltip`, `Breadcrumb`, `Pagination`, `Stepper`,
`Card`, `CardHead`, plus the `cx` class-name helper.

## Develop

```bash
pnpm --filter @vespera-ui/react storybook        # component workbench at :6006
pnpm --filter @vespera-ui/react build            # build the package
```

## License

[Apache-2.0](../../LICENSE)
