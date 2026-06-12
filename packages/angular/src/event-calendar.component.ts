import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VspSegmented } from './media.component';
import { VspDialog } from './overlay.component';
import { VspField, VspInput } from './field.component';
import { VspSelect } from './select.component';
import { VspButton } from './button.component';
import { toast } from './toast.component';

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
const DOW_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export type EventTone = 'info' | 'success' | 'warning' | 'danger' | 'violet';

const TONE: Record<EventTone, string> = {
  info: 'var(--accent)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  violet: 'var(--accent-2)',
};

const TONE_OPTIONS = [
  { value: 'info', label: 'Blue' },
  { value: 'success', label: 'Green' },
  { value: 'warning', label: 'Amber' },
  { value: 'danger', label: 'Red' },
  { value: 'violet', label: 'Violet' },
];

export interface CalendarEvent {
  id?: string;
  /** Day of the month (1–31). */
  d: number;
  title: string;
  tone: EventTone;
  /** Display time, e.g. `"10:00"` or `"All day"`. */
  time: string;
  /** Hour (8–18) used to place the event in the week grid. */
  hour?: number;
}
interface InternalEvent extends CalendarEvent {
  id: string;
  hour: number;
}
interface Draft {
  days: number[];
  hour: number;
  title: string;
  tone: EventTone;
  time: string;
}
type View = 'month' | 'week' | 'agenda';
interface Cell {
  day: number;
  muted?: boolean;
}

const DEFAULT_EVENTS: CalendarEvent[] = [
  { d: 2, title: 'Q2 board review', tone: 'info', time: '10:00' },
  { d: 5, title: 'Northwind renewal', tone: 'success', time: '09:30' },
  { d: 5, title: 'Webhook deploy', tone: 'warning', time: '14:00' },
  { d: 9, title: 'Payment retry · Cobalt', tone: 'danger', time: '08:00' },
  { d: 12, title: 'Onboarding · Halcyon', tone: 'violet', time: '11:00' },
  { d: 12, title: 'Team sync', tone: 'info', time: '15:30' },
  { d: 12, title: 'Invoice run', tone: 'success', time: '17:00' },
  { d: 18, title: 'Security audit', tone: 'warning', time: '13:00' },
  { d: 21, title: 'Expansion call · Vertex', tone: 'success', time: '10:30' },
  { d: 24, title: 'Quarterly close', tone: 'info', time: 'All day' },
  { d: 24, title: 'Roadmap review', tone: 'violet', time: '16:00' },
  { d: 28, title: 'SLA report due', tone: 'danger', time: '12:00' },
];

/**
 * A month / week / agenda calendar with click-and-drag day selection and an
 * inline "new event" dialog. Events are kept in local state; `change` reports
 * every change so a host can persist them.
 */
@Component({
  selector: 'vsp-event-calendar',
  imports: [VspSegmented, VspDialog, VspField, VspInput, VspSelect, VspButton],
  template: `<div class="ui-cb">
    <div class="ui-cb-head">
      <div style="display: flex; gap: 4px">
        <button
          type="button"
          class="vsp-icon-btn"
          style="width: 32px; height: 32px"
          aria-label="Previous month"
          (click)="nav(-1)"
        >
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
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          class="vsp-icon-btn"
          style="width: 32px; height: 32px"
          aria-label="Next month"
          (click)="nav(1)"
        >
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
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      <div class="ui-cb-title">{{ months[vm.m] }} {{ vm.y }}</div>
      <button type="button" class="btn btn-ghost btn-sm" (click)="goToday()">Today</button>
      <div style="flex: 1"></div>
      <vsp-segmented
        [value]="cap(view)"
        [options]="['Month', 'Week', 'Agenda']"
        (valueChange)="setView($event)"
      />
      <button type="button" class="btn btn-primary btn-sm" (click)="openAdd([today.getDate()])">
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
          <path d="M12 5v14M5 12h14" />
        </svg>
        Event
      </button>
    </div>

    @if (view === 'month') {
      <div class="ui-cb-grid">
        @for (d of dowFull; track d) {
          <div class="ui-cb-dow">{{ d }}</div>
        }
      </div>
      <div class="ui-cb-grid" (mouseleave)="onLeave()">
        @for (c of cells; track i; let i = $index) {
          <div
            [class]="cellClass(c)"
            [style.borderBottom]="i >= cells.length - 7 ? '0' : null"
            (mousedown)="cellDown(c)"
            (mouseenter)="cellEnter(c)"
            (mouseup)="cellUp(c)"
          >
            <span [class]="'ui-cb-date' + (isToday(c.day, c.muted) ? ' today' : '')">{{
              c.day
            }}</span>
            @for (e of evsFor(c).slice(0, 3); track e.id) {
              <div
                class="ui-cb-event"
                [style.color]="tone(e.tone)"
                [style.background]="bg(e.tone, 14)"
              >
                <i></i>{{ e.title }}
              </div>
            }
            @if (evsFor(c).length > 3) {
              <span class="ui-cb-more">+{{ evsFor(c).length - 3 }} more</span>
            }
          </div>
        }
      </div>
    }

    @if (view === 'week') {
      <div class="ui-cb-week" style="max-height: 420px; overflow-y: auto">
        <div class="ui-cb-wk-corner"></div>
        @for (d of weekDays; track i; let i = $index) {
          <div class="ui-cb-wk-dh">
            <div class="eyebrow">{{ dowFull[d.getDay()] }}</div>
            <div
              style="font-weight: 700; font-size: 15px"
              [style.color]="d.getDate() === today.getDate() ? 'var(--accent)' : 'var(--text)'"
            >
              {{ d.getDate() }}
            </div>
          </div>
        }
        @for (h of hours; track h) {
          <div class="ui-cb-wk-hr">{{ pad(h) }}:00</div>
          @for (d of weekDays; track i; let i = $index) {
            <div class="ui-cb-slot" (click)="slotClick(d, h)">
              @if (apptAt(d, h); as appt) {
                <div
                  class="ui-cb-appt"
                  [style.color]="tone(appt.tone)"
                  [style.background]="bg(appt.tone, 18)"
                >
                  {{ appt.title }}
                </div>
              }
            </div>
          }
        }
      </div>
    }

    @if (view === 'agenda') {
      <div>
        @for (day of agendaDays; track day) {
          <div class="ui-cb-agenda-day">
            <div style="width: 56px; flex-shrink: 0; text-align: center">
              <div class="eyebrow">{{ dowFull[dowOf(day)] }}</div>
              <div class="tnum" style="font-size: 22px; font-weight: 800; line-height: 1.1">
                {{ day }}
              </div>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px">
              @for (e of sortedDay(day); track e.id) {
                <div style="display: flex; align-items: center; gap: 10px">
                  <span
                    style="width: 8px; height: 8px; border-radius: 99px; flex-shrink: 0"
                    [style.background]="tone(e.tone)"
                  ></span>
                  <span style="font-weight: 600; font-size: 13.5px">{{ e.title }}</span>
                  <span
                    class="mono"
                    style="margin-left: auto; font-size: 11.5px; color: var(--text-faint)"
                  >
                    {{ e.time }}
                  </span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    }

    <vsp-dialog
      [open]="!!add"
      [maxWidth]="420"
      [title]="
        add && add.days.length > 1 ? 'New event · ' + add.days.length + ' days' : 'New event'
      "
      [desc]="dialogDesc"
      (close)="add = null"
    >
      <svg
        slot="icon"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      @if (add; as a) {
        <div style="display: grid; gap: 14px">
          <vsp-field label="Title" [required]="true">
            <vsp-input [(value)]="a.title" placeholder="Meeting, review, booking…" />
          </vsp-field>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
            <vsp-field label="Time">
              <vsp-input [(value)]="a.time" />
            </vsp-field>
            <vsp-field label="Color">
              <vsp-select [(value)]="a.tone" [options]="toneOptions" />
            </vsp-field>
          </div>
        </div>
      }
      <vsp-button slot="footer" variant="ghost" size="sm" (click)="add = null">Cancel</vsp-button>
      <vsp-button slot="footer" variant="primary" size="sm" (click)="saveAdd()"
        >Add event</vsp-button
      >
    </vsp-dialog>
  </div>`,
})
export class VspEventCalendar {
  @Input() initialEvents: CalendarEvent[] = DEFAULT_EVENTS;
  @Output() change = new EventEmitter<CalendarEvent[]>();

  today = new Date();
  view: View = 'month';
  vm = { m: this.today.getMonth(), y: this.today.getFullYear() };
  events: InternalEvent[] = [];
  sel: { a: number; b: number } | null = null;
  dragging = false;
  add: Draft | null = null;

  months = MONTHS;
  dowFull = DOW_FULL;
  toneOptions = TONE_OPTIONS;
  hours: number[] = [];

  constructor() {
    this.events = this.initialEvents.map((e, i) => ({ id: `e${i}`, hour: 9, ...e }));
    for (let h = 8; h <= 18; h++) this.hours.push(h);
  }

  tone(t: EventTone): string {
    return TONE[t];
  }
  bg(t: EventTone, pct: number): string {
    return `color-mix(in oklab, ${TONE[t]} ${pct}%, transparent)`;
  }
  pad(h: number): string {
    return String(h).padStart(2, '0');
  }
  cap(v: View): string {
    return v[0].toUpperCase() + v.slice(1);
  }
  setView(v: string): void {
    this.view = v.toLowerCase() as View;
  }
  goToday(): void {
    this.vm = { m: this.today.getMonth(), y: this.today.getFullYear() };
  }

  private commit(next: InternalEvent[]): void {
    this.events = next;
    this.change.emit(next);
  }
  nav(delta: number): void {
    let m = this.vm.m + delta;
    let y = this.vm.y;
    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }
    this.vm = { m, y };
  }
  openAdd(days: number[], hour?: number): void {
    this.add = {
      days,
      hour: hour ?? 9,
      title: '',
      tone: 'info',
      time: hour != null ? `${this.pad(hour)}:00` : '10:00',
    };
  }
  saveAdd(): void {
    const a = this.add;
    if (!a) return;
    if (!a.title.trim()) {
      this.add = null;
      return;
    }
    const stamp = Date.now();
    this.commit([
      ...this.events,
      ...a.days.map((d, i) => ({
        id: `n${stamp}${i}`,
        d,
        hour: a.hour,
        title: a.title,
        tone: a.tone,
        time: a.time,
      })),
    ]);
    this.add = null;
    toast({
      tone: 'pos',
      title: a.days.length > 1 ? `${a.days.length} events added` : 'Event added',
    });
  }
  slotClick(d: Date, h: number): void {
    if (!this.apptAt(d, h)) this.openAdd([d.getDate()], h);
  }

  get evByDay(): Record<number, InternalEvent[]> {
    const map: Record<number, InternalEvent[]> = {};
    for (const e of this.events) (map[e.d] = map[e.d] || []).push(e);
    return map;
  }
  get cells(): Cell[] {
    const first = new Date(this.vm.y, this.vm.m, 1).getDay();
    const dim = new Date(this.vm.y, this.vm.m + 1, 0).getDate();
    const prevDim = new Date(this.vm.y, this.vm.m, 0).getDate();
    const out: Cell[] = [];
    for (let i = first - 1; i >= 0; i--) out.push({ day: prevDim - i, muted: true });
    for (let d = 1; d <= dim; d++) out.push({ day: d });
    while (out.length % 7) out.push({ day: out.length - (first + dim) + 1, muted: true });
    return out;
  }
  get weekDays(): Date[] {
    const d0 = new Date(this.vm.y, this.vm.m, this.today.getDate() - this.today.getDay());
    const out: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(d0);
      d.setDate(d0.getDate() + i);
      out.push(d);
    }
    return out;
  }
  get agendaDays(): number[] {
    return Object.keys(this.evByDay)
      .map(Number)
      .sort((a, b) => a - b);
  }
  get dialogDesc(): string {
    const a = this.add;
    if (!a) return '';
    return `${MONTHS[this.vm.m]} ${a.days[0]}${a.days.length > 1 ? `–${a.days[a.days.length - 1]}` : ''}, ${this.vm.y}`;
  }

  evsFor(c: Cell): InternalEvent[] {
    return c.muted ? [] : this.evByDay[c.day] || [];
  }
  apptAt(d: Date, h: number): InternalEvent | undefined {
    return this.events.find(
      (e) => e.d === d.getDate() && e.hour === h && d.getMonth() === this.vm.m,
    );
  }
  sortedDay(day: number): InternalEvent[] {
    return this.evByDay[day].slice().sort((a, b) => a.hour - b.hour);
  }
  dowOf(day: number): number {
    return new Date(this.vm.y, this.vm.m, day).getDay();
  }
  isToday(d: number, muted?: boolean): boolean {
    return (
      !muted &&
      d === this.today.getDate() &&
      this.vm.m === this.today.getMonth() &&
      this.vm.y === this.today.getFullYear()
    );
  }
  inSel(d: number): boolean {
    return (
      !!this.sel && d >= Math.min(this.sel.a, this.sel.b) && d <= Math.max(this.sel.a, this.sel.b)
    );
  }
  cellClass(c: Cell): string {
    return ['ui-cb-cell', c.muted && 'muted', !c.muted && this.inSel(c.day) && 'sel']
      .filter(Boolean)
      .join(' ');
  }
  onLeave(): void {
    if (!this.dragging) this.sel = null;
  }
  cellDown(c: Cell): void {
    if (!c.muted) {
      this.dragging = true;
      this.sel = { a: c.day, b: c.day };
    }
  }
  cellEnter(c: Cell): void {
    if (this.dragging && !c.muted && this.sel) this.sel = { a: this.sel.a, b: c.day };
  }
  cellUp(c: Cell): void {
    if (this.dragging && this.sel) {
      this.dragging = false;
      const lo = Math.min(this.sel.a, c.day);
      const hi = Math.max(this.sel.a, c.day);
      const days: number[] = [];
      for (let d = lo; d <= hi; d++) days.push(d);
      this.openAdd(days);
      this.sel = null;
    }
  }
}
