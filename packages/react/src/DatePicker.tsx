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
}

/** The month grid. Usually used via `DatePicker` / `DateRangePicker`. */
export function Calendar({
  view,
  setView,
  isSelected,
  isInRange,
  isRangeEnd,
  onPick,
}: CalendarProps) {
  const today = stripTime(new Date());
  const days = monthGrid(view.y, view.m);
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
          aria-label="Previous month"
        >
          <Icon.chevLeft style={{ width: 16, height: 16 }} />
        </button>
        <span className="ttl">
          {MONTHS[view.m]} {view.y}
        </span>
        <button type="button" className="ui-cal-nav" onClick={() => nav(1)} aria-label="Next month">
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
          return (
            <button
              key={i}
              type="button"
              className={cx(
                'ui-cal-day',
                muted && 'muted',
                sameDay(dt, today) && 'today',
                sel && 'sel',
                range && !sel && 'inrange',
                rEdge === 'start' && 'rstart',
                rEdge === 'end' && 'rend',
              )}
              onClick={() => onPick(stripTime(dt))}
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
  value?: Date | null;
  onChange?: (date: Date) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date' }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLButtonElement>(null);
  const base = value ?? new Date();
  const [view, setView] = useState<MonthView>({ m: base.getMonth(), y: base.getFullYear() });
  useEffect(() => {
    if (open && value) setView({ m: value.getMonth(), y: value.getFullYear() });
  }, [open, value]);
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
        <span className={cx('val', !value && 'ph')}>{value ? fmtDate(value) : placeholder}</span>
        <Icon.chevDown className="chev" />
      </button>
      <DPanel open={open} anchorRef={anchor} onClose={() => setOpen(false)}>
        <Calendar
          view={view}
          setView={setView}
          isSelected={(d) => sameDay(d, value)}
          onPick={(d) => {
            onChange?.(d);
            setOpen(false);
          }}
        />
      </DPanel>
    </>
  );
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
}

export function DateRangePicker({
  value = { start: null, end: null },
  onChange,
  placeholder = 'Pick a range',
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
        <Calendar
          view={view}
          setView={setView}
          isSelected={(d) => sameDay(d, value.start) || sameDay(d, value.end)}
          isInRange={inRange}
          isRangeEnd={rangeEnd}
          onPick={pick}
        />
        <div className="ui-combo-foot">
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>
            {value.start && value.end
              ? `${Math.round((value.end.getTime() - value.start.getTime()) / 86400000) + 1} days`
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
