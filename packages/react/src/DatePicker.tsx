import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@vespera-ui/icons';
import { getPortalTarget } from './portal';
import { cx } from './cx';

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
  d ? `${MONTHS[d.getMonth()]!.slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}` : '';

const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const stripTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const nightsBetween = (a: Date, b: Date) =>
  Math.abs(Math.round((stripTime(b).getTime() - stripTime(a).getTime()) / 86400000));

/**
 * A flexible way to mark dates — used by the `disabled` prop on the pickers.
 * Combine several by passing an array (any match wins):
 *   - `Date` / `Date[]` — specific day(s)
 *   - `{ from, to }` — an inclusive span
 *   - `{ before }` / `{ after }` — everything past a threshold (e.g. no past dates)
 *   - `{ dayOfWeek: [0, 6] }` — weekdays (0 = Sunday … 6 = Saturday)
 *   - `(date) => boolean` — any custom rule (e.g. holidays from an API)
 */
export type DateMatcher =
  | Date
  | Date[]
  | { from: Date; to: Date }
  | { before: Date }
  | { after: Date }
  | { dayOfWeek: number[] }
  | ((date: Date) => boolean);

/** True when `d` satisfies the matcher (or any matcher in the array). */
export function matchesDate(d: Date, matcher?: DateMatcher | DateMatcher[]): boolean {
  if (!matcher) return false;
  if (Array.isArray(matcher)) return matcher.some((m) => matchesDate(d, m as DateMatcher));
  if (matcher instanceof Date) return sameDay(d, matcher);
  if (typeof matcher === 'function') return matcher(d);
  const x = stripTime(d);
  if ('from' in matcher && 'to' in matcher)
    return x >= stripTime(matcher.from) && x <= stripTime(matcher.to);
  if ('before' in matcher) return x < stripTime(matcher.before);
  if ('after' in matcher) return x > stripTime(matcher.after);
  if ('dayOfWeek' in matcher) return matcher.dayOfWeek.includes(d.getDay());
  return false;
}

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
    const last = days[days.length - 1]!.dt;
    const nd = new Date(last);
    nd.setDate(nd.getDate() + 1);
    days.push({ dt: nd, muted: true });
  }
  return days;
}

interface DPanelProps {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  children?: ReactNode;
}

function DPanel({ open, anchorRef, onClose, children }: DPanelProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (open && anchorRef.current) setRect(anchorRef.current.getBoundingClientRect());
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const repos = () => {
      if (anchorRef.current) setRect(anchorRef.current.getBoundingClientRect());
    };
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!ref.current?.contains(t) && !anchorRef.current?.contains(t)) onClose();
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onEsc);
    window.addEventListener('resize', repos);
    window.addEventListener('scroll', repos, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onEsc);
      window.removeEventListener('resize', repos);
      window.removeEventListener('scroll', repos, true);
    };
  }, [open, anchorRef, onClose]);

  if (!open || !rect) return null;
  const target = getPortalTarget();
  if (!target) return null;
  return createPortal(
    <div
      ref={ref}
      className="ui-menu"
      style={{
        position: 'fixed',
        top: rect.bottom + 6,
        left: rect.left,
        zIndex: 330,
        padding: 0,
        width: 'auto',
      }}
    >
      {children}
    </div>,
    target,
  );
}

type MonthView = { m: number; y: number };
type RangeEdge = 'start' | 'end' | false;

interface CalendarProps {
  view: MonthView;
  setView: (v: MonthView) => void;
  isSelected: (d: Date) => boolean;
  isInRange?: (d: Date) => boolean;
  isRangeEnd?: (d: Date) => RangeEdge;
  onPick: (d: Date) => void;
  /** Mark a day non-selectable (greyed, struck-through). */
  isDisabled?: (d: Date) => boolean;
  /** Earliest / latest navigable + selectable day. */
  min?: Date;
  max?: Date;
}

/** The month grid. Usually used via `DatePicker` / `DateRangePicker`. */
export function Calendar({
  view,
  setView,
  isSelected,
  isInRange,
  isRangeEnd,
  onPick,
  isDisabled,
  min,
  max,
}: CalendarProps) {
  const today = stripTime(new Date());
  const days = monthGrid(view.y, view.m);
  const minD = min ? stripTime(min) : null;
  const maxD = max ? stripTime(max) : null;
  const firstOfView = new Date(view.y, view.m, 1);
  const lastOfView = new Date(view.y, view.m + 1, 0);
  const prevDisabled = !!minD && firstOfView <= minD;
  const nextDisabled = !!maxD && lastOfView >= maxD;
  const dayDisabled = (dt: Date) =>
    !!isDisabled?.(dt) || (!!minD && stripTime(dt) < minD) || (!!maxD && stripTime(dt) > maxD);
  const nav = (delta: number) => {
    let m = view.m + delta;
    let y = view.y;
    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }
    setView({ m, y });
  };
  return (
    <div className="ui-cal">
      <div className="ui-cal-head">
        <button
          type="button"
          className="ui-cal-nav"
          onClick={() => nav(-1)}
          disabled={prevDisabled}
          aria-label="Previous month"
        >
          <Icon.chevLeft style={{ width: 16, height: 16 }} />
        </button>
        <span className="ttl">
          {MONTHS[view.m]} {view.y}
        </span>
        <button
          type="button"
          className="ui-cal-nav"
          onClick={() => nav(1)}
          disabled={nextDisabled}
          aria-label="Next month"
        >
          <Icon.chevRight style={{ width: 16, height: 16 }} />
        </button>
      </div>
      <div className="ui-cal-grid">
        {DOW.map((d) => (
          <div key={d} className="ui-cal-dow">
            {d}
          </div>
        ))}
        {days.map(({ dt, muted }, i) => {
          const sel = isSelected(dt);
          const range = isInRange?.(dt);
          const rEdge = isRangeEnd?.(dt);
          const dis = dayDisabled(dt);
          return (
            <button
              key={i}
              type="button"
              disabled={dis}
              className={cx(
                'ui-cal-day',
                muted && 'muted',
                sameDay(dt, today) && 'today',
                sel && 'sel',
                range && !sel && 'inrange',
                rEdge === 'start' && 'rstart',
                rEdge === 'end' && 'rend',
                dis && 'disabled',
              )}
              onClick={() => !dis && onPick(stripTime(dt))}
            >
              {dt.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface DatePickerProps {
  /** Selected day (single mode). */
  value?: Date | null;
  onChange?: (date: Date) => void;
  placeholder?: string;
  /** Earliest / latest selectable day. */
  min?: Date;
  max?: Date;
  /** Days that can't be picked — see {@link DateMatcher}. */
  disabled?: DateMatcher | DateMatcher[];
  /** Select several days instead of one. Drives `values` / `onValuesChange`. */
  multiple?: boolean;
  /** Selected days (multiple mode). */
  values?: Date[];
  onValuesChange?: (dates: Date[]) => void;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  min,
  max,
  disabled,
  multiple,
  values,
  onValuesChange,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLButtonElement>(null);
  const list = values ?? [];
  const base = (multiple ? list[list.length - 1] : value) ?? new Date();
  const [view, setView] = useState<MonthView>({ m: base.getMonth(), y: base.getFullYear() });
  // Re-sync the visible month to the selection whenever the panel opens.
  useEffect(() => {
    const v = multiple ? list[list.length - 1] : value;
    if (open && v) setView({ m: v.getMonth(), y: v.getFullYear() });
  }, [open]);

  const isDisabled = (d: Date) => matchesDate(d, disabled);
  const label = multiple
    ? list.length
      ? list.length === 1
        ? fmtDate(list[0])
        : `${list.length} dates`
      : placeholder
    : value
      ? fmtDate(value)
      : placeholder;
  const empty = multiple ? !list.length : !value;

  const pick = (d: Date) => {
    if (multiple) {
      const exists = list.some((x) => sameDay(x, d));
      const next = exists
        ? list.filter((x) => !sameDay(x, d))
        : [...list, d].sort((a, b) => a.getTime() - b.getTime());
      onValuesChange?.(next);
    } else {
      onChange?.(d);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        ref={anchor}
        className={cx('ui-trigger', open && 'open')}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon.calendar
          style={{ width: 16, height: 16, color: 'var(--text-faint)', flexShrink: 0 }}
        />
        <span className={cx('val', empty && 'ph')}>{label}</span>
        <Icon.chevDown className="chev" />
      </button>
      <DPanel open={open} anchorRef={anchor} onClose={() => setOpen(false)}>
        <Calendar
          view={view}
          setView={setView}
          min={min}
          max={max}
          isDisabled={isDisabled}
          isSelected={(d) => (multiple ? list.some((x) => sameDay(x, d)) : sameDay(d, value))}
          onPick={pick}
        />
        {multiple ? (
          <div className="ui-combo-foot">
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>
              {list.length ? `${list.length} selected` : 'Select dates'}
            </span>
            <div style={{ flex: 1 }} />
            <button
              type="button"
              className="btn btn-subtle btn-sm"
              onClick={() => onValuesChange?.([])}
            >
              Clear
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
              Done
            </button>
          </div>
        ) : null}
      </DPanel>
    </>
  );
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/** A named shortcut shown in the range picker's preset rail. */
export interface RangePreset {
  label: string;
  range: DateRange;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  /** Earliest / latest selectable day. */
  min?: Date;
  max?: Date;
  /** Days that can't be picked — see {@link DateMatcher}. */
  disabled?: DateMatcher | DateMatcher[];
  /** Minimum / maximum length of the range, in nights. */
  minNights?: number;
  maxNights?: number;
  /** Shortcut ranges shown in a rail beside the calendar. */
  presets?: RangePreset[];
}

export function DateRangePicker({
  value = { start: null, end: null },
  onChange,
  placeholder = 'Pick a range',
  min,
  max,
  disabled,
  minNights,
  maxNights,
  presets,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLButtonElement>(null);
  const base = value.start ?? new Date();
  const [view, setView] = useState<MonthView>({ m: base.getMonth(), y: base.getFullYear() });

  const pick = (d: Date) => {
    if (!value.start || value.end) onChange?.({ start: d, end: null });
    else if (d < value.start) onChange?.({ start: d, end: value.start });
    else onChange?.({ start: value.start, end: d });
  };
  const inRange = (d: Date) => !!value.start && !!value.end && d > value.start && d < value.end;
  const rangeEnd = (d: Date): RangeEdge => {
    if (sameDay(d, value.start) && value.end) return 'start';
    if (sameDay(d, value.end)) return 'end';
    return false;
  };
  // While choosing the end, also block days that would violate min/maxNights.
  const picking = !!value.start && !value.end;
  const isDisabled = (d: Date) => {
    if (matchesDate(d, disabled)) return true;
    if (picking && value.start && !sameDay(d, value.start)) {
      const n = nightsBetween(value.start, d);
      if (minNights != null && n < minNights) return true;
      if (maxNights != null && n > maxNights) return true;
    }
    return false;
  };
  const label = value.start
    ? value.end
      ? `${fmtDate(value.start)} – ${fmtDate(value.end)}`
      : `${fmtDate(value.start)} – …`
    : placeholder;

  return (
    <>
      <button
        type="button"
        ref={anchor}
        className={cx('ui-trigger', open && 'open')}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon.calendar
          style={{ width: 16, height: 16, color: 'var(--text-faint)', flexShrink: 0 }}
        />
        <span className={cx('val', !value.start && 'ph')}>{label}</span>
        <Icon.chevDown className="chev" />
      </button>
      <DPanel open={open} anchorRef={anchor} onClose={() => setOpen(false)}>
        <div className="ui-cal-wrap">
          {presets?.length ? (
            <div className="ui-cal-presets">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className={cx(
                    'ui-cal-preset',
                    sameDay(p.range.start, value.start) && sameDay(p.range.end, value.end) && 'on',
                  )}
                  onClick={() => onChange?.(p.range)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          ) : null}
          <Calendar
            view={view}
            setView={setView}
            min={min}
            max={max}
            isDisabled={isDisabled}
            isSelected={(d) => sameDay(d, value.start) || sameDay(d, value.end)}
            isInRange={inRange}
            isRangeEnd={rangeEnd}
            onPick={pick}
          />
        </div>
        <div className="ui-combo-foot">
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>
            {value.start && value.end
              ? `${nightsBetween(value.start, value.end) + 1} days`
              : 'Select start & end'}
          </span>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            className="btn btn-subtle btn-sm"
            onClick={() => onChange?.({ start: null, end: null })}
          >
            Clear
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
            Done
          </button>
        </div>
      </DPanel>
    </>
  );
}
