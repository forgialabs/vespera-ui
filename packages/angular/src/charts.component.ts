import { Component, Input } from '@angular/core';

type Pt = [number, number];
function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[i + 1]!;
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
  }
  return d;
}

let sparkUid = 0;

@Component({
  selector: 'vsp-sparkline',
  template: `<svg
    [attr.width]="w"
    [attr.height]="h"
    [attr.viewBox]="'0 0 ' + w + ' ' + h"
    style="display: block; overflow: visible"
  >
    @if (fill) {
      <defs>
        <linearGradient [id]="gid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" [attr.stop-color]="color" stop-opacity="0.28" />
          <stop offset="1" [attr.stop-color]="color" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path [attr.d]="areaD" [attr.fill]="'url(#' + gid + ')'" />
    }
    <path [attr.d]="d" fill="none" [attr.stroke]="color" stroke-width="2" stroke-linecap="round" />
    <circle [attr.cx]="last[0]" [attr.cy]="last[1]" r="2.6" [attr.fill]="color" />
  </svg>`,
})
export class VspSparkline {
  @Input() data: number[] = [];
  @Input() color = 'var(--accent)';
  @Input() w = 110;
  @Input() h = 34;
  @Input() fill = true;
  gid = 'spk' + ++sparkUid;
  get pts(): Pt[] {
    const min = Math.min(...this.data);
    const max = Math.max(...this.data);
    const rng = max - min || 1;
    return this.data.map((v, i) => [
      (i / (this.data.length - 1)) * this.w,
      this.h - 3 - ((v - min) / rng) * (this.h - 6),
    ]);
  }
  get d(): string {
    return smoothPath(this.pts);
  }
  get areaD(): string {
    return `${this.d} L ${this.w} ${this.h} L 0 ${this.h} Z`;
  }
  get last(): Pt {
    return this.pts[this.pts.length - 1] ?? [0, 0];
  }
}

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'vsp-donut',
  template: `<div style="display: flex; align-items: center; gap: 22px">
    <svg [attr.width]="size" [attr.height]="size" style="transform: rotate(-90deg); flex-shrink: 0">
      <circle
        [attr.cx]="c"
        [attr.cy]="c"
        [attr.r]="r"
        fill="none"
        stroke="var(--surface-3)"
        [attr.stroke-width]="thickness"
      />
      @for (s of segs; track $index) {
        <circle
          [attr.cx]="c"
          [attr.cy]="c"
          [attr.r]="r"
          fill="none"
          [attr.stroke]="s.color"
          [attr.stroke-width]="thickness"
          [attr.stroke-dasharray]="s.dash"
          [attr.stroke-dashoffset]="s.offset"
          stroke-linecap="round"
        />
      }
    </svg>
    <div style="display: flex; flex-direction: column; gap: 9px; flex: 1">
      @for (d of data; track $index) {
        <div style="display: flex; align-items: center; gap: 9px; font-size: 12.5px">
          <i
            [style.background]="d.color"
            style="width: 9px; height: 9px; border-radius: 3px; flex-shrink: 0"
          ></i>
          <span style="color: var(--text-dim); flex: 1">{{ d.label }}</span>
          <span class="mono tnum" style="font-weight: 600">{{ pct(d.value) }}%</span>
        </div>
      }
    </div>
  </div>`,
})
export class VspDonut {
  @Input() data: DonutDatum[] = [];
  @Input() size = 168;
  @Input() thickness = 22;
  get total(): number {
    return this.data.reduce((s, d) => s + d.value, 0) || 1;
  }
  get r(): number {
    return (this.size - this.thickness) / 2;
  }
  get c(): number {
    return this.size / 2;
  }
  get circ(): number {
    return 2 * Math.PI * this.r;
  }
  get segs(): { color: string; dash: string; offset: number }[] {
    let acc = 0;
    return this.data.map((d) => {
      const len = (d.value / this.total) * this.circ;
      const seg = { color: d.color, dash: `${len - 2.5} ${this.circ - len + 2.5}`, offset: -acc };
      acc += len;
      return seg;
    });
  }
  pct(v: number): number {
    return Math.round((v / this.total) * 100);
  }
}

@Component({
  selector: 'vsp-stat-card',
  imports: [VspSparkline],
  template: `<div
    class="card card-pad vsp-rise"
    style="display: flex; flex-direction: column; gap: 14px"
  >
    <div style="display: flex; align-items: center; justify-content: space-between">
      <div style="display: flex; align-items: center; gap: 10px">
        <span
          style="width: 34px; height: 34px; border-radius: var(--r-sm); display: grid; place-items: center; background: color-mix(in oklab, var(--accent) 13%, transparent); color: var(--accent)"
        >
          <ng-content select="[slot=icon]" />
        </span>
        <span class="eyebrow">{{ label }}</span>
      </div>
      @if (delta != null) {
        <span [class]="deltaCls">
          <svg
            viewBox="0 0 24 24"
            width="11"
            height="11"
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
    <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 12px">
      <div
        class="tnum"
        style="font-size: 30px; font-weight: 800; letter-spacing: -0.02em; line-height: 1"
      >
        {{ value }}
      </div>
      @if (spark) {
        <vsp-sparkline [data]="spark" [color]="sparkColor" />
      }
    </div>
  </div>`,
})
export class VspStatCard {
  @Input() label?: string;
  @Input() value?: string;
  @Input() delta?: string;
  @Input() deltaDir: 'up' | 'down' = 'up';
  @Input() spark?: number[];
  @Input() sparkColor = 'var(--accent)';
  get deltaCls(): string {
    return 'badge ' + (this.deltaDir === 'up' ? 'badge-pos' : 'badge-neg');
  }
  get arrow(): string {
    return this.deltaDir === 'up' ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7';
  }
}
