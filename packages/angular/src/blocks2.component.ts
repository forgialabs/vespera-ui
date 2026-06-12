import { Component, Input } from '@angular/core';
import { VspBlock } from './blocks.component';
import { VspBadge, type BadgeTone } from './badge.component';
import { VspAvatar } from './media.component';
import { VspTabs } from './nav.component';
import { VspTooltip } from './tooltip.component';
import { VspSelect } from './select.component';
import { VspDropdownMenu, type MenuItem } from './anchored.component';
import { VspIcon } from './icon.component';
import { toast } from './toast.component';

/* ===================== Orders ===================== */

export type OrderState = 'fulfilled' | 'processing' | 'pending' | 'refunded';
export interface Order {
  id: string;
  company: string;
  hue: number;
  item: string;
  state: OrderState;
  amount: number;
}
const ORDER_TONE: Record<OrderState, BadgeTone> = {
  fulfilled: 'pos',
  processing: 'info',
  pending: 'warn',
  refunded: 'neg',
};
const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ORD-90210',
    company: 'Northwind',
    hue: 220,
    item: 'Annual license',
    state: 'fulfilled',
    amount: 2400,
  },
  {
    id: 'ORD-90211',
    company: 'Halcyon',
    hue: 150,
    item: 'Seat add-on',
    state: 'processing',
    amount: 320,
  },
  {
    id: 'ORD-90212',
    company: 'Vertex',
    hue: 280,
    item: 'Pro upgrade',
    state: 'pending',
    amount: 980,
  },
  {
    id: 'ORD-90213',
    company: 'Cobalt',
    hue: 12,
    item: 'API overage',
    state: 'refunded',
    amount: 140,
  },
  {
    id: 'ORD-90214',
    company: 'Beacon',
    hue: 95,
    item: 'Support plan',
    state: 'fulfilled',
    amount: 3120,
  },
  {
    id: 'ORD-90215',
    company: 'Lumen',
    hue: 320,
    item: 'Onboarding',
    state: 'processing',
    amount: 1500,
  },
];
const ROW_MENU: MenuItem[] = [
  { label: 'View order', icon: 'eye' },
  { label: 'Refund', icon: 'refresh' },
  { sep: true },
  { label: 'Cancel', icon: 'x', danger: true },
];

/** Operational table: tab filters, bulk selection, status badges, row menu. */
@Component({
  selector: 'vsp-orders-block',
  imports: [VspBlock, VspBadge, VspAvatar, VspTabs, VspDropdownMenu, VspIcon],
  template: `<vsp-block
    title="Orders"
    desc="Operational table with tab filters, bulk selection, inline status and a row action menu."
  >
    <div
      style="display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-bottom: 1px solid var(--border)"
    >
      <vsp-tabs [(value)]="tab" [tabs]="tabs" />
      <div style="flex: 1"></div>
      @if (sel.size > 0) {
        <vsp-badge tone="info">{{ sel.size }} selected</vsp-badge>
        <button type="button" class="btn btn-ghost btn-sm">
          <vsp-icon name="download" [size]="15" />Export
        </button>
        <button type="button" class="btn btn-ghost btn-sm">
          <vsp-icon name="check" [size]="15" />Fulfill
        </button>
      } @else {
        <button type="button" class="btn btn-ghost btn-sm">
          <vsp-icon name="filter" [size]="15" />Filter
        </button>
        <button type="button" class="btn btn-primary btn-sm">
          <vsp-icon name="plus" [size]="15" />New order
        </button>
      }
    </div>
    <div style="overflow-x: auto">
      <table class="ui-table" style="min-width: 720px">
        <thead>
          <tr>
            <th style="width: 44px">
              <span
                [class]="'ui-check' + (allSel ? ' on' : '')"
                role="checkbox"
                [attr.aria-checked]="allSel"
                (click)="toggleAll()"
              >
                <vsp-icon name="check" [size]="14" />
              </span>
            </th>
            <th><span class="eyebrow">Order</span></th>
            <th><span class="eyebrow">Customer</span></th>
            <th><span class="eyebrow">Item</span></th>
            <th><span class="eyebrow">Status</span></th>
            <th style="text-align: right"><span class="eyebrow">Amount</span></th>
            <th style="width: 44px"></th>
          </tr>
        </thead>
        <tbody>
          @for (o of rows; track o.id) {
            <tr
              [style.background]="
                sel.has(o.id) ? 'color-mix(in oklab, var(--accent) 7%, transparent)' : null
              "
            >
              <td>
                <span
                  [class]="'ui-check' + (sel.has(o.id) ? ' on' : '')"
                  role="checkbox"
                  [attr.aria-checked]="sel.has(o.id)"
                  (click)="toggle(o.id)"
                >
                  <vsp-icon name="check" [size]="14" />
                </span>
              </td>
              <td class="mono" style="font-weight: 600">{{ o.id }}</td>
              <td>
                <div style="display: flex; align-items: center; gap: 10px">
                  <vsp-avatar [name]="o.company" [hue]="o.hue" [size]="28" />
                  <span style="font-weight: 500">{{ o.company }}</span>
                </div>
              </td>
              <td style="color: var(--text-dim)">{{ o.item }}</td>
              <td>
                <vsp-badge [tone]="orderTone(o.state)" [dot]="true">{{ o.state }}</vsp-badge>
              </td>
              <td class="tnum" style="text-align: right; font-weight: 700">
                \${{ o.amount.toLocaleString() }}
              </td>
              <td>
                <vsp-dropdown-menu [items]="rowMenu">
                  <button
                    slot="trigger"
                    type="button"
                    class="vsp-icon-btn"
                    style="width: 30px; height: 30px; border: 0; background: transparent"
                    aria-label="Row actions"
                  >
                    <vsp-icon name="more" [size]="18" />
                  </button>
                </vsp-dropdown-menu>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </vsp-block>`,
})
export class VspOrdersBlock {
  @Input() orders: Order[] = DEFAULT_ORDERS;
  tab = 'all';
  sel = new Set<string>();
  rowMenu = ROW_MENU;

  get tabs() {
    return [
      { value: 'all', label: 'All', count: this.orders.length },
      { value: 'processing', label: 'Processing' },
      { value: 'pending', label: 'Pending' },
      { value: 'refunded', label: 'Refunded' },
    ];
  }
  get rows(): Order[] {
    return this.orders.filter((o) => this.tab === 'all' || o.state === this.tab);
  }
  get allSel(): boolean {
    return this.rows.length > 0 && this.rows.every((r) => this.sel.has(r.id));
  }
  orderTone(s: OrderState): BadgeTone {
    return ORDER_TONE[s];
  }
  toggleAll(): void {
    const n = new Set(this.sel);
    if (this.allSel) this.rows.forEach((r) => n.delete(r.id));
    else this.rows.forEach((r) => n.add(r.id));
    this.sel = n;
  }
  toggle(id: string): void {
    const n = new Set(this.sel);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    this.sel = n;
  }
}

/* ===================== Team & roles ===================== */

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  hue: number;
  role: string;
}
const DEFAULT_MEMBERS: TeamMember[] = [
  { id: 0, name: 'Avery Quinn', email: 'avery@vespera.dev', hue: 250, role: 'Owner' },
  { id: 1, name: 'Maya Okafor', email: 'maya@northwind.com', hue: 220, role: 'Admin' },
  { id: 2, name: 'Leo Vega', email: 'leo@halcyon.com', hue: 150, role: 'Editor' },
  { id: 3, name: 'Noor Haddad', email: 'noor@beacon.com', hue: 40, role: 'Viewer' },
];
const MEMBER_MENU: MenuItem[] = [
  { label: 'Resend invite', icon: 'mail' },
  { label: 'Transfer ownership', icon: 'shield' },
  { sep: true },
  { label: 'Remove', icon: 'x', danger: true },
];

/** Member list with inline role selects and a per-row action menu. */
@Component({
  selector: 'vsp-team-roles-block',
  imports: [VspBlock, VspBadge, VspAvatar, VspSelect, VspDropdownMenu, VspIcon],
  template: `<vsp-block
    title="Team & roles"
    desc="Manage members and permissions with inline role selects."
  >
    <div
      style="display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-bottom: 1px solid var(--border)"
    >
      <vsp-icon name="users" [size]="17" />
      <b style="font-size: 13.5px">Members</b>
      <vsp-badge tone="muted">{{ members.length }}</vsp-badge>
      <div style="flex: 1"></div>
      <button type="button" class="btn btn-primary btn-sm">
        <vsp-icon name="mail" [size]="15" />Invite
      </button>
    </div>
    <div style="padding: 14px; padding-top: 4px; padding-bottom: 4px">
      @for (m of members; track m.id) {
        <div class="ui-row">
          <vsp-avatar [name]="m.name" [hue]="m.hue" [size]="38" />
          <div style="flex: 1; min-width: 0">
            <div style="font-weight: 600; font-size: 13.5px">{{ m.name }}</div>
            <div class="mono" style="font-size: 11.5px; color: var(--text-faint)">
              {{ m.email }}
            </div>
          </div>
          @if (m.role === 'Owner') {
            <vsp-badge tone="info">Owner</vsp-badge>
          } @else {
            <div style="width: 130px">
              <vsp-select
                [value]="m.role"
                [options]="roleOptions"
                (valueChange)="setRole(m.id, $event)"
              />
            </div>
          }
          <vsp-dropdown-menu [items]="memberMenu">
            <button
              slot="trigger"
              type="button"
              class="vsp-icon-btn"
              style="width: 32px; height: 32px"
              aria-label="Member actions"
            >
              <vsp-icon name="more" [size]="18" />
            </button>
          </vsp-dropdown-menu>
        </div>
      }
    </div>
  </vsp-block>`,
})
export class VspTeamRolesBlock {
  @Input() members: TeamMember[] = DEFAULT_MEMBERS.map((m) => ({ ...m }));
  memberMenu = MEMBER_MENU;
  roleOptions = ['Admin', 'Editor', 'Viewer'];

  setRole(id: number, role: string | number | null): void {
    this.members = this.members.map((y) => (y.id === id ? { ...y, role: String(role) } : y));
  }
}

/* ===================== API keys ===================== */

export interface ApiKey {
  id: number;
  name: string;
  token: string;
  /** Full secret shown when revealed. */
  secret: string;
  created: string;
  last: string;
}
const DEFAULT_KEYS: ApiKey[] = [
  {
    id: 1,
    name: 'Production',
    token: 'vsp_live_8f2a…d91c',
    secret: 'vsp_live_8f2a39c4e7b1d91c',
    created: 'Jan 14, 2026',
    last: '2m ago',
  },
  {
    id: 2,
    name: 'Staging',
    token: 'vsp_test_4b7e…02fa',
    secret: 'vsp_test_4b7e1d9a55c302fa',
    created: 'Mar 02, 2026',
    last: '3d ago',
  },
  {
    id: 3,
    name: 'CI / CD',
    token: 'vsp_live_19cc…7a4b',
    secret: 'vsp_live_19cc8e2f0b6d7a4b',
    created: 'Apr 21, 2026',
    last: '12h ago',
  },
];

/** Reveal, copy, and revoke API credentials; secrets stay masked by default. */
@Component({
  selector: 'vsp-api-keys-block',
  imports: [VspBlock, VspTooltip, VspIcon],
  template: `<vsp-block
    title="API keys"
    desc="Reveal, copy, and revoke credentials. Secrets stay masked by default."
  >
    <div
      style="display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-bottom: 1px solid var(--border)"
    >
      <vsp-icon name="bolt" [size]="17" />
      <b style="font-size: 13.5px">Secret keys</b>
      <div style="flex: 1"></div>
      <button type="button" class="btn btn-primary btn-sm" (click)="created()">
        <vsp-icon name="plus" [size]="15" />Create key
      </button>
    </div>
    <div style="padding: 14px; padding-top: 4px; padding-bottom: 4px">
      @for (k of keys; track k.id) {
        <div class="ui-row">
          <div style="min-width: 96px">
            <div style="font-weight: 600; font-size: 13.5px">{{ k.name }}</div>
            <div class="eyebrow" style="margin-top: 2px">{{ k.created }}</div>
          </div>
          <code
            class="mono"
            style="flex: 1; font-size: 12.5px; color: var(--text-dim); background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 7px 11px; letter-spacing: 0.02em"
            >{{ revealed.has(k.id) ? k.secret : k.token }}</code
          >
          <vsp-tooltip [label]="revealed.has(k.id) ? 'Hide' : 'Reveal'">
            <button
              type="button"
              class="vsp-icon-btn"
              style="width: 34px; height: 34px"
              [attr.aria-label]="revealed.has(k.id) ? 'Hide secret' : 'Reveal secret'"
              (click)="toggleReveal(k.id)"
            >
              <vsp-icon name="eye" [size]="16" />
            </button>
          </vsp-tooltip>
          <vsp-tooltip label="Copy">
            <button
              type="button"
              class="vsp-icon-btn"
              style="width: 34px; height: 34px"
              aria-label="Copy secret"
              (click)="copied()"
            >
              <vsp-icon name="doc" [size]="16" />
            </button>
          </vsp-tooltip>
          <span class="eyebrow" style="width: 66px; text-align: right">{{ k.last }}</span>
          <button type="button" class="btn btn-subtle btn-sm" (click)="revoke(k.id)">Revoke</button>
        </div>
      }
    </div>
  </vsp-block>`,
})
export class VspApiKeysBlock {
  @Input() keys: ApiKey[] = DEFAULT_KEYS.map((k) => ({ ...k }));
  revealed = new Set<number>();

  toggleReveal(id: number): void {
    const n = new Set(this.revealed);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    this.revealed = n;
  }
  created(): void {
    toast({ tone: 'pos', title: 'API key created' });
  }
  copied(): void {
    toast({ title: 'Copied to clipboard' });
  }
  revoke(id: number): void {
    this.keys = this.keys.filter((y) => y.id !== id);
    toast({ tone: 'neg', title: 'Key revoked' });
  }
}
