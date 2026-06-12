import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { VspSelPanel } from './select.component';

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Format a date like "Jan 5, 2026". */
export const fmtDate = (d: Date | null | undefined): string =>
  d ? `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}` : '';

const sameDay = (a: Date | null | undefined, b: Date | null | undefined): boolean =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const stripTime = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

interface GridDay {
  dt: Date;
  muted?: boolean;
}

function monthGrid(year: number, month: number): GridDay[] {
  const first = new Date(year, month, 1);
  const days: GridDay[] = [];
  for (let i = first.getDay(); i > 0; i--)
    days.push({ dt: new Date(year, month, 1 - i), muted: true });
  const dim = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= dim; d++) days.push({ dt: new Date(year, month, d) });
  while (days.length < 42) {
    const last = days[days.length - 1].dt;
    const nd = new Date(last);
    nd.setDate(nd.getDate() + 1);
    days.push({ dt: nd, muted: true });
  }
  return days;
}

export interface MonthView {
  m: number;
  y: number;
}
export type RangeEdge = 'start' | 'end' | false;
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/* ---------------- Calendar (month grid) ---------------- */

@Component({
  selector: 'vsp-calendar',
  template: `<div class="ui-cal">
    <div class="ui-cal-head">
      <button type="button" class="ui-cal-nav" aria-label="Previous month" (click)="nav(-1)">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <span class="ttl">{{ months[view.m] }} {{ view.y }}</span>
      <button type="button" class="ui-cal-nav" aria-label="Next month" (click)="nav(1)">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
    <div class="ui-cal-grid">
      @for (d of dow; track d) {
        <div class="ui-cal-dow">{{ d }}</div>
      }
      @for (g of days; track i; let i = $index) {
        <button type="button" [class]="dayClass(g.dt, g.muted)" (click)="pick.emit(strip(g.dt))">
          {{ g.dt.getDate() }}
        </button>
      }
    </div>
  </div>`,
})
export class VspCalendar {
  @Input() view: MonthView = { m: 0, y: 0 };
  @Output() viewChange = new EventEmitter<MonthView>();
  @Input() isSelected: (d: Date) => boolean = () => false;
  @Input() isInRange?: (d: Date) => boolean;
  @Input() isRangeEnd?: (d: Date) => RangeEdge;
  @Output() pick = new EventEmitter<Date>();

  dow = DOW;
  months = MONTHS;
  today = stripTime(new Date());
  strip = stripTime;

  get days(): GridDay[] {
    return monthGrid(this.view.y, this.view.m);
  }

  nav(delta: number): void {
    let m = this.view.m + delta;
    let y = this.view.y;
    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }
    this.viewChange.emit({ m, y });
  }

  dayClass(dt: Date, muted?: boolean): string {
    const sel = this.isSelected(dt);
    const range = this.isInRange?.(dt);
    const rEdge = this.isRangeEnd?.(dt);
    return [
      'ui-cal-day',
      muted && 'muted',
      sameDay(dt, this.today) && 'today',
      sel && 'sel',
      range && !sel && 'inrange',
      rEdge === 'start' && 'rstart',
      rEdge === 'end' && 'rend',
    ]
      .filter(Boolean)
      .join(' ');
  }
}

/* ---------------- DatePicker ---------------- */

@Component({
  selector: 'vsp-date-picker',
  imports: [VspSelPanel, VspCalendar],
  template: `
    <button
      #anchor
      type="button"
      [class]="'ui-trigger' + (open ? ' open' : '')"
      (click)="open = !open"
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="color: var(--text-faint); flex-shrink: 0"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      <span [class]="'val' + (value ? '' : ' ph')">{{ value ? fmt(value) : placeholder }}</span>
      <svg
        class="chev"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
    <vsp-sel-panel
      [open]="open"
      [anchor]="anchor"
      [auto]="true"
      menuClass="ui-menu"
      (close)="open = false"
    >
      @if (open) {
        <vsp-calendar
          [view]="view"
          (viewChange)="view = $event"
          [isSelected]="isSelectedFn"
          (pick)="choose($event)"
        />
      }
    </vsp-sel-panel>
  `,
})
export class VspDatePicker implements OnChanges {
  @Input() value: Date | null = null;
  @Output() valueChange = new EventEmitter<Date>();
  @Input() placeholder = 'Pick a date';

  open = false;
  view: MonthView;
  fmt = fmtDate;

  constructor() {
    const base = this.value ?? new Date();
    this.view = { m: base.getMonth(), y: base.getFullYear() };
  }

  ngOnChanges(c: SimpleChanges): void {
    if ((c['value'] || c['open']) && this.value) {
      this.view = { m: this.value.getMonth(), y: this.value.getFullYear() };
    }
  }

  isSelectedFn = (d: Date): boolean => sameDay(d, this.value);
  choose(d: Date): void {
    this.value = d;
    this.valueChange.emit(d);
    this.open = false;
  }
}

/* ---------------- DateRangePicker ---------------- */

@Component({
  selector: 'vsp-date-range-picker',
  imports: [VspSelPanel, VspCalendar],
  template: `
    <button
      #anchor
      type="button"
      [class]="'ui-trigger' + (open ? ' open' : '')"
      (click)="open = !open"
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="color: var(--text-faint); flex-shrink: 0"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      <span [class]="'val' + (value.start ? '' : ' ph')">{{ label }}</span>
      <svg
        class="chev"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
    <vsp-sel-panel
      [open]="open"
      [anchor]="anchor"
      [auto]="true"
      menuClass="ui-menu"
      (close)="open = false"
    >
      @if (open) {
        <vsp-calendar
          [view]="view"
          (viewChange)="view = $event"
          [isSelected]="isSelectedFn"
          [isInRange]="isInRangeFn"
          [isRangeEnd]="isRangeEndFn"
          (pick)="pick($event)"
        />
        <div class="ui-combo-foot">
          <span class="mono" style="font-size: 11px; color: var(--text-faint)">
            {{ footLabel }}
          </span>
          <div style="flex: 1"></div>
          <button
            type="button"
            class="btn btn-subtle btn-sm"
            (click)="set({ start: null, end: null })"
          >
            Clear
          </button>
          <button type="button" class="btn btn-primary btn-sm" (click)="open = false">Done</button>
        </div>
      }
    </vsp-sel-panel>
  `,
})
export class VspDateRangePicker {
  @Input() value: DateRange = { start: null, end: null };
  @Output() valueChange = new EventEmitter<DateRange>();
  @Input() placeholder = 'Pick a range';

  open = false;
  view: MonthView;

  constructor() {
    const base = this.value.start ?? new Date();
    this.view = { m: base.getMonth(), y: base.getFullYear() };
  }

  set(r: DateRange): void {
    this.value = r;
    this.valueChange.emit(r);
  }
  pick(d: Date): void {
    const v = this.value;
    if (!v.start || v.end) this.set({ start: d, end: null });
    else if (d < v.start) this.set({ start: d, end: v.start });
    else this.set({ start: v.start, end: d });
  }
  isSelectedFn = (d: Date): boolean => sameDay(d, this.value.start) || sameDay(d, this.value.end);
  isInRangeFn = (d: Date): boolean =>
    !!this.value.start && !!this.value.end && d > this.value.start && d < this.value.end;
  isRangeEndFn = (d: Date): RangeEdge => {
    if (sameDay(d, this.value.start) && this.value.end) return 'start';
    if (sameDay(d, this.value.end)) return 'end';
    return false;
  };

  get label(): string {
    const v = this.value;
    return v.start
      ? v.end
        ? `${fmtDate(v.start)} – ${fmtDate(v.end)}`
        : `${fmtDate(v.start)} – …`
      : this.placeholder;
  }
  get footLabel(): string {
    const v = this.value;
    return v.start && v.end
      ? `${Math.round((v.end.getTime() - v.start.getTime()) / 86400000) + 1} days`
      : 'Select start & end';
  }
}
