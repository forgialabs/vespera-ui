import { Component, Input } from '@angular/core';

@Component({
  selector: 'vsp-circular-progress',
  template: `<div style="position: relative" [style.width.px]="size" [style.height.px]="size">
    <svg [attr.width]="size" [attr.height]="size" style="transform: rotate(-90deg)">
      <circle
        [attr.cx]="size / 2"
        [attr.cy]="size / 2"
        [attr.r]="r"
        fill="none"
        stroke="var(--surface-3)"
        [attr.stroke-width]="thickness"
      />
      <circle
        [attr.cx]="size / 2"
        [attr.cy]="size / 2"
        [attr.r]="r"
        fill="none"
        [attr.stroke]="color"
        [attr.stroke-width]="thickness"
        stroke-linecap="round"
        [attr.stroke-dasharray]="circ"
        [attr.stroke-dashoffset]="offset"
        style="transition: stroke-dashoffset 0.5s cubic-bezier(0.3, 0.7, 0.3, 1)"
      />
    </svg>
    <div
      class="tnum"
      [style.fontSize.px]="size * 0.24"
      style="position: absolute; inset: 0; display: grid; place-items: center; font-weight: 800"
    >
      {{ display }}
    </div>
  </div>`,
})
export class VspCircularProgress {
  @Input() value = 0;
  @Input() size = 76;
  @Input() thickness = 7;
  @Input() color = 'var(--accent)';
  @Input() label?: string;
  get r(): number {
    return (this.size - this.thickness) / 2;
  }
  get circ(): number {
    return 2 * Math.PI * this.r;
  }
  get offset(): number {
    return this.circ * (1 - Math.min(100, this.value) / 100);
  }
  get display(): string {
    return this.label ?? `${Math.round(this.value)}%`;
  }
}

@Component({
  selector: 'vsp-stat',
  template: `<div class="card card-pad" style="display: flex; align-items: center; gap: 13px">
    <span
      #ic
      [style.display]="ic.childElementCount ? '' : 'none'"
      [style.background]="'color-mix(in oklab, ' + tone + ' 14%, transparent)'"
      [style.color]="tone"
      style="width: 38px; height: 38px; border-radius: var(--r-sm); flex-shrink: 0; display: grid; place-items: center"
    >
      <ng-content select="[slot=icon]" />
    </span>
    <div style="min-width: 0">
      <div class="eyebrow">{{ label }}</div>
      <div style="display: flex; align-items: baseline; gap: 8px; margin-top: 3px">
        <span class="tnum" style="font-size: 22px; font-weight: 800; letter-spacing: -0.02em">{{
          value
        }}</span>
        @if (delta != null) {
          <span [class]="deltaCls" style="padding: 1px 6px">
            <svg
              viewBox="0 0 24 24"
              width="10"
              height="10"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path [attr.d]="arrow" />
            </svg>
            {{ delta }}
          </span>
        }
      </div>
    </div>
  </div>`,
})
export class VspStat {
  @Input() label?: string;
  @Input() value?: string;
  @Input() delta?: string;
  @Input() deltaDir: 'up' | 'down' = 'up';
  @Input() tone = 'var(--accent)';
  get deltaCls(): string {
    return 'badge ' + (this.deltaDir === 'up' ? 'badge-pos' : 'badge-neg');
  }
  get arrow(): string {
    return this.deltaDir === 'up' ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7';
  }
}

export type TimelineTone = 'pos' | 'neg' | 'warn' | 'info';
export interface TimelineItem {
  title: string;
  time?: string;
  body?: string;
  tone?: TimelineTone;
  active?: boolean;
}
const TL_TONE: Record<TimelineTone, string> = {
  pos: 'var(--success)',
  neg: 'var(--danger)',
  warn: 'var(--warning)',
  info: 'var(--accent)',
};

@Component({
  selector: 'vsp-timeline',
  template: `<div class="ui-tl">
    @for (it of items; track $index) {
      <div [class]="it.active ? 'ui-tl-item active' : 'ui-tl-item'">
        <span class="ui-tl-dot" [style]="dotStyle(it.tone)">
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
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </span>
        <div class="ui-tl-body">
          <div style="display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap">
            <span style="font-weight: 600; font-size: 13.5px">{{ it.title }}</span>
            @if (it.time) {
              <span class="eyebrow" style="margin-left: auto">{{ it.time }}</span>
            }
          </div>
          @if (it.body) {
            <div style="font-size: 12.5px; color: var(--text-dim); margin-top: 3px">
              {{ it.body }}
            </div>
          }
        </div>
      </div>
    }
  </div>`,
})
export class VspTimeline {
  @Input() items: TimelineItem[] = [];
  dotStyle(tone?: TimelineTone): string {
    if (!tone) return '';
    const c = TL_TONE[tone];
    return `background:color-mix(in oklab, ${c} 14%, transparent);color:${c};border-color:color-mix(in oklab, ${c} 30%, transparent)`;
  }
}

@Component({
  selector: 'vsp-description-list',
  template: `<dl class="ui-dl">
    @for (item of items; track $index; let last = $last) {
      <dt [class.last]="last">{{ item[0] }}</dt>
      <dd [class.last]="last">{{ item[1] }}</dd>
    }
  </dl>`,
})
export class VspDescriptionList {
  @Input() items: [string, string][] = [];
}
