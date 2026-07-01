import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { VspNavItem, VspNavGroup } from './side-nav.component';

// Title + story name mirror the React "Sidebar" story (packages/react/src/Nav.stories.tsx).
const meta: Meta = { title: 'Primitives/Nav' };
export default meta;

@Component({
  selector: 'vsp-sidebar-demo',
  imports: [VspNavItem, VspNavGroup],
  template: `
    <div class="ui-nav" style="width:240px">
      <vsp-nav-item icon="grid" label="Overview" [active]="true" />
      <vsp-nav-item icon="chart" label="Analytics" badge="3" />
      <vsp-nav-group icon="layers" label="Workspace" [defaultOpen]="true">
        <vsp-nav-item label="Members" [sub]="true" />
        <vsp-nav-item label="Billing" [sub]="true" />
      </vsp-nav-group>
      <vsp-nav-item icon="settings" label="Settings" />
    </div>
  `,
})
class SidebarDemo {}

export const Sidebar: StoryObj = {
  render: () => ({ moduleMetadata: { imports: [SidebarDemo] }, template: `<vsp-sidebar-demo />` }),
};
