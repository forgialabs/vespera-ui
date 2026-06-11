// vespera-datepicker.jsx — Calendar, DatePicker (single), DateRangePicker. Depends on window.Icon, cx.
const { useState: useDp, useRef: useDpRef, useEffect: useDpEffect, useLayoutEffect: useDpLayout } = React;
const dpPortal = () => document.querySelector('.vsp-root') || document.body;
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (d) => d ? `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}` : '';
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const stripTime = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

function monthGrid(year, month) {
  const first = new Date(year, month, 1);
  const days = [];
  for (let i = first.getDay(); i > 0; i--) { const dt = new Date(year, month, 1 - i); days.push({ dt, muted: true }); }
  const dim = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= dim; d++) days.push({ dt: new Date(year, month, d) });
  while (days.length < 42) { const last = days[days.length - 1].dt; const nd = new Date(last); nd.setDate(nd.getDate() + 1); days.push({ dt: nd, muted: true }); }
  return days;
}

function DPanel({ open, anchorRef, onClose, children }) {
  const [rect, setRect] = useDp(null);
  const ref = useDpRef(null);
  useDpLayout(() => { if (open && anchorRef.current) setRect(anchorRef.current.getBoundingClientRect()); }, [open]);
  useDpEffect(() => {
    if (!open) return;
    const repos = () => anchorRef.current && setRect(anchorRef.current.getBoundingClientRect());
    const onDoc = (e) => { if (!ref.current?.contains(e.target) && !anchorRef.current?.contains(e.target)) onClose(); };
    const onEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', onDoc); window.addEventListener('keydown', onEsc);
    window.addEventListener('resize', repos); window.addEventListener('scroll', repos, true);
    return () => { document.removeEventListener('mousedown', onDoc); window.removeEventListener('keydown', onEsc); window.removeEventListener('resize', repos); window.removeEventListener('scroll', repos, true); };
  }, [open]);
  if (!open || !rect) return null;
  return ReactDOM.createPortal(
    <div ref={ref} className="ui-menu" style={{ position: 'fixed', top: rect.bottom + 6, left: rect.left, zIndex: 330, padding: 0, width: 'auto' }}>{children}</div>,
    dpPortal());
}

/* ---------------- Calendar grid ---------------- */
function Calendar({ view, setView, isSelected, isInRange, isRangeEnd, onPick }) {
  const today = stripTime(new Date());
  const days = monthGrid(view.y, view.m);
  const nav = (delta) => { let m = view.m + delta, y = view.y; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } setView({ m, y }); };
  return (
    <div className="ui-cal">
      <div className="ui-cal-head">
        <button className="ui-cal-nav" onClick={() => nav(-1)}><window.Icon.chevLeft style={{ width: 16, height: 16 }} /></button>
        <span className="ttl">{MONTHS[view.m]} {view.y}</span>
        <button className="ui-cal-nav" onClick={() => nav(1)}><window.Icon.chevRight style={{ width: 16, height: 16 }} /></button>
      </div>
      <div className="ui-cal-grid">
        {DOW.map(d => <div key={d} className="ui-cal-dow">{d}</div>)}
        {days.map(({ dt, muted }, i) => {
          const sel = isSelected(dt), range = isInRange && isInRange(dt), rEdge = isRangeEnd && isRangeEnd(dt);
          return (
            <button key={i} className={cx('ui-cal-day', muted && 'muted', sameDay(dt, today) && 'today',
              sel && 'sel', range && !sel && 'inrange', rEdge === 'start' && 'rstart', rEdge === 'end' && 'rend')}
              onClick={() => onPick(stripTime(dt))}>{dt.getDate()}</button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- DatePicker (single) ---------------- */
function DatePicker({ value, onChange, placeholder = 'Pick a date' }) {
  const [open, setOpen] = useDp(false);
  const anchor = useDpRef(null);
  const base = value || new Date();
  const [view, setView] = useDp({ m: base.getMonth(), y: base.getFullYear() });
  useDpEffect(() => { if (open && value) setView({ m: value.getMonth(), y: value.getFullYear() }); }, [open]);
  return (
    <>
      <button type="button" ref={anchor} className={cx('ui-trigger', open && 'open')} onClick={() => setOpen(o => !o)}>
        <window.Icon.calendar style={{ width: 16, height: 16, color: 'var(--text-faint)', flexShrink: 0 }} />
        <span className={cx('val', !value && 'ph')}>{value ? fmtDate(value) : placeholder}</span>
        <window.Icon.chevDown className="chev" />
      </button>
      <DPanel open={open} anchorRef={anchor} onClose={() => setOpen(false)}>
        <Calendar view={view} setView={setView} isSelected={d => sameDay(d, value)} onPick={d => { onChange?.(d); setOpen(false); }} />
      </DPanel>
    </>
  );
}

/* ---------------- DateRangePicker ---------------- */
function DateRangePicker({ value = {}, onChange, placeholder = 'Pick a range' }) {
  const [open, setOpen] = useDp(false);
  const anchor = useDpRef(null);
  const base = value.start || new Date();
  const [view, setView] = useDp({ m: base.getMonth(), y: base.getFullYear() });
  const pick = (d) => {
    if (!value.start || (value.start && value.end)) onChange?.({ start: d, end: null });
    else if (d < value.start) onChange?.({ start: d, end: value.start });
    else onChange?.({ start: value.start, end: d });
  };
  const inRange = (d) => value.start && value.end && d > value.start && d < value.end;
  const rangeEnd = (d) => { if (sameDay(d, value.start) && value.end) return 'start'; if (sameDay(d, value.end)) return 'end'; return false; };
  const label = value.start ? (value.end ? `${fmtDate(value.start)} – ${fmtDate(value.end)}` : `${fmtDate(value.start)} – …`) : placeholder;
  return (
    <>
      <button type="button" ref={anchor} className={cx('ui-trigger', open && 'open')} onClick={() => setOpen(o => !o)}>
        <window.Icon.calendar style={{ width: 16, height: 16, color: 'var(--text-faint)', flexShrink: 0 }} />
        <span className={cx('val', !value.start && 'ph')}>{label}</span>
        <window.Icon.chevDown className="chev" />
      </button>
      <DPanel open={open} anchorRef={anchor} onClose={() => setOpen(false)}>
        <Calendar view={view} setView={setView}
          isSelected={d => sameDay(d, value.start) || sameDay(d, value.end)}
          isInRange={inRange} isRangeEnd={rangeEnd} onPick={pick} />
        <div className="ui-combo-foot"><span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{value.start && value.end ? `${Math.round((value.end - value.start) / 86400000) + 1} days` : 'Select start & end'}</span><div style={{ flex: 1 }} /><button className="btn btn-subtle btn-sm" onClick={() => { onChange?.({ start: null, end: null }); }}>Clear</button><button className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Done</button></div>
      </DPanel>
    </>
  );
}

Object.assign(window, { Calendar, DatePicker, DateRangePicker, fmtDate });
