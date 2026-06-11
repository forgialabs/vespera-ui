// vespera-extras.jsx — Spinner, CircularProgress, Accordion, FileDropzone, EmptyState,
// Banner, OTPInput, CopyButton, AvatarGroup. Depends on window.Icon, cx, Button.
const { useState: useX, useRef: useXRef } = React;

/* ---------------- Spinner ---------------- */
function Spinner({ size }) { return <span className={cx('ui-spinner', size === 'lg' && 'lg')} />; }

/* ---------------- CircularProgress ---------------- */
function CircularProgress({ value = 0, size = 76, thickness = 7, color = 'var(--accent)', label }) {
  const r = (size - thickness) / 2, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={thickness} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - Math.min(100, value) / 100)} style={{ transition: 'stroke-dashoffset .5s cubic-bezier(.3,.7,.3,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: size * 0.24 }} className="tnum">{label ?? `${Math.round(value)}%`}</div>
    </div>
  );
}

/* ---------------- Accordion ---------------- */
function Accordion({ items, multiple, defaultOpen = [] }) {
  const [open, setOpen] = useX(() => new Set(defaultOpen));
  const toggle = (i) => setOpen(s => {
    const n = new Set(multiple ? s : []);
    s.has(i) ? n.delete(i) : n.add(i);
    return n;
  });
  return (
    <div className="ui-acc">
      {items.map((it, i) => (
        <div key={i} className={cx('ui-acc-item', open.has(i) && 'open')}>
          <button className="ui-acc-head" onClick={() => toggle(i)}>
            {it.icon && window.Icon[it.icon] && React.createElement(window.Icon[it.icon], { style: { width: 17, height: 17, color: 'var(--text-dim)' } })}
            {it.title}
            <window.Icon.chevRight className="chev" style={{ width: 17, height: 17 }} />
          </button>
          <div className="ui-acc-bodywrap"><div><div className="ui-acc-body">{it.body}</div></div></div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- FileDropzone ---------------- */
function FileDropzone({ hint = 'PNG, JPG or PDF up to 10MB' }) {
  const [drag, setDrag] = useX(false);
  const [files, setFiles] = useX([]);
  const addMock = () => setFiles(f => [...f, { name: `document-${f.length + 1}.pdf`, size: `${(Math.random() * 4 + 0.4).toFixed(1)} MB` }]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className={cx('ui-dropzone', drag && 'drag')} role="button" tabIndex={0}
        onClick={addMock}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); addMock(); }}>
        <span className="dz-icon"><window.Icon.download style={{ width: 21, height: 21 }} /></span>
        <div style={{ fontWeight: 600, fontSize: 13.5 }}>Drop files or <span style={{ color: 'var(--accent)' }}>browse</span></div>
        <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{hint}</div>
      </div>
      {files.map((f, i) => (
        <div key={i} className="ui-file-row">
          <window.Icon.doc style={{ width: 18, height: 18, color: 'var(--accent)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div><div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{f.size} · uploaded</div></div>
          <window.Icon.checkCircle style={{ width: 17, height: 17, color: 'var(--success)' }} />
          <button className="vsp-icon-btn" style={{ width: 28, height: 28, border: 0, background: 'transparent' }} onClick={() => setFiles(x => x.filter((_, j) => j !== i))}><window.Icon.x style={{ width: 15, height: 15 }} /></button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- EmptyState ---------------- */
function EmptyState({ icon = 'inbox', title, desc, action, compact }) {
  const I = window.Icon[icon];
  return (
    <div style={{ display: 'grid', placeItems: 'center', textAlign: 'center', padding: compact ? '32px 20px' : '56px 24px' }}>
      <div style={{ maxWidth: 340 }}>
        <span style={{ width: 56, height: 56, borderRadius: 16, display: 'grid', placeItems: 'center', margin: '0 auto 18px', background: 'color-mix(in oklab, var(--accent) 12%, transparent)', color: 'var(--accent)', border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)' }}><I style={{ width: 26, height: 26 }} /></span>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
        {desc && <p style={{ margin: '7px 0 0', color: 'var(--text-dim)', fontSize: 13.5, lineHeight: 1.6 }}>{desc}</p>}
        {action && <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'center' }}>{action}</div>}
      </div>
    </div>
  );
}

/* ---------------- Banner ---------------- */
function Banner({ tone = 'info', icon, children, onDismiss, action }) {
  const map = { info: 'sparkle', warn: 'bell', accent: 'bolt' };
  const I = window.Icon[icon || map[tone] || 'sparkle'];
  return (
    <div className={cx('ui-banner', tone)}>
      <I /><div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{children}</div>
      {action}
      {onDismiss && <button className="ui-banner-x" onClick={onDismiss}><window.Icon.x style={{ width: 15, height: 15 }} /></button>}
    </div>
  );
}

/* ---------------- OTPInput ---------------- */
function OTPInput({ length = 6, value = '', onChange }) {
  const refs = useXRef([]);
  const chars = Array.from({ length }, (_, i) => value[i] || '');
  const set = (i, ch) => {
    const next = chars.slice(); next[i] = ch.slice(-1); const str = next.join('');
    onChange?.(str);
    if (ch && i < length - 1) refs.current[i + 1]?.focus();
  };
  const onKey = (i, e) => { if (e.key === 'Backspace' && !chars[i] && i > 0) refs.current[i - 1]?.focus(); };
  return (
    <div className="ui-otp">
      {chars.map((c, i) => (
        <input key={i} ref={el => refs.current[i] = el} inputMode="numeric" maxLength={1} value={c}
          onChange={e => set(i, e.target.value.replace(/\D/g, ''))} onKeyDown={e => onKey(i, e)} />
      ))}
    </div>
  );
}

/* ---------------- CopyButton ---------------- */
function CopyButton({ text, label = 'Copy', size = 'sm' }) {
  const [done, setDone] = useX(false);
  const copy = () => { try { navigator.clipboard?.writeText(text); } catch (e) {} setDone(true); setTimeout(() => setDone(false), 1400); window.toast?.({ title: 'Copied to clipboard' }); };
  return <button className={cx('btn', 'btn-ghost', size === 'sm' && 'btn-sm')} onClick={copy}>{done ? <window.Icon.check style={{ width: 15, height: 15, color: 'var(--success)' }} /> : <window.Icon.doc style={{ width: 15, height: 15 }} />}{done ? 'Copied' : label}</button>;
}

/* ---------------- AvatarGroup ---------------- */
function AvatarGroup({ people = [], max = 4, size = 32 }) {
  const shown = people.slice(0, max), extra = people.length - shown.length;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((p, i) => <span key={i} style={{ marginLeft: i ? -10 : 0, border: '2px solid var(--surface-1)', borderRadius: '50%', position: 'relative', zIndex: shown.length - i }}><Av name={p.name} hue={p.hue} size={size} /></span>)}
      {extra > 0 && <span style={{ marginLeft: -10, width: size, height: size, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--surface-3)', border: '2px solid var(--surface-1)', fontSize: size * 0.34, fontWeight: 700, color: 'var(--text-dim)' }}>+{extra}</span>}
    </div>
  );
}

Object.assign(window, { Spinner, CircularProgress, Accordion, FileDropzone, EmptyState, Banner, OTPInput, CopyButton, AvatarGroup });

/* ---------------- NumberStepper ---------------- */
function NumberStepper({ value = 0, onChange, min, max, step = 1, unit }) {
  const set = (v) => { if (min != null && v < min) v = min; if (max != null && v > max) v = max; onChange?.(v); };
  return (
    <div className="ui-stepper">
      <button type="button" onClick={() => set(value - step)} disabled={min != null && value <= min} aria-label="Decrease">−</button>
      <span className="val">{value}{unit && <i>{unit}</i>}</span>
      <button type="button" onClick={() => set(value + step)} disabled={max != null && value >= max} aria-label="Increase">+</button>
    </div>
  );
}

/* ---------------- Tree ---------------- */
function TreeNode({ node, depth, expanded, setExpanded, selected, setSelected }) {
  const id = node.id || node.label;
  const hasKids = node.children && node.children.length;
  const open = expanded.has(id);
  const I = (node.icon && window.Icon[node.icon]) || window.Icon[hasKids ? 'layers' : 'doc'];
  return (
    <div>
      <div className={cx('ui-tree-row', open && 'open', selected === id && 'sel')}
        onClick={() => { hasKids ? setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }) : setSelected(id); if (hasKids) setSelected(id); }}>
        {hasKids ? <window.Icon.chevRight className="tw-chev" /> : <span style={{ width: 16, flexShrink: 0 }} />}
        <I className="tw-icon" />
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.label}</span>
        {node.badge != null && <span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{node.badge}</span>}
      </div>
      {hasKids && open && <div className="ui-tree-children">{node.children.map((c, i) => <TreeNode key={i} node={c} depth={depth + 1} expanded={expanded} setExpanded={setExpanded} selected={selected} setSelected={setSelected} />)}</div>}
    </div>
  );
}
function Tree({ data = [], defaultExpanded = [] }) {
  const [expanded, setExpanded] = useX(() => new Set(defaultExpanded));
  const [selected, setSelected] = useX(null);
  return <div className="ui-tree">{data.map((n, i) => <TreeNode key={i} node={n} depth={0} expanded={expanded} setExpanded={setExpanded} selected={selected} setSelected={setSelected} />)}</div>;
}

/* ---------------- Timeline ---------------- */
function Timeline({ items = [] }) {
  const tone = { pos: 'var(--success)', neg: 'var(--danger)', warn: 'var(--warning)', info: 'var(--accent)' };
  return (
    <div className="ui-tl">
      {items.map((it, i) => {
        const I = window.Icon[it.icon || 'clock'];
        const c = tone[it.tone];
        return (
          <div key={i} className="ui-tl-item">
            <span className="ui-tl-dot" style={c ? { background: `color-mix(in oklab, ${c} 14%, transparent)`, color: c, borderColor: `color-mix(in oklab, ${c} 30%, transparent)` } : undefined}><I /></span>
            <div className="ui-tl-body">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, fontSize: 13.5 }}>{it.title}</span>
                <span className="eyebrow" style={{ marginLeft: 'auto' }}>{it.time}</span>
              </div>
              {it.body && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 3 }}>{it.body}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- DescriptionList ---------------- */
function DescriptionList({ items = [] }) {
  return (
    <dl className="ui-dl">
      {items.map(([k, v], i) => (
        <React.Fragment key={i}>
          <dt className={i === items.length - 1 ? 'last' : ''}>{k}</dt>
          <dd className={i === items.length - 1 ? 'last' : ''}>{v}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

/* ---------------- InlineEdit ---------------- */
function InlineEdit({ value, onSave, placeholder = 'Empty' }) {
  const [editing, setEditing] = useX(false);
  const [draft, setDraft] = useX(value);
  const ref = useXRef(null);
  const commit = () => { setEditing(false); if (draft !== value) onSave?.(draft); };
  if (editing) {
    return <input ref={ref} className="ui-input" autoFocus value={draft} style={{ height: 32, maxWidth: 240 }}
      onChange={e => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }} />;
  }
  return <span className="ui-inline" onClick={() => { setDraft(value); setEditing(true); }}>
    <span style={{ color: value ? 'var(--text)' : 'var(--text-faint)' }}>{value || placeholder}</span>
    <window.Icon.settings className="pen" />
  </span>;
}

Object.assign(window, { NumberStepper, Tree, Timeline, DescriptionList, InlineEdit });

/* ---------------- Stat (compact KPI tile) ---------------- */
function Stat({ icon, label, value, delta, deltaDir = 'up', tone = 'var(--accent)' }) {
  const I = icon && window.Icon[icon];
  const Arrow = deltaDir === 'up' ? window.Icon.arrowUp : window.Icon.arrowDown;
  return (
    <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
      {I && <span style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', flexShrink: 0, display: 'grid', placeItems: 'center', background: `color-mix(in oklab, ${tone} 14%, transparent)`, color: tone }}><I style={{ width: 19, height: 19 }} /></span>}
      <div style={{ minWidth: 0 }}>
        <div className="eyebrow">{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 3 }}>
          <span className="tnum" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>{value}</span>
          {delta != null && <span className={cx('badge', deltaDir === 'up' ? 'badge-pos' : 'badge-neg')} style={{ padding: '1px 6px' }}><Arrow style={{ width: 10, height: 10 }} />{delta}</span>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- SettingRow ---------------- */
function SettingRow({ title, desc, children, last }) {
  return (
    <div className={cx('ui-setrow', last && 'last')}>
      <div className="ui-setrow-main"><div className="ui-setrow-title">{title}</div>{desc && <div className="ui-setrow-desc">{desc}</div>}</div>
      {children}
    </div>
  );
}

/* ---------------- VerticalTabs ---------------- */
function VerticalTabs({ tabs, value, onChange }) {
  return (
    <div className="ui-vtabs">
      {tabs.map(t => {
        const id = typeof t === 'string' ? t : t.value;
        const label = typeof t === 'string' ? t : t.label;
        const I = typeof t === 'object' && t.icon && window.Icon[t.icon];
        return (
          <button key={id} className={cx('ui-vtab', value === id && 'on')} onClick={() => onChange(id)}>
            {I && <I />}{label}{typeof t === 'object' && t.badge != null && <span className="ui-nav-badge">{t.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Nav (flat + nested/collapsible side nav) ---------------- */
function NavItem({ icon, label, active, badge, onClick, sub }) {
  const I = icon && window.Icon[icon];
  return (
    <button className={cx('ui-nav-item', active && 'on')} onClick={onClick}>
      {I && <I />}<span style={{ flex: sub ? 'none' : 1 }}>{label}</span>{badge != null && <span className="ui-nav-badge">{badge}</span>}
    </button>
  );
}
function NavGroup({ icon, label, defaultOpen, children }) {
  const [open, setOpen] = useX(!!defaultOpen);
  const I = icon && window.Icon[icon];
  return (
    <div className={cx('ui-nav-group', open && 'open')}>
      <button className={cx('ui-nav-item', open && 'open')} onClick={() => setOpen(o => !o)}>
        {I && <I />}<span>{label}</span><window.Icon.chevRight className="ui-nav-chev" />
      </button>
      <div className="ui-nav-sub"><div><div className="ui-nav" style={{ paddingTop: 2 }}>{children}</div></div></div>
    </div>
  );
}

Object.assign(window, { Stat, SettingRow, VerticalTabs, NavItem, NavGroup });

/* ---------------- EventCalendar (month + agenda) ---------------- */
const CB_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CB_DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CB_TONE = { info: 'var(--accent)', success: 'var(--success)', warning: 'var(--warning)', danger: 'var(--danger)', violet: 'var(--accent-2)' };
const CB_EVENTS = [
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
function EventCalendar({ initialEvents = CB_EVENTS, onChange }) {
  const today = new Date();
  const [view, setView] = useX('month');
  const [vm, setVm] = useX({ m: today.getMonth(), y: today.getFullYear() });
  const [events, setEvents] = useX(initialEvents.map((e, i) => ({ id: 'e' + i, hour: 9, ...e })));
  const [sel, setSel] = useX(null);          // {a,b} drag range (month)
  const dragRef = useXRef(false);
  const [add, setAdd] = useX(null);           // draft {days:[], hour, title, tone, time}
  const commit = (next) => { setEvents(next); onChange?.(next); };

  const nav = (d) => { let m = vm.m + d, y = vm.y; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } setVm({ m, y }); };
  const evByDay = {}; events.forEach(e => { (evByDay[e.d] = evByDay[e.d] || []).push(e); });
  const first = new Date(vm.y, vm.m, 1).getDay(), dim = new Date(vm.y, vm.m + 1, 0).getDate(), prevDim = new Date(vm.y, vm.m, 0).getDate();
  const cells = [];
  for (let i = first - 1; i >= 0; i--) cells.push({ day: prevDim - i, muted: true });
  for (let d = 1; d <= dim; d++) cells.push({ day: d });
  while (cells.length % 7) cells.push({ day: cells.length - (first + dim) + 1, muted: true });
  const isToday = (d, m) => !m && d === today.getDate() && vm.m === today.getMonth() && vm.y === today.getFullYear();
  const inSel = (d) => sel && d >= Math.min(sel.a, sel.b) && d <= Math.max(sel.a, sel.b);

  const openAdd = (days, hour) => setAdd({ days, hour: hour ?? 9, title: '', tone: 'info', time: hour != null ? `${String(hour).padStart(2, '0')}:00` : '10:00' });
  const saveAdd = () => {
    if (!add.title.trim()) { setAdd(null); return; }
    const next = [...events, ...add.days.map((d, i) => ({ id: 'n' + Date.now() + i, d, hour: add.hour, title: add.title, tone: add.tone, time: add.time }))];
    commit(next); setAdd(null);
    window.toast?.({ tone: 'success', title: add.days.length > 1 ? `${add.days.length} events added` : 'Event added' });
  };

  const HOURS = []; for (let h = 8; h <= 18; h++) HOURS.push(h);
  const weekDays = []; { const d0 = new Date(vm.y, vm.m, today.getDate() - today.getDay()); for (let i = 0; i < 7; i++) { const d = new Date(d0); d.setDate(d0.getDate() + i); weekDays.push(d); } }

  return (
    <div className="ui-cb">
      <div className="ui-cb-head">
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="vsp-icon-btn" style={{ width: 32, height: 32 }} onClick={() => nav(-1)}><window.Icon.chevLeft /></button>
          <button className="vsp-icon-btn" style={{ width: 32, height: 32 }} onClick={() => nav(1)}><window.Icon.chevRight /></button>
        </div>
        <div className="ui-cb-title">{CB_MONTHS[vm.m]} {vm.y}</div>
        <button className="btn btn-ghost btn-sm" onClick={() => setVm({ m: today.getMonth(), y: today.getFullYear() })}>Today</button>
        <div style={{ flex: 1 }} />
        <Segmented options={['Month', 'Week', 'Agenda']} value={view[0].toUpperCase() + view.slice(1)} onChange={v => setView(v.toLowerCase())} />
        <button className="btn btn-primary btn-sm" onClick={() => openAdd([today.getDate()])}><window.Icon.plus />Event</button>
      </div>

      {view === 'month' && <>
        <div className="ui-cb-grid">{CB_DOW.map(d => <div key={d} className="ui-cb-dow">{d}</div>)}</div>
        <div className="ui-cb-grid" onMouseLeave={() => { if (!dragRef.current) setSel(null); }}>
          {cells.map((c, i) => {
            const evs = c.muted ? [] : (evByDay[c.day] || []);
            return (
              <div key={i} className={cx('ui-cb-cell', c.muted && 'muted', !c.muted && inSel(c.day) && 'sel')} style={i >= cells.length - 7 ? { borderBottom: 0 } : undefined}
                onMouseDown={() => { if (!c.muted) { dragRef.current = true; setSel({ a: c.day, b: c.day }); } }}
                onMouseEnter={() => { if (dragRef.current && !c.muted) setSel(s => ({ a: s.a, b: c.day })); }}
                onMouseUp={() => { if (dragRef.current) { dragRef.current = false; const lo = Math.min(sel.a, c.day), hi = Math.max(sel.a, c.day); const days = []; for (let d = lo; d <= hi; d++) days.push(d); openAdd(days); setSel(null); } }}>
                <span className={cx('ui-cb-date', isToday(c.day, c.muted) && 'today')}>{c.day}</span>
                {evs.slice(0, 3).map((e, j) => <div key={j} className="ui-cb-event" style={{ color: CB_TONE[e.tone], background: `color-mix(in oklab, ${CB_TONE[e.tone]} 14%, transparent)` }}><i />{e.title}</div>)}
                {evs.length > 3 && <span className="ui-cb-more">+{evs.length - 3} more</span>}
              </div>
            );
          })}
        </div>
      </>}

      {view === 'week' && <div className="ui-cb-week" style={{ maxHeight: 420, overflowY: 'auto' }}>
        <div className="ui-cb-wk-corner" />
        {weekDays.map((d, i) => <div key={i} className="ui-cb-wk-dh"><div className="eyebrow">{CB_DOW[d.getDay()]}</div><div style={{ fontWeight: 700, fontSize: 15, color: d.getDate() === today.getDate() ? 'var(--accent)' : 'var(--text)' }}>{d.getDate()}</div></div>)}
        {HOURS.map(h => <React.Fragment key={h}>
          <div className="ui-cb-wk-hr">{String(h).padStart(2, '0')}:00</div>
          {weekDays.map((d, i) => {
            const appt = events.find(e => e.d === d.getDate() && e.hour === h && d.getMonth() === vm.m);
            return <div key={i} className="ui-cb-slot" onClick={() => !appt && openAdd([d.getDate()], h)}>
              {appt && <div className="ui-cb-appt" style={{ color: CB_TONE[appt.tone], background: `color-mix(in oklab, ${CB_TONE[appt.tone]} 18%, transparent)` }}>{appt.title}</div>}
            </div>;
          })}
        </React.Fragment>)}
      </div>}

      {view === 'agenda' && <div>
        {Object.keys(evByDay).map(Number).sort((a, b) => a - b).map(day => (
          <div key={day} className="ui-cb-agenda-day">
            <div style={{ width: 56, flexShrink: 0, textAlign: 'center' }}><div className="eyebrow">{CB_DOW[new Date(vm.y, vm.m, day).getDay()]}</div><div className="tnum" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>{day}</div></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {evByDay[day].sort((a, b) => a.hour - b.hour).map((e, j) => <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: CB_TONE[e.tone], flexShrink: 0 }} /><span style={{ fontWeight: 600, fontSize: 13.5 }}>{e.title}</span><span className="mono" style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--text-faint)' }}>{e.time}</span></div>)}
            </div>
          </div>
        ))}
      </div>}

      <Dialog open={!!add} onClose={() => setAdd(null)} icon="calendar" title={add && add.days.length > 1 ? `New event · ${add.days.length} days` : 'New event'}
        desc={add ? `${CB_MONTHS[vm.m]} ${add.days[0]}${add.days.length > 1 ? `–${add.days[add.days.length - 1]}` : ''}, ${vm.y}` : ''} maxWidth={420}
        footer={<><Button variant="ghost" size="sm" onClick={() => setAdd(null)}>Cancel</Button><Button variant="primary" size="sm" onClick={saveAdd}>Add event</Button></>}>
        {add && <div style={{ display: 'grid', gap: 14 }}>
          <Field label="Title" required><Input autoFocus value={add.title} onChange={e => setAdd(a => ({ ...a, title: e.target.value }))} placeholder="Meeting, review, booking…" /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Time"><Input value={add.time} onChange={e => setAdd(a => ({ ...a, time: e.target.value }))} /></Field>
            <Field label="Color"><Select value={add.tone} onChange={e => setAdd(a => ({ ...a, tone: e.target.value }))} options={[{ value: 'info', label: 'Blue' }, { value: 'success', label: 'Green' }, { value: 'warning', label: 'Amber' }, { value: 'danger', label: 'Red' }, { value: 'violet', label: 'Violet' }]} /></Field>
          </div>
        </div>}
      </Dialog>
    </div>
  );
}

Object.assign(window, { EventCalendar });
