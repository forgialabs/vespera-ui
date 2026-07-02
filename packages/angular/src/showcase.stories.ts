import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { VspButton } from './button.component';
import { VspBadge } from './badge.component';
import { VspAlert } from './alert.component';
import { VspSelect } from './select.component';
import { VspCheckbox, VspSwitch } from './toggle.component';
import { VspSlider } from './forms.component';
import { VspTabs, VspBreadcrumb } from './nav.component';
import { VspStatCard } from './charts.component';
import { VspNavItem, VspNavGroup } from './side-nav.component';
import { VspOrdersBlock } from './blocks2.component';
import { VspKanbanBlock } from './kanban.component';

// Full-page Angular showcases embedded by the docs /demo and /admin pages (framework toggle).
const meta: Meta = { title: 'Showcase' };
export default meta;

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Grape', 'Kiwi', 'Mango', 'Pear'];

@Component({
  selector: 'vsp-playground-demo',
  imports: [
    VspButton,
    VspBadge,
    VspAlert,
    VspSelect,
    VspCheckbox,
    VspSwitch,
    VspSlider,
    VspTabs,
    VspStatCard,
  ],
  styles: [
    `
      .pg {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
        width: 100%;
        max-width: 1000px;
      }
      .panel {
        border: 1px solid var(--border);
        border-radius: var(--r-md);
        background: var(--surface-1);
        padding: 16px;
      }
      .panel h3 {
        margin: 0 0 12px;
        font-size: 13px;
        color: var(--text-dim);
        font-weight: 600;
      }
      .row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
      }
      .col {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    `,
  ],
  template: `
    <div class="pg">
      <div class="panel">
        <h3>Buttons</h3>
        <div class="row">
          <vsp-button variant="primary">Primary</vsp-button>
          <vsp-button variant="ghost">Ghost</vsp-button>
          <vsp-button variant="outline">Outline</vsp-button>
          <vsp-button variant="danger">Delete</vsp-button>
          <vsp-button variant="primary" [loading]="true">Saving…</vsp-button>
        </div>
      </div>
      <div class="panel">
        <h3>Badges</h3>
        <div class="row">
          <vsp-badge tone="pos" [dot]="true">Active</vsp-badge>
          <vsp-badge tone="neg">Error</vsp-badge>
          <vsp-badge tone="warn">Warning</vsp-badge>
          <vsp-badge tone="info">Info</vsp-badge>
          <vsp-badge tone="muted">Draft</vsp-badge>
        </div>
      </div>
      <div class="panel">
        <h3>Select</h3>
        <vsp-select [options]="fruits" value="Banana" />
      </div>
      <div class="panel">
        <h3>Selection &amp; toggles</h3>
        <div class="col">
          <vsp-checkbox [checked]="true" label="Email notifications" sub="Activity updates" />
          <div class="row"><vsp-switch [checked]="true" /> <vsp-switch /></div>
          <vsp-slider [value]="40" />
        </div>
      </div>
      <div class="panel">
        <h3>Tabs</h3>
        <vsp-tabs [tabs]="tabs" value="overview" />
      </div>
      <div class="panel">
        <h3>Feedback</h3>
        <vsp-alert tone="pos" title="Saved">Your changes are live.</vsp-alert>
      </div>
      <div class="panel">
        <h3>Stat</h3>
        <vsp-stat-card label="Revenue" value="$48.2k" delta="+12%" [spark]="spark" />
      </div>
    </div>
  `,
})
class PlaygroundDemo {
  fruits = FRUITS;
  spark = [3, 5, 4, 7, 6, 9, 8, 11];
  tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'activity', label: 'Activity', count: 3 },
    { value: 'settings', label: 'Settings' },
  ];
}

@Component({
  selector: 'vsp-admin-demo',
  imports: [
    VspNavItem,
    VspNavGroup,
    VspStatCard,
    VspBreadcrumb,
    VspOrdersBlock,
    VspKanbanBlock,
    VspBadge,
  ],
  styles: [
    `
      .admin {
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 0;
        width: 100%;
        max-width: 1100px;
        border: 1px solid var(--border);
        border-radius: var(--r-md);
        overflow: hidden;
        background: var(--surface-1);
      }
      .side {
        border-right: 1px solid var(--border);
        padding: 14px;
        background: var(--surface-2);
      }
      .main {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        min-width: 0;
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
      }
      .brand {
        font-weight: 700;
        margin-bottom: 12px;
        display: flex;
        gap: 8px;
        align-items: center;
      }
    `,
  ],
  template: `
    <div class="admin">
      <div class="side">
        <div class="brand">Vespera <vsp-badge tone="info">Admin</vsp-badge></div>
        <div class="ui-nav">
          <vsp-nav-item icon="grid" label="Overview" [active]="true" />
          <vsp-nav-item icon="cart" label="Orders" badge="6" />
          <vsp-nav-group icon="layers" label="Workspace" [defaultOpen]="true">
            <vsp-nav-item label="Board" [sub]="true" />
            <vsp-nav-item label="Team" [sub]="true" />
          </vsp-nav-group>
          <vsp-nav-item icon="settings" label="Settings" />
        </div>
      </div>
      <div class="main">
        <vsp-breadcrumb [items]="['Workspace', 'Overview']" />
        <div class="stats">
          <vsp-stat-card label="Revenue" value="$48.2k" delta="+12%" [spark]="s1" />
          <vsp-stat-card label="Sessions" value="92.4k" delta="+6%" [spark]="s2" />
          <vsp-stat-card label="Conversion" value="3.8%" delta="+0.6%" [spark]="s3" />
        </div>
        <vsp-orders-block />
        <vsp-kanban-block />
      </div>
    </div>
  `,
})
class AdminDemo {
  s1 = [12, 18, 15, 22, 19, 26, 24, 31];
  s2 = [20, 22, 21, 25, 24, 28, 27, 31];
  s3 = [2, 3, 3, 4, 4, 5, 5, 6];
}

export const Playground: StoryObj = {
  render: () => ({
    moduleMetadata: { imports: [PlaygroundDemo] },
    template: `<vsp-playground-demo />`,
  }),
};

export const Admin: StoryObj = {
  render: () => ({ moduleMetadata: { imports: [AdminDemo] }, template: `<vsp-admin-demo />` }),
};
