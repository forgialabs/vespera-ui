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
function niceNum(n: number): string {
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'k';
  return String(n);
}
let acUid = 0;

@Component({
  selector: 'vsp-area-chart',
  template: `<svg [attr.width]="width" [attr.height]="height" style="display: block">
    <defs>
      <linearGradient [id]="gid" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" [attr.stop-color]="color" stop-opacity="0.22" />
        <stop offset="1" [attr.stop-color]="color" stop-opacity="0" />
      </linearGradient>
    </defs>
    @for (t of ticks; track $index) {
      <line
        [attr.x1]="padL"
        [attr.x2]="width - padR"
        [attr.y1]="t.y"
        [attr.y2]="t.y"
        stroke="var(--grid-line)"
        stroke-width="1"
      />
      <text
        [attr.x]="padL - 8"
        [attr.y]="t.y + 3.5"
        text-anchor="end"
        font-size="10"
        fill="var(--text-faint)"
        font-family="var(--font-mono)"
      >
        {{ t.label }}
      </text>
    }
    @if (labels) {
      @for (lb of labels; track $index; let i = $index) {
        @if (showLabel(i)) {
          <text
            [attr.x]="sx(i, labels.length)"
            [attr.y]="height - 8"
            text-anchor="middle"
            font-size="10"
            fill="var(--text-faint)"
            font-family="var(--font-mono)"
          >
            {{ lb }}
          </text>
        }
      }
    }
    @for (ln of lineEls; track $index) {
      @if (ln.area) {
        <path [attr.d]="ln.area" [attr.fill]="'url(#' + gid + ')'" />
      }
      <path
        [attr.d]="ln.d"
        fill="none"
        [attr.stroke]="ln.stroke"
        stroke-width="2.4"
        stroke-linecap="round"
        [attr.stroke-dasharray]="ln.dash"
        [style.opacity]="ln.opacity"
      />
    }
  </svg>`,
})
export class VspAreaChart {
  @Input() series: number[][] = [];
  @Input() labels?: string[];
  @Input() width = 760;
  @Input() height = 260;
  @Input() color = 'var(--accent)';
  @Input() color2 = 'var(--accent-2)';
  @Input() dual = false;
  gid = 'ac' + ++acUid;
  padL = 38;
  padB = 26;
  padT = 12;
  padR = 8;
  get innerW(): number {
    return Math.max(10, this.width - this.padL - this.padR);
  }
  get innerH(): number {
    return this.height - this.padB - this.padT;
  }
  get s0(): number[] {
    return this.series[0] ?? [];
  }
  get s1(): number[] | undefined {
    return this.series[1];
  }
  get max(): number {
    return Math.max(...(this.dual && this.s1 ? [...this.s0, ...this.s1] : this.s0), 0) * 1.12;
  }
  get rng(): number {
    return this.max || 1;
  }
  sx(i: number, len: number): number {
    return this.padL + (i / Math.max(1, len - 1)) * this.innerW;
  }
  sy(v: number): number {
    return this.padT + this.innerH - (v / this.rng) * this.innerH;
  }
  showLabel(i: number): boolean {
    return !!this.labels && i % Math.ceil(this.labels.length / 7) === 0;
  }
  get ticks(): { y: number; label: string }[] {
    return Array.from({ length: 5 }, (_, i) => ({
      y: this.sy((this.max / 4) * i),
      label: niceNum(Math.round((this.max / 4) * i)),
    }));
  }
  get lineEls(): {
    d: string;
    area: string | null;
    stroke: string;
    dash: string | null;
    opacity: number;
  }[] {
    const sets = this.dual && this.s1 ? [this.s0, this.s1] : [this.s0];
    return sets.map((arr, li) => {
      const pts: Pt[] = arr.map((v, i) => [this.sx(i, arr.length), this.sy(v)]);
      const last = pts[pts.length - 1];
      const first = pts[0];
      return {
        d: smoothPath(pts),
        area:
          li === 0 && first && last
            ? `${smoothPath(pts)} L ${last[0]} ${this.padT + this.innerH} L ${first[0]} ${this.padT + this.innerH} Z`
            : null,
        stroke: li === 0 ? this.color : this.color2,
        dash: li === 1 ? '5 5' : null,
        opacity: li === 1 ? 0.7 : 1,
      };
    });
  }
}

@Component({
  selector: 'vsp-bar-chart',
  template: `<svg [attr.width]="width" [attr.height]="height" style="display: block">
    @for (g of grid; track $index) {
      <line
        [attr.x1]="padL"
        [attr.x2]="width - 8"
        [attr.y1]="g.y"
        [attr.y2]="g.y"
        stroke="var(--grid-line)"
      />
      <text
        [attr.x]="padL - 8"
        [attr.y]="g.y + 3.5"
        text-anchor="end"
        font-size="10"
        fill="var(--text-faint)"
        font-family="var(--font-mono)"
      >
        {{ g.label }}
      </text>
    }
    @for (b of bars; track $index) {
      <rect
        [attr.x]="b.x"
        [attr.y]="b.y"
        [attr.width]="b.w"
        [attr.height]="b.h"
        rx="4"
        [attr.fill]="barFill"
      />
      @if (b.label != null) {
        <text
          [attr.x]="b.x + b.w / 2"
          [attr.y]="height - 8"
          text-anchor="middle"
          font-size="10"
          fill="var(--text-faint)"
          font-family="var(--font-mono)"
        >
          {{ b.label }}
        </text>
      }
    }
  </svg>`,
})
export class VspBarChart {
  @Input() data: number[] = [];
  @Input() labels?: string[];
  @Input() width = 620;
  @Input() height = 240;
  @Input() color = 'var(--accent)';
  padL = 34;
  padB = 26;
  padT = 10;
  get innerW(): number {
    return Math.max(10, this.width - this.padL - 8);
  }
  get innerH(): number {
    return this.height - this.padB - this.padT;
  }
  get max(): number {
    return Math.max(...this.data, 0) * 1.15 || 1;
  }
  get bw(): number {
    return this.innerW / (this.data.length || 1);
  }
  get barFill(): string {
    return `color-mix(in oklab, ${this.color} 78%, transparent)`;
  }
  get grid(): { y: number; label: string }[] {
    return [0, 0.5, 1].map((f) => ({
      y: this.padT + this.innerH - f * this.innerH,
      label: niceNum(Math.round(this.max * f)),
    }));
  }
  get bars(): { x: number; y: number; w: number; h: number; label: string | undefined }[] {
    return this.data.map((v, i) => {
      const bh = (v / this.max) * this.innerH;
      const x = this.padL + i * this.bw + this.bw * 0.18;
      const bwi = this.bw * 0.64;
      return { x, y: this.padT + this.innerH - bh, w: bwi, h: bh, label: this.labels?.[i] };
    });
  }
}
