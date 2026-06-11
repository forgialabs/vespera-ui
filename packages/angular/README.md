# @vespera-ui/angular

[Angular](https://angular.dev) (standalone) components for the
[Vespera](https://github.com/forgialabs/vespera-ui) design system. Thin wrappers over
`@vespera-ui/css` — they emit the same classes as `@vespera-ui/react`, so theming via
`.vsp-root` works identically across frameworks. Built with `ng-packagr` (Angular Package
Format); Angular 20+.

```bash
npm install @vespera-ui/angular @vespera-ui/css
```

```ts
// main.ts
import '@vespera-ui/css';
```

Components are standalone — import the ones you use:

```ts
import { Component } from '@angular/core';
import { VspButton, VspField, VspInput, VspSwitch } from '@vespera-ui/angular';

@Component({
  selector: 'app-demo',
  imports: [VspButton, VspField, VspInput, VspSwitch],
  template: `
    <div class="vsp-root" data-theme="dark">
      <vsp-field label="Name" required>
        <vsp-input [(value)]="name" placeholder="Ada Lovelace" />
      </vsp-field>
      <vsp-switch [(checked)]="on" />
      <vsp-button variant="primary">Save</vsp-button>
    </div>
  `,
})
export class DemoComponent {
  name = '';
  on = true;
}
```

Form components support two-way binding (`[(value)]` on `vsp-input`, `[(checked)]` on
`vsp-switch` / `vsp-checkbox`). `vsp-alert` and `vsp-card-head` accept projected content via
`slot="icon"` / `slot="action"` / `slot="right"`.

## Components

`vsp-button`, `vsp-icon-button`, `vsp-badge`, `vsp-tag`, `vsp-kbd`, `vsp-divider`, `vsp-spinner`,
`vsp-card`, `vsp-card-head`, `vsp-alert`, `vsp-field`, `vsp-input`, `vsp-textarea`,
`vsp-native-select`, `vsp-switch`, `vsp-checkbox`, `vsp-radio`, `vsp-radio-group`, `vsp-slider`,
`vsp-progress`, `vsp-skeleton`, `vsp-avatar`, `vsp-avatar-group`, `vsp-segmented`, `vsp-tabs`,
`vsp-breadcrumb`, `vsp-pagination`, `vsp-stepper`, `vsp-circular-progress`, `vsp-stat`,
`vsp-timeline`, `vsp-description-list`, `vsp-banner`, `vsp-empty-state`, `vsp-accordion`. The
overlay/portal components (dialogs, menus, toasts, the themed select, date pickers) are
React-only for now — use the raw classes for those.

License: Apache-2.0
