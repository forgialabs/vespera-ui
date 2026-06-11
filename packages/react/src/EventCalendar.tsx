import { Fragment, useRef, useState } from 'react';
import { Icon } from '@vespera-ui/icons';
import { cx } from './cx';
import { Segmented } from './Segmented';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Field, Input } from './Field';
import { Select } from './Select';
import { toast } from './Toast';

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
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Semantic colour for an event, mapped to a Vespera token. */
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
  /** Stable id; auto-assigned when omitted. */
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

type InternalEvent = Required<Pick<CalendarEvent, 'id' | 'hour'>> & CalendarEvent;

interface Draft {
  days: number[];
  hour: number;
  title: string;
  tone: EventTone;
  time: string;
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

export interface EventCalendarProps {
  /** Events to seed the calendar with. */
  initialEvents?: CalendarEvent[];
  /** Called with the full event list whenever events are added. */
  onChange?: (events: CalendarEvent[]) => void;
}

type View = 'month' | 'week' | 'agenda';

/**
 * A month / week / agenda calendar with click-and-drag day selection and an
 * inline "new event" dialog. Events are kept in local state; `onChange` reports
 * every change so a host can persist them.
 */
export function EventCalendar({ initialEvents = DEFAULT_EVENTS, onChange }: EventCalendarProps) {
  const today = new Date();
  const [view, setView] = useState<View>('month');
  const [vm, setVm] = useState({ m: today.getMonth(), y: today.getFullYear() });
  const [events, setEvents] = useState<InternalEvent[]>(
    initialEvents.map((e, i) => ({ id: `e${i}`, hour: 9, ...e })),
  );
  const [sel, setSel] = useState<{ a: number; b: number } | null>(null);
  const dragRef = useRef(false);
  const [add, setAdd] = useState<Draft | null>(null);

  const commit = (next: InternalEvent[]) => {
    setEvents(next);
    onChange?.(next);
  };

  const nav = (delta: number) => {
    let m = vm.m + delta;
    let y = vm.y;
    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }
    setVm({ m, y });
  };

  const evByDay: Record<number, InternalEvent[]> = {};
  events.forEach((e) => {
    (evByDay[e.d] = evByDay[e.d] || []).push(e);
  });

  const first = new Date(vm.y, vm.m, 1).getDay();
  const dim = new Date(vm.y, vm.m + 1, 0).getDate();
  const prevDim = new Date(vm.y, vm.m, 0).getDate();
  const cells: { day: number; muted?: boolean }[] = [];
  for (let i = first - 1; i >= 0; i--) cells.push({ day: prevDim - i, muted: true });
  for (let d = 1; d <= dim; d++) cells.push({ day: d });
  while (cells.length % 7) cells.push({ day: cells.length - (first + dim) + 1, muted: true });

  const isToday = (d: number, muted?: boolean) =>
    !muted && d === today.getDate() && vm.m === today.getMonth() && vm.y === today.getFullYear();
  const inSel = (d: number) => sel && d >= Math.min(sel.a, sel.b) && d <= Math.max(sel.a, sel.b);

  const openAdd = (days: number[], hour?: number) =>
    setAdd({
      days,
      hour: hour ?? 9,
      title: '',
      tone: 'info',
      time: hour != null ? `${String(hour).padStart(2, '0')}:00` : '10:00',
    });

  const saveAdd = () => {
    if (!add) return;
    if (!add.title.trim()) {
      setAdd(null);
      return;
    }
    const stamp = Date.now();
    const next: InternalEvent[] = [
      ...events,
      ...add.days.map((d, i) => ({
        id: `n${stamp}${i}`,
        d,
        hour: add.hour,
        title: add.title,
        tone: add.tone,
        time: add.time,
      })),
    ];
    commit(next);
    setAdd(null);
    toast({
      tone: 'pos',
      title: add.days.length > 1 ? `${add.days.length} events added` : 'Event added',
    });
  };

  const HOURS: number[] = [];
  for (let h = 8; h <= 18; h++) HOURS.push(h);
  const weekDays: Date[] = [];
  {
    const d0 = new Date(vm.y, vm.m, today.getDate() - today.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(d0);
      d.setDate(d0.getDate() + i);
      weekDays.push(d);
    }
  }

  const cap = (v: View) => v[0]!.toUpperCase() + v.slice(1);

  return (
    <div className="ui-cb">
      <div className="ui-cb-head">
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            className="vsp-icon-btn"
            style={{ width: 32, height: 32 }}
            onClick={() => nav(-1)}
            aria-label="Previous month"
          >
            <Icon.chevLeft />
          </button>
          <button
            type="button"
            className="vsp-icon-btn"
            style={{ width: 32, height: 32 }}
            onClick={() => nav(1)}
            aria-label="Next month"
          >
            <Icon.chevRight />
          </button>
        </div>
        <div className="ui-cb-title">
          {MONTHS[vm.m]} {vm.y}
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setVm({ m: today.getMonth(), y: today.getFullYear() })}
        >
          Today
        </button>
        <div style={{ flex: 1 }} />
        <Segmented
          options={['Month', 'Week', 'Agenda']}
          value={cap(view)}
          onChange={(v) => setView(v.toLowerCase() as View)}
        />
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openAdd([today.getDate()])}
        >
          <Icon.plus />
          Event
        </button>
      </div>

      {view === 'month' && (
        <>
          <div className="ui-cb-grid">
            {DOW.map((d) => (
              <div key={d} className="ui-cb-dow">
                {d}
              </div>
            ))}
          </div>
          <div
            className="ui-cb-grid"
            onMouseLeave={() => {
              if (!dragRef.current) setSel(null);
            }}
          >
            {cells.map((c, i) => {
              const evs = c.muted ? [] : evByDay[c.day] || [];
              return (
                <div
                  key={i}
                  className={cx(
                    'ui-cb-cell',
                    c.muted && 'muted',
                    !c.muted && inSel(c.day) && 'sel',
                  )}
                  style={i >= cells.length - 7 ? { borderBottom: 0 } : undefined}
                  onMouseDown={() => {
                    if (!c.muted) {
                      dragRef.current = true;
                      setSel({ a: c.day, b: c.day });
                    }
                  }}
                  onMouseEnter={() => {
                    if (dragRef.current && !c.muted) setSel((s) => (s ? { a: s.a, b: c.day } : s));
                  }}
                  onMouseUp={() => {
                    if (dragRef.current && sel) {
                      dragRef.current = false;
                      const lo = Math.min(sel.a, c.day);
                      const hi = Math.max(sel.a, c.day);
                      const days: number[] = [];
                      for (let d = lo; d <= hi; d++) days.push(d);
                      openAdd(days);
                      setSel(null);
                    }
                  }}
                >
                  <span className={cx('ui-cb-date', isToday(c.day, c.muted) && 'today')}>
                    {c.day}
                  </span>
                  {evs.slice(0, 3).map((e, j) => (
                    <div
                      key={j}
                      className="ui-cb-event"
                      style={{
                        color: TONE[e.tone],
                        background: `color-mix(in oklab, ${TONE[e.tone]} 14%, transparent)`,
                      }}
                    >
                      <i />
                      {e.title}
                    </div>
                  ))}
                  {evs.length > 3 && <span className="ui-cb-more">+{evs.length - 3} more</span>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {view === 'week' && (
        <div className="ui-cb-week" style={{ maxHeight: 420, overflowY: 'auto' }}>
          <div className="ui-cb-wk-corner" />
          {weekDays.map((d, i) => (
            <div key={i} className="ui-cb-wk-dh">
              <div className="eyebrow">{DOW[d.getDay()]}</div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: d.getDate() === today.getDate() ? 'var(--accent)' : 'var(--text)',
                }}
              >
                {d.getDate()}
              </div>
            </div>
          ))}
          {HOURS.map((h) => (
            <Fragment key={h}>
              <div className="ui-cb-wk-hr">{String(h).padStart(2, '0')}:00</div>
              {weekDays.map((d, i) => {
                const appt = events.find(
                  (e) => e.d === d.getDate() && e.hour === h && d.getMonth() === vm.m,
                );
                return (
                  <div
                    key={i}
                    className="ui-cb-slot"
                    onClick={() => !appt && openAdd([d.getDate()], h)}
                  >
                    {appt && (
                      <div
                        className="ui-cb-appt"
                        style={{
                          color: TONE[appt.tone],
                          background: `color-mix(in oklab, ${TONE[appt.tone]} 18%, transparent)`,
                        }}
                      >
                        {appt.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      )}

      {view === 'agenda' && (
        <div>
          {Object.keys(evByDay)
            .map(Number)
            .sort((a, b) => a - b)
            .map((day) => (
              <div key={day} className="ui-cb-agenda-day">
                <div style={{ width: 56, flexShrink: 0, textAlign: 'center' }}>
                  <div className="eyebrow">{DOW[new Date(vm.y, vm.m, day).getDay()]}</div>
                  <div className="tnum" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
                    {day}
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {evByDay[day]!.slice()
                    .sort((a, b) => a.hour - b.hour)
                    .map((e, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 99,
                            background: TONE[e.tone],
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontWeight: 600, fontSize: 13.5 }}>{e.title}</span>
                        <span
                          className="mono"
                          style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--text-faint)' }}
                        >
                          {e.time}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}

      <Dialog
        open={!!add}
        onClose={() => setAdd(null)}
        icon={<Icon.calendar />}
        title={add && add.days.length > 1 ? `New event · ${add.days.length} days` : 'New event'}
        desc={
          add
            ? `${MONTHS[vm.m]} ${add.days[0]}${
                add.days.length > 1 ? `–${add.days[add.days.length - 1]}` : ''
              }, ${vm.y}`
            : ''
        }
        maxWidth={420}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAdd(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={saveAdd}>
              Add event
            </Button>
          </>
        }
      >
        {add && (
          <div style={{ display: 'grid', gap: 14 }}>
            <Field label="Title" required>
              <Input
                autoFocus
                value={add.title}
                onChange={(e) => setAdd((a) => (a ? { ...a, title: e.target.value } : a))}
                placeholder="Meeting, review, booking…"
              />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Time">
                <Input
                  value={add.time}
                  onChange={(e) => setAdd((a) => (a ? { ...a, time: e.target.value } : a))}
                />
              </Field>
              <Field label="Color">
                <Select
                  value={add.tone}
                  onChange={(v) => setAdd((a) => (a ? { ...a, tone: v as EventTone } : a))}
                  options={TONE_OPTIONS}
                />
              </Field>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
