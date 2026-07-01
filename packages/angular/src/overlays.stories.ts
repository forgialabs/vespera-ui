import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { VspButton } from './button.component';
import { VspDialog, VspSheet } from './overlay.component';
import { VspCommandPalette, type CommandGroup } from './command-palette.component';

// Title + story names mirror packages/react/src/Overlays.stories.tsx.
const meta: Meta = { title: 'Overlays' };
export default meta;

@Component({
  selector: 'vsp-dialog-demo',
  imports: [VspButton, VspDialog],
  template: `
    <vsp-button variant="primary" (click)="open = true">Open dialog</vsp-button>
    <vsp-dialog
      [open]="open"
      (close)="open = false"
      tone="neg"
      title="Delete workspace?"
      desc="This permanently removes the workspace and all its data."
    />
  `,
})
class DialogDemo {
  open = false;
}

@Component({
  selector: 'vsp-sheet-demo',
  imports: [VspButton, VspSheet],
  template: `
    <vsp-button (click)="open = true">Open sheet</vsp-button>
    <vsp-sheet
      [open]="open"
      (close)="open = false"
      side="right"
      title="Settings"
      desc="Slides in from the edge; traps focus until closed."
    />
  `,
})
class SheetDemo {
  open = false;
}

@Component({
  selector: 'vsp-command-demo',
  imports: [VspButton, VspCommandPalette],
  template: `
    <vsp-button (click)="open = true">Open ⌘K</vsp-button>
    <vsp-command-palette [open]="open" (close)="open = false" [groups]="groups" />
  `,
})
class CommandDemo {
  open = false;
  groups: CommandGroup[] = [
    {
      label: 'Actions',
      items: [
        { label: 'New project', meta: '⌘N' },
        { label: 'Search docs', keywords: 'help find' },
      ],
    },
    {
      label: 'Navigation',
      items: [{ label: 'Go to dashboard' }, { label: 'Settings' }],
    },
  ];
}

export const DialogExample: StoryObj = {
  name: 'Dialog',
  render: () => ({ moduleMetadata: { imports: [DialogDemo] }, template: `<vsp-dialog-demo />` }),
};

export const SheetExample: StoryObj = {
  name: 'Sheet',
  render: () => ({ moduleMetadata: { imports: [SheetDemo] }, template: `<vsp-sheet-demo />` }),
};

export const Command: StoryObj = {
  name: 'Command palette',
  render: () => ({ moduleMetadata: { imports: [CommandDemo] }, template: `<vsp-command-demo />` }),
};
