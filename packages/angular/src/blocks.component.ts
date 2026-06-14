import { Component, ContentChild, ElementRef, Input } from '@angular/core';
import { VspBadge, type BadgeTone } from './badge.component';
import { VspIcon } from './icon.component';
import { VspBlockSkeleton, VspBlockEmpty } from './block-state.component';

/** A titled section wrapping its content in a Vespera `card`. */
@Component({
  selector: 'vsp-block',
  template: `<div>
    @if (title) {
      <div style="margin-bottom: 12px">
        <div style="font-size: 16px; font-weight: 700; letter-spacing: -0.01em">{{ title }}</div>
        @if (desc) {
          <div style="font-size: 13px; margin-top: 3px; color: var(--text-dim)">{{ desc }}</div>
        }
      </div>
    }
    <div class="card"><ng-content /></div>
  </div>`,
})
export class VspBlock {
  @Input() title?: string;
  @Input() desc?: string;
}

/* ===================== System status ===================== */

export type ServiceStatus = 'operational' | 'degraded' | 'maintenance' | 'down';
export interface Service {
  name: string;
  status: ServiceStatus;
  uptime: number;
}
const STATUS_TONE: Record<ServiceStatus, BadgeTone> = {
  operational: 'pos',
  degraded: 'warn',
  maintenance: 'info',
  down: 'neg',
};
const DEFAULT_SERVICES: Service[] = [
  { name: 'API gateway', status: 'operational', uptime: 99.98 },
  { name: 'Database', status: 'operational', uptime: 99.95 },
  { name: 'Webhooks', status: 'degraded', uptime: 98.2 },
  { name: 'Auth service', status: 'operational', uptime: 100 },
  { name: 'Billing', status: 'maintenance', uptime: 99.8 },
];

/** Live service health with 30-day uptime bars. */
@Component({
  selector: 'vsp-system-status-block',
  imports: [VspBlock, VspBadge, VspBlockSkeleton, VspBlockEmpty],
  template: `<vsp-block title="System status" desc="Live service health with 30-day uptime bars.">
    <div
      style="display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-bottom: 1px solid var(--border)"
    >
      <span
        style="width: 8px; height: 8px; border-radius: 99px"
        [style.background]="accent"
        [style.boxShadow]="'0 0 8px ' + accent"
      ></span>
      <b style="font-size: 13.5px">{{
        allOk ? 'All systems operational' : 'Partial degradation'
      }}</b>
      <div style="flex: 1"></div>
      <span class="eyebrow">Updated 30s ago</span>
    </div>
    @if (loading) {
      <vsp-block-skeleton />
    } @else if (services.length === 0) {
      <ng-content select="[slot=empty]" />
      @if (!emptySlot) {
        <vsp-block-empty title="No services" desc="No monitored services yet." />
      }
    } @else {
      <div style="padding: 14px; padding-top: 4px; padding-bottom: 8px">
        @for (s of services; track s.name) {
          <div class="ui-row" style="align-items: center">
            <div style="width: 150px; flex-shrink: 0">
              <div style="font-weight: 600; font-size: 13.5px">{{ s.name }}</div>
            </div>
            <div style="flex: 1; display: flex; gap: 2px; align-items: flex-end; height: 26px">
              @for (i of bars; track i) {
                <span
                  style="flex: 1; border-radius: 2px"
                  [style.height]="isBad(s, i) ? '60%' : '100%'"
                  [style.background]="barBg(s, i)"
                ></span>
              }
            </div>
            <span
              class="mono tnum"
              style="width: 56px; text-align: right; font-size: 12px; color: var(--text-dim)"
              >{{ s.uptime }}%</span
            >
            <vsp-badge [tone]="tone(s.status)" [dot]="true">{{ s.status }}</vsp-badge>
          </div>
        }
      </div>
    }
  </vsp-block>`,
})
export class VspSystemStatusBlock {
  @Input() services: Service[] = DEFAULT_SERVICES;
  @Input() loading = false;
  @ContentChild('blockEmpty') emptySlot?: ElementRef;
  bars = Array.from({ length: 44 }, (_, i) => i);

  get allOk(): boolean {
    return this.services.every((s) => s.status === 'operational');
  }
  get accent(): string {
    return this.allOk ? 'var(--success)' : 'var(--warning)';
  }
  tone(s: ServiceStatus): BadgeTone {
    return STATUS_TONE[s];
  }
  isBad(s: Service, i: number): boolean {
    return (
      (s.status === 'degraded' && i > 38 && i < 42) || (s.status === 'maintenance' && i === 43)
    );
  }
  barBg(s: Service, i: number): string {
    if (!this.isBad(s, i)) return 'color-mix(in oklab, var(--success) 70%, transparent)';
    return s.status === 'degraded' ? 'var(--warning)' : 'var(--accent)';
  }
}

/* ===================== Audit log ===================== */

export interface AuditEntry {
  who: string;
  action: string;
  tag: string;
  time: string;
  /** Icon name (see `vsp-icon`). */
  icon: string;
}
const DEFAULT_AUDIT: AuditEntry[] = [
  {
    who: 'Avery Quinn',
    action: 'updated billing settings',
    tag: 'Settings',
    time: '2 min ago',
    icon: 'settings',
  },
  {
    who: 'Maya Okafor',
    action: 'upgraded to Enterprise',
    tag: 'Billing',
    time: '38 min ago',
    icon: 'arrowUp',
  },
  {
    who: 'System',
    action: 'rotated production API key',
    tag: 'Security',
    time: '1 hr ago',
    icon: 'shield',
  },
  { who: 'Leo Vega', action: 'invited 4 members', tag: 'Team', time: '3 hr ago', icon: 'users' },
  {
    who: 'Billing',
    action: 'flagged failed payment · Cobalt',
    tag: 'Billing',
    time: '5 hr ago',
    icon: 'bell',
  },
];

/** A chronological trail of privileged actions, as a timeline. */
@Component({
  selector: 'vsp-audit-log-block',
  imports: [VspBlock, VspBadge, VspIcon, VspBlockSkeleton, VspBlockEmpty],
  template: `<vsp-block title="Audit log" desc="A chronological trail of every privileged action.">
    <div
      style="display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-bottom: 1px solid var(--border)"
    >
      <vsp-icon name="clock" [size]="17" />
      <b style="font-size: 13.5px">Recent activity</b>
      <div style="flex: 1"></div>
      <button type="button" class="btn btn-ghost btn-sm">
        <vsp-icon name="download" [size]="15" />
        Export log
      </button>
    </div>
    @if (loading) {
      <vsp-block-skeleton />
    } @else if (entries.length === 0) {
      <ng-content select="[slot=empty]" />
      @if (!emptySlot) {
        <vsp-block-empty title="No activity" desc="Privileged actions will show here." />
      }
    } @else {
      <div style="padding: 14px">
        <div style="position: relative; padding-left: 8px">
          @for (e of entries; track i; let i = $index) {
            <div
              style="display: flex; gap: 14px; position: relative"
              [style.paddingBottom]="i < entries.length - 1 ? '20px' : '0'"
            >
              @if (i < entries.length - 1) {
                <span
                  style="position: absolute; left: 15px; top: 32px; bottom: 0; width: 1.5px; background: var(--border)"
                ></span>
              }
              <span
                style="width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; display: grid; place-items: center; background: var(--surface-3); border: 1px solid var(--border); color: var(--text-dim); z-index: 1"
              >
                <vsp-icon [name]="e.icon" [size]="16" />
              </span>
              <div style="flex: 1; padding-top: 5px">
                <div style="font-size: 13.5px">
                  <b style="font-weight: 700">{{ e.who }}</b>
                  <span style="color: var(--text-dim)"> {{ e.action }}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 5px">
                  <vsp-badge tone="muted">{{ e.tag }}</vsp-badge>
                  <span class="eyebrow">{{ e.time }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    }
  </vsp-block>`,
})
export class VspAuditLogBlock {
  @Input() entries: AuditEntry[] = DEFAULT_AUDIT;
  @Input() loading = false;
  @ContentChild('blockEmpty') emptySlot?: ElementRef;
}
