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

const BAR_PALETTE = [
  'var(--accent)',
  'var(--accent-2)',
  'var(--success)',
  'var(--warning)',
  'var(--danger)',
];

@Component({
  selector: 'vsp-bar-chart',
  template: `<div style="position: relative">
    <svg [attr.width]="width" [attr.height]="height" style="display: block">
      @for (g of gridEls; track $index) {
        <line
          [attr.x1]="g.x1"
          [attr.x2]="g.x2"
          [attr.y1]="g.y1"
          [attr.y2]="g.y2"
          stroke="var(--grid-line)"
        />
        <text
          [attr.x]="g.tx"
          [attr.y]="g.ty"
          [attr.text-anchor]="g.anchor"
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
          [attr.fill]="hover === b.i ? b.fill : dim(b.fill)"
          style="transition: fill 0.15s"
        />
      }
      @for (cat of cats; track $index) {
        <g (mouseenter)="hover = cat.i" (mouseleave)="hover = null">
          <rect
            [attr.x]="cat.hx"
            [attr.y]="cat.hy"
            [attr.width]="cat.hw"
            [attr.height]="cat.hh"
            fill="transparent"
          />
          @if (cat.label != null) {
            <text
              [attr.x]="cat.lx"
              [attr.y]="cat.ly"
              [attr.text-anchor]="cat.anchor"
              font-size="10"
              fill="var(--text-faint)"
              font-family="var(--font-mono)"
            >
              {{ cat.label }}
            </text>
          }
        </g>
      }
    </svg>
    @if (hover != null) {
      <div
        class="ui-chart-tip"
        [style.left.px]="tipLeft"
        [style.top.px]="tipTop"
        style="position: absolute; transform: translate(-50%, -100%); pointer-events: none"
      >
        @if (labels && labels[hover] != null) {
          <div class="ui-chart-tip-label">{{ labels[hover] }}</div>
        }
        @for (row of tipRows; track $index) {
          <div class="ui-chart-tip-row">
            <i [style.background]="row.color"></i>
            @if (row.label) {
              <span>{{ row.label }}</span>
            }
            <b>{{ row.value }}</b>
          </div>
        }
      </div>
    }
    @if (showLegend) {
      <div class="ui-chart-legend">
        @for (l of legendItems; track $index) {
          <span><i [style.background]="l.color"></i>{{ l.label }}</span>
        }
      </div>
    }
  </div>`,
})
export class VspBarChart {
  @Input() data: number[] | number[][] = [];
  @Input() labels?: string[];
  @Input() width = 620;
  @Input() height = 240;
  @Input() color?: string;
  @Input() colors?: string[];
  @Input() seriesLabels?: string[];
  @Input() horizontal = false;
  @Input() stacked = false;
  @Input() valueFormat?: (n: number) => string;
  @Input() showValues = false;
  hover: number | null = null;
  padB = 26;
  padT = 10;
  padR = 10;

  get series(): number[][] {
    return Array.isArray(this.data[0]) ? (this.data as number[][]) : [this.data as number[]];
  }
  get nSeries(): number {
    return this.series.length;
  }
  get nCats(): number {
    return this.series.reduce((m, s) => Math.max(m, s.length), 0);
  }
  get padL(): number {
    return this.horizontal ? 60 : 34;
  }
  colorAt(s: number): string {
    return (
      this.colors?.[s] ??
      (s === 0 && this.color ? this.color : BAR_PALETTE[s % BAR_PALETTE.length]!)
    );
  }
  fmt(n: number): string {
    return this.valueFormat ? this.valueFormat(n) : niceNum(n);
  }
  dim(c: string): string {
    return `color-mix(in oklab, ${c} 80%, transparent)`;
  }
  get max(): number {
    const m = this.stacked
      ? Math.max(
          ...Array.from({ length: this.nCats }, (_, i) =>
            this.series.reduce((s, a) => s + (a[i] ?? 0), 0),
          ),
          0,
        )
      : Math.max(...this.series.flat(), 0);
    return (m || 1) * 1.15;
  }
  get valAxis(): number {
    return this.horizontal
      ? Math.max(10, this.width - this.padL - this.padR)
      : this.height - this.padB - this.padT;
  }
  get catAxis(): number {
    return this.horizontal
      ? this.height - this.padT - this.padB
      : Math.max(10, this.width - this.padL - this.padR);
  }
  get band(): number {
    return this.catAxis / this.nCats;
  }
  private rect(cs: number, thick: number, vStart: number, vLen: number) {
    if (this.horizontal)
      return {
        x: this.padL + (vStart / this.max) * this.valAxis,
        y: this.padT + cs,
        w: (vLen / this.max) * this.valAxis,
        h: thick,
      };
    return {
      x: this.padL + cs,
      y: this.padT + this.valAxis - ((vStart + vLen) / this.max) * this.valAxis,
      w: thick,
      h: (vLen / this.max) * this.valAxis,
    };
  }
  get bars(): { x: number; y: number; w: number; h: number; fill: string; i: number }[] {
    const out: { x: number; y: number; w: number; h: number; fill: string; i: number }[] = [];
    const band = this.band;
    for (let i = 0; i < this.nCats; i++) {
      if (this.stacked) {
        let acc = 0;
        this.series.forEach((arr, s) => {
          const v = arr[i] ?? 0;
          const r = this.rect(i * band + band * 0.18, band * 0.64, acc, v);
          out.push({
            x: r.x,
            y: r.y,
            w: Math.max(0, r.w),
            h: Math.max(0, r.h),
            fill: this.colorAt(s),
            i,
          });
          acc += v;
        });
      } else {
        const sub = (band * 0.64) / this.nSeries;
        this.series.forEach((arr, s) => {
          const v = arr[i] ?? 0;
          const r = this.rect(i * band + band * 0.18 + s * sub, sub * 0.86, 0, v);
          out.push({
            x: r.x,
            y: r.y,
            w: Math.max(0, r.w),
            h: Math.max(0, r.h),
            fill: this.colorAt(s),
            i,
          });
        });
      }
    }
    return out;
  }
  get gridEls(): {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    tx: number;
    ty: number;
    anchor: string;
    label: string;
  }[] {
    return [0, 0.25, 0.5, 0.75, 1].map((f) => {
      const p = this.horizontal
        ? this.padL + f * this.valAxis
        : this.padT + this.valAxis - f * this.valAxis;
      return {
        x1: this.horizontal ? p : this.padL,
        x2: this.horizontal ? p : this.padL + this.catAxis,
        y1: this.horizontal ? this.padT : p,
        y2: this.horizontal ? this.padT + this.catAxis : p,
        tx: this.horizontal ? p : this.padL - 8,
        ty: this.horizontal ? this.height - 8 : p + 3.5,
        anchor: this.horizontal ? 'middle' : 'end',
        label: this.fmt(Math.round(this.max * f)),
      };
    });
  }
  get cats(): {
    i: number;
    hx: number;
    hy: number;
    hw: number;
    hh: number;
    label: string | undefined;
    lx: number;
    ly: number;
    anchor: string;
  }[] {
    const band = this.band;
    return Array.from({ length: this.nCats }, (_, i) => {
      const center = i * band + band / 2;
      return {
        i,
        hx: this.horizontal ? this.padL : this.padL + i * band,
        hy: this.horizontal ? this.padT + i * band : this.padT,
        hw: this.horizontal ? this.valAxis : band,
        hh: this.horizontal ? band : this.valAxis,
        label: this.labels?.[i],
        lx: this.horizontal ? this.padL - 8 : this.padL + center,
        ly: this.horizontal ? this.padT + center + 3.5 : this.height - 8,
        anchor: this.horizontal ? 'end' : 'middle',
      };
    });
  }
  get tipLeft(): number {
    const band = this.band;
    return this.horizontal ? this.padL + 8 : this.padL + (this.hover ?? 0) * band + band / 2;
  }
  get tipTop(): number {
    const band = this.band;
    return this.horizontal ? this.padT + (this.hover ?? 0) * band + band / 2 : this.padT + 4;
  }
  get tipRows(): { color: string; label?: string; value: string }[] {
    const i = this.hover ?? 0;
    return this.series.map((arr, s) => ({
      color: this.colorAt(s),
      label: this.seriesLabels?.[s],
      value: this.fmt(arr[i] ?? 0),
    }));
  }
  get showLegend(): boolean {
    return this.nSeries > 1 && !!this.seriesLabels;
  }
  get legendItems(): { color: string; label: string }[] {
    return (this.seriesLabels ?? []).map((label, s) => ({ color: this.colorAt(s), label }));
  }
}
