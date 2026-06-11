import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type BannerTone = 'info' | 'warn' | 'accent';
const BANNER_ICON: Record<BannerTone, string> = {
  info: 'M12 3l1.6 5L19 9.6l-5 1.6L12 16l-1.6-4.8L5 9.6l5.4-1.6z',
  warn: 'M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9',
  accent: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
};

@Component({
  selector: 'vsp-banner',
  template: `<div [class]="cls">
    <span #ic style="display: contents"><ng-content select="[slot=icon]" /></span>
    @if (!ic.childElementCount) {
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path [attr.d]="iconPath" />
      </svg>
    }
    <div style="flex: 1; font-size: 13px; font-weight: 500"><ng-content /></div>
    <ng-content select="[slot=action]" />
    @if (dismissible) {
      <button type="button" class="ui-banner-x" aria-label="Dismiss" (click)="dismiss.emit()">
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    }
  </div>`,
})
export class VspBanner {
  @Input() tone: BannerTone = 'info';
  @Input() dismissible = false;
  @Output() dismiss = new EventEmitter<void>();
  get cls(): string {
    return 'ui-banner ' + this.tone;
  }
  get iconPath(): string {
    return BANNER_ICON[this.tone];
  }
}

@Component({
  selector: 'vsp-empty-state',
  template: `<div
    style="display: grid; place-items: center; text-align: center"
    [style.padding]="compact ? '32px 20px' : '56px 24px'"
  >
    <div style="max-width: 340px">
      <span
        style="width: 56px; height: 56px; border-radius: 16px; display: grid; place-items: center; margin: 0 auto 18px; background: color-mix(in oklab, var(--accent) 12%, transparent); color: var(--accent); border: 1px solid color-mix(in oklab, var(--accent) 22%, transparent)"
      >
        <span #ic style="display: contents"><ng-content select="[slot=icon]" /></span>
        @if (!ic.childElementCount) {
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"
            />
          </svg>
        }
      </span>
      <div style="font-size: 17px; font-weight: 700">{{ title }}</div>
      @if (desc) {
        <p style="margin: 7px 0 0; color: var(--text-dim); font-size: 13.5px; line-height: 1.6">
          {{ desc }}
        </p>
      }
      <div
        #ac
        [style.display]="ac.childElementCount ? 'flex' : 'none'"
        style="margin-top: 20px; gap: 8px; justify-content: center"
      >
        <ng-content select="[slot=action]" />
      </div>
    </div>
  </div>`,
})
export class VspEmptyState {
  @Input() title?: string;
  @Input() desc?: string;
  @Input() compact = false;
}

export interface AccordionItem {
  title: string;
  body: string;
}

@Component({
  selector: 'vsp-accordion',
  template: `<div class="ui-acc">
    @for (it of items; track $index; let i = $index) {
      <div [class]="itemCls(i)">
        <button type="button" class="ui-acc-head" (click)="toggle(i)">
          {{ it.title }}
          <svg
            class="chev"
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        <div class="ui-acc-bodywrap">
          <div>
            <div class="ui-acc-body">{{ it.body }}</div>
          </div>
        </div>
      </div>
    }
  </div>`,
})
export class VspAccordion implements OnInit {
  @Input() items: AccordionItem[] = [];
  @Input() multiple = false;
  @Input() defaultOpen: number[] = [];
  private open = new Set<number>();
  ngOnInit(): void {
    this.open = new Set(this.defaultOpen);
  }
  toggle(i: number): void {
    const n = new Set<number>(this.multiple ? this.open : []);
    if (this.open.has(i)) n.delete(i);
    else n.add(i);
    this.open = n;
  }
  itemCls(i: number): string {
    return 'ui-acc-item' + (this.open.has(i) ? ' open' : '');
  }
}
