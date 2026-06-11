# @vespera-ui/svelte

[Svelte 5](https://svelte.dev) components for the
[Vespera](https://github.com/forgialabs/vespera-ui) design system. Thin wrappers over
`@vespera-ui/css` — they emit the same classes as `@vespera-ui/react`, so theming via
`.vsp-root` works identically across frameworks. Ships raw `.svelte` source; your bundler
compiles it.

```bash
npm install @vespera-ui/svelte @vespera-ui/css svelte
```

```js
// main
import '@vespera-ui/css';
```

```svelte
<script>
  import { Button, Field, Input, Switch } from '@vespera-ui/svelte';
  let name = $state('');
  let on = $state(true);
</script>

<div class="vsp-root" data-theme="dark">
  <Field label="Name" required>
    <Input bind:value={name} placeholder="Ada Lovelace" />
  </Field>
  <Switch bind:checked={on} />
  <Button variant="primary">Save</Button>
</div>
```

Form components support `bind:` (`Input`, `Switch`, `Checkbox`). `Alert`, `CardHead`, and
`Button` accept snippets for icons/actions/content.

## Components

`Button`, `IconButton`, `Badge`, `Tag`, `Kbd`, `Divider`, `Spinner`, `Card`, `CardHead`,
`Alert`, `Field`, `Input`, `Textarea`, `NativeSelect`, `Switch`, `Checkbox`, `Radio`,
`RadioGroup`, `Slider`, `Progress`, `Skeleton`, `Avatar`, `AvatarGroup`, `Segmented`, `Tabs`,
`Breadcrumb`, `Pagination`, `Stepper`, `CircularProgress`, `Stat`, `Timeline`, `DescriptionList`,
`Banner`, `EmptyState`, `Accordion`. The overlay/portal components (dialogs, menus, toasts, the
themed select, date pickers) are React-only for now — use the raw classes for those.

License: Apache-2.0
