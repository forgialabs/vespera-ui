import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { VspNavItem, VspNavGroup } from './side-nav.component';
import { VspBreadcrumb, VspPagination, VspStepper, VspTabs } from './nav.component';

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

export const Breadcrumbs: StoryObj = {
  name: 'Breadcrumbs',
  render: () => ({
    moduleMetadata: { imports: [VspBreadcrumb] },
    props: { items: ['Home', 'Projects', 'Vespera'] },
    template: `<vsp-breadcrumb [items]="items" />`,
  }),
};

export const Paginate: StoryObj = {
  name: 'Paginate',
  render: () => ({
    moduleMetadata: { imports: [VspPagination] },
    template: `<vsp-pagination [page]="2" [pages]="8" />`,
  }),
};

export const Steps: StoryObj = {
  name: 'Steps',
  render: () => ({
    moduleMetadata: { imports: [VspStepper] },
    props: { steps: ['Account', 'Profile', 'Billing', 'Done'] },
    template: `<div style="width:100%;max-width:520px"><vsp-stepper [steps]="steps" [current]="1" /></div>`,
  }),
};

export const Tabs: StoryObj = {
  name: 'Tabs',
  render: () => ({
    moduleMetadata: { imports: [VspTabs] },
    props: {
      tabs: [
        { value: 'overview', label: 'Overview' },
        { value: 'activity', label: 'Activity', count: 3 },
        { value: 'settings', label: 'Settings' },
      ],
    },
    template: `<vsp-tabs [tabs]="tabs" value="overview" />`,
  }),
};
