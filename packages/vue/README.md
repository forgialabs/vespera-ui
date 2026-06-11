# @vespera-ui/vue

[Vue 3](https://vuejs.org) components for the [Vespera](https://github.com/forgialabs/vespera-ui)
design system. Thin wrappers over `@vespera-ui/css` — they emit the same classes as
`@vespera-ui/react`, so theming via `.vsp-root` works identically across frameworks.

```bash
npm install @vespera-ui/vue @vespera-ui/css
```

```ts
// main.ts
import '@vespera-ui/css';
```

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Field, Input, Switch } from '@vespera-ui/vue';

const name = ref('');
const on = ref(true);
</script>

<template>
  <div class="vsp-root" data-theme="dark">
    <Field label="Name" required>
      <Input v-model="name" placeholder="Ada Lovelace" />
    </Field>
    <Switch v-model="on" />
    <Button variant="primary">Save</Button>
  </div>
</template>
```

Form components support `v-model` (`Input`, `Textarea`, `Switch`, `Checkbox`). Buttons expose
`leading` / `trailing` slots for icons.

## Components

`Button`, `IconButton`, `Badge`, `Tag`, `Kbd`, `Divider`, `Spinner`, `Card`, `CardHead`, `Alert`,
`Field`, `Input`, `Textarea`, `NativeSelect`, `Switch`, `Checkbox`, `Radio`, `RadioGroup`,
`Slider`, `Progress`, `Skeleton`, `Avatar`, `AvatarGroup`, `Segmented`, `Tabs`, `Breadcrumb`,
`Pagination`, `Stepper`, `CircularProgress`, `Stat`, `Timeline`, `DescriptionList`, `Banner`,
`EmptyState`, `Accordion`. The overlay/portal components (dialogs, menus, toasts, the themed
select, date pickers) are React-only for now — use the raw classes for those in other frameworks.

License: Apache-2.0
