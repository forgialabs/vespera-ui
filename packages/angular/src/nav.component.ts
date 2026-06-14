import { Component, EventEmitter, Input, Output } from '@angular/core';

export type TabItem = string | { value: string; label: string; count?: number; disabled?: boolean };

@Component({
  selector: 'vsp-tabs',
  template: `<div class="ui-tabs" style="align-items: center">
    @for (t of tabs; track id(t)) {
      <button type="button" [class]="cls(t)" [disabled]="dis(t)" (click)="pick(id(t))">
        {{ lbl(t) }}
        @if (cnt(t) != null) {
          <span class="badge badge-muted" style="margin-left: 7px">{{ cnt(t) }}</span>
        }
      </button>
    }
    <div style="flex: 1"></div>
    <ng-content select="[slot=right]" />
  </div>`,
})
export class VspTabs {
  @Input() tabs: TabItem[] = [];
  @Input() value?: string;
  @Output() valueChange = new EventEmitter<string>();
  id(t: TabItem): string {
    return typeof t === 'string' ? t : t.value;
  }
  lbl(t: TabItem): string {
    return typeof t === 'string' ? t : t.label;
  }
  cnt(t: TabItem): number | undefined {
    return typeof t === 'object' ? t.count : undefined;
  }
  dis(t: TabItem): boolean | undefined {
    return typeof t === 'object' ? t.disabled : undefined;
  }
  cls(t: TabItem): string {
    return 'ui-tab' + (this.value === this.id(t) ? ' on' : '');
  }
  pick(v: string): void {
    this.value = v;
    this.valueChange.emit(v);
  }
}

@Component({
  selector: 'vsp-breadcrumb',
  template: `<nav style="display: flex; align-items: center; gap: 7px; font-size: 12.5px">
    @for (it of items; track $index; let i = $index, last = $last) {
      @if (i > 0) {
        <svg
          viewBox="0 0 24 24"
          width="13"
          height="13"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="color: var(--text-faint)"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      }
      <span
        [style.color]="last ? 'var(--text)' : 'var(--text-dim)'"
        [style.fontWeight]="last ? 600 : 500"
        >{{ it }}</span
      >
    }
  </nav>`,
})
export class VspBreadcrumb {
  @Input() items: string[] = [];
}

interface PageItem {
  gap: boolean;
  n: number;
}

@Component({
  selector: 'vsp-pagination',
  template: `<div style="display: flex; gap: 4px; align-items: center">
    <button
      type="button"
      class="btn btn-ghost btn-sm"
      [disabled]="page === 0"
      aria-label="Previous page"
      (click)="go(page - 1)"
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
    @for (item of nums; track $index) {
      @if (item.gap) {
        <span class="mono" style="padding: 0 6px; color: var(--text-faint)">…</span>
      } @else {
        <button
          type="button"
          [class]="numCls(item.n)"
          style="min-width: 32px; padding: 0"
          (click)="go(item.n)"
        >
          {{ item.n + 1 }}
        </button>
      }
    }
    <button
      type="button"
      class="btn btn-ghost btn-sm"
      [disabled]="page >= pages - 1"
      aria-label="Next page"
      (click)="go(page + 1)"
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  </div>`,
})
export class VspPagination {
  @Input() page = 0;
  @Output() pageChange = new EventEmitter<number>();
  @Input() pages = 1;
  get nums(): PageItem[] {
    const r: PageItem[] = [];
    for (let i = 0; i < this.pages; i++) {
      if (i === 0 || i === this.pages - 1 || Math.abs(i - this.page) <= 1)
        r.push({ gap: false, n: i });
      else if (!r[r.length - 1]?.gap) r.push({ gap: true, n: -1 });
    }
    return r;
  }
  numCls(n: number): string {
    return 'btn btn-sm ' + (n === this.page ? 'btn-primary' : 'btn-subtle');
  }
  go(p: number): void {
    this.page = p;
    this.pageChange.emit(p);
  }
}

@Component({
  selector: 'vsp-stepper',
  template: `<div class="ui-steps">
    @for (s of steps; track $index; let i = $index) {
      @if (i > 0) {
        <div [class]="barCls(i)"></div>
      }
      <div [class]="stepCls(i)">
        <span class="ui-step-dot">
          @if (i < current) {
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          } @else {
            {{ i + 1 }}
          }
        </span>
        <span class="ui-step-label">{{ s }}</span>
      </div>
    }
  </div>`,
})
export class VspStepper {
  @Input() steps: string[] = [];
  @Input() current = 0;
  barCls(i: number): string {
    return 'ui-step-bar' + (i <= this.current ? ' done' : '');
  }
  stepCls(i: number): string {
    return 'ui-step ' + (i < this.current ? 'done' : i === this.current ? 'active' : 'pending');
  }
}
