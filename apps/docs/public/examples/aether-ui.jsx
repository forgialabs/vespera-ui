// aether-ui.jsx — core primitives. Depends on window.Icon and ui.css/styles.css.
// Composable, prop-driven components — the copy-paste-friendly heart of Vespera.
const { useState: useUI, useRef: useUIRef, useEffect: useUIEffect, useId } = React;
const cx = (...a) => a.filter(Boolean).join(' ');
const agPortal = () => document.querySelector('.ag-root') || document.body;

/* ---------------- Button ---------------- */
function Button({ variant = 'ghost', size, leadingIcon, trailingIcon, loading, children, className, disabled, ...rest }) {
  const L = leadingIcon && window.Icon[leadingIcon];
  const T = trailingIcon && window.Icon[trailingIcon];
  return (
    <button className={cx('btn', `btn-${variant}`, size === 'sm' && 'btn-sm', className)} disabled={disabled || loading} {...rest}>
      {loading ? <span className="ui-spinner" aria-hidden="true" /> : (L && <L />)}{children}{!loading && T && <T />}
    </button>
  );
}
function IconButton({ icon, label, dot, className, ...rest }) {
  const I = window.Icon[icon];
  return <button className={cx('ag-icon-btn', className)} title={label} aria-label={label} {...rest}>{I && <I />}{dot && <span className="ag-dot" />}</button>;
}

/* ---------------- Field wrapper ---------------- */
function Field({ label, required, hint, error, children, htmlFor, action }) {
  return (
    <div className="ui-field">
      {label && <label className="ui-label" htmlFor={htmlFor}><span>{label}{required && <span className="req"> *</span>}</span>{action}</label>}
      {children}
      {(error || hint) && <span className={cx('ui-hint', error && 'err')}>{error || hint}</span>}
    </div>
  );
}

/* ---------------- Inputs ---------------- */
function Input({ invalid, className, ...rest }) {
  return <input className={cx('ui-input', invalid && 'invalid', className)} {...rest} />;
}
function Textarea({ className, ...rest }) { return <textarea className={cx('ui-textarea', className)} {...rest} />; }
function Select({ options = [], className, ...rest }) {
  return (
    <select className={cx('ui-select', className)} {...rest}>
      {options.map(o => typeof o === 'string'
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
function InputAffix({ leadingIcon, prefix, unit, ...rest }) {
  const L = leadingIcon && window.Icon[leadingIcon];
  return (
    <div className="ui-affix">
      {L && <L />}{prefix && <span className="unit">{prefix}</span>}
      <input {...rest} />
      {unit && <span className="unit">{unit}</span>}
    </div>
  );
}

/* ---------------- Checkbox / Radio / Switch ---------------- */
function Checkbox({ checked, onChange, label, sub, disabled }) {
  const node = <span className={cx('ui-check', checked && 'on')}><window.Icon.check /></span>;
  if (!label) return <span onClick={() => !disabled && onChange?.(!checked)} style={{ display: 'inline-flex', opacity: disabled ? .5 : 1 }}>{node}</span>;
  return (
    <label className="ui-opt" style={{ opacity: disabled ? .5 : 1 }} onClick={e => { e.preventDefault(); !disabled && onChange?.(!checked); }}>
      {node}<span><span>{label}</span>{sub && <span className="ui-opt-sub">{sub}</span>}</span>
    </label>
  );
}
function Radio({ checked, onChange, label, sub }) {
  return (
    <label className="ui-opt" onClick={e => { e.preventDefault(); onChange?.(); }}>
      <span className={cx('ui-radio-dot', checked && 'on')} />
      <span><span>{label}</span>{sub && <span className="ui-opt-sub">{sub}</span>}</span>
    </label>
  );
}
function RadioGroup({ value, onChange, options, style }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 12, ...style }}>
    {options.map(o => <Radio key={o.value} label={o.label} sub={o.sub} checked={value === o.value} onChange={() => onChange(o.value)} />)}
  </div>;
}
function Switch({ checked, onChange, size, disabled }) {
  return <button type="button" disabled={disabled} className={cx('ui-switch', size === 'sm' && 'sm', checked && 'on')} onClick={() => onChange?.(!checked)} aria-pressed={checked} />;
}
function Slider({ value, onChange, min = 0, max = 100, step = 1 }) {
  return <input type="range" className="ui-slider" value={value} min={min} max={max} step={step} onChange={e => onChange?.(Number(e.target.value))} />;
}

/* ---------------- Badge / Tag / Kbd / Divider ---------------- */
function Badge({ tone = 'muted', dot, children, className }) {
  return <span className={cx('badge', `badge-${tone}`, className)}>{dot && <i />}{children}</span>;
}
function Tag({ children, onRemove }) {
  return <span className="ui-tag">{children}{onRemove && <button onClick={onRemove}><window.Icon.x style={{ width: 11, height: 11 }} /></button>}</span>;
}
function Kbd({ children }) { return <kbd className="ui-kbd">{children}</kbd>; }
function Divider({ vertical, style }) { return <hr className={cx('ui-divider', vertical && 'v')} style={style} />; }

/* ---------------- Alert ---------------- */
function Alert({ tone = 'info', icon, title, children, action }) {
  const map = { info: 'sparkle', pos: 'checkCircle', warn: 'bell', neg: 'x' };
  const I = window.Icon[icon || map[tone]];
  return (
    <div className={cx('ui-alert', tone)}>
      <I />
      <div style={{ flex: 1 }}>
        {title && <div className="ui-alert-title">{title}</div>}
        {children && <div className="ui-alert-body">{children}</div>}
      </div>
      {action}
    </div>
  );
}

/* ---------------- Progress / Skeleton ---------------- */
function Progress({ value = 0, tone, height = 6 }) {
  return <div className="meter" style={{ height }}><i style={{ width: `${Math.min(100, value)}%`, background: tone, transition: 'width .3s' }} /></div>;
}
function Skeleton({ w = '100%', h = 12, r = 7, style }) {
  return <div className="skel" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

/* ---------------- Tabs (underline) ---------------- */
function Tabs({ tabs, value, onChange, right }) {
  return (
    <div className="ui-tabs" style={{ alignItems: 'center' }}>
      {tabs.map(t => {
        const id = typeof t === 'string' ? t : t.value;
        const label = typeof t === 'string' ? t : t.label;
        return <button key={id} className={cx('ui-tab', value === id && 'on')} onClick={() => onChange(id)}>{label}{typeof t === 'object' && t.count != null && <span className="badge badge-muted" style={{ marginLeft: 7 }}>{t.count}</span>}</button>;
      })}
      {right && <><div style={{ flex: 1 }} />{right}</>}
    </div>
  );
}

/* ---------------- Tooltip ---------------- */
function Tooltip({ label, children, side = 'top' }) {
  const [show, setShow] = useUI(false);
  const [pos, setPos] = useUI({ x: 0, y: 0 });
  const ref = useUIRef(null);
  const place = () => {
    const r = ref.current.getBoundingClientRect();
    const map = {
      top: { x: r.left + r.width / 2, y: r.top - 8 },
      bottom: { x: r.left + r.width / 2, y: r.bottom + 8 },
    };
    setPos(map[side] || map.top);
  };
  return (
    <span ref={ref} style={{ display: 'inline-flex' }}
      onMouseEnter={() => { place(); setShow(true); }} onMouseLeave={() => setShow(false)}>
      {children}
      {show && ReactDOM.createPortal(
        <div className="ui-tip" style={{ left: pos.x, top: pos.y, transform: side === 'bottom' ? 'translateX(-50%)' : 'translate(-50%,-100%)' }}>{label}</div>,
        agPortal())}
    </span>
  );
}

/* ---------------- Breadcrumb ---------------- */
function Breadcrumb({ items }) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5 }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <window.Icon.chevRight style={{ width: 13, height: 13, color: 'var(--text-faint)' }} />}
          <span style={{ color: i === items.length - 1 ? 'var(--text)' : 'var(--text-dim)', fontWeight: i === items.length - 1 ? 600 : 500, cursor: i < items.length - 1 ? 'pointer' : 'default' }}>{it}</span>
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ---------------- Pagination ---------------- */
function Pagination({ page, pages, onPage }) {
  const nums = [];
  for (let i = 0; i < pages; i++) {
    if (i === 0 || i === pages - 1 || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <button className="btn btn-ghost btn-sm" disabled={page === 0} style={{ opacity: page === 0 ? .4 : 1 }} onClick={() => onPage(page - 1)}><window.Icon.chevLeft style={{ width: 14, height: 14 }} /></button>
      {nums.map((n, i) => n === '…'
        ? <span key={i} className="mono" style={{ padding: '0 6px', color: 'var(--text-faint)' }}>…</span>
        : <button key={i} className={cx('btn', 'btn-sm', n === page ? 'btn-primary' : 'btn-subtle')} style={{ minWidth: 32, padding: 0 }} onClick={() => onPage(n)}>{n + 1}</button>)}
      <button className="btn btn-ghost btn-sm" disabled={page >= pages - 1} style={{ opacity: page >= pages - 1 ? .4 : 1 }} onClick={() => onPage(page + 1)}><window.Icon.chevRight style={{ width: 14, height: 14 }} /></button>
    </div>
  );
}

/* ---------------- Stepper ---------------- */
function Stepper({ steps, current }) {
  return (
    <div className="ui-steps">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div className={cx('ui-step-bar', i <= current && 'done')} />}
          <div className={cx('ui-step', i < current && 'done', i === current && 'active', i > current && 'pending')}>
            <span className="ui-step-dot">{i < current ? <window.Icon.check style={{ width: 14, height: 14 }} /> : i + 1}</span>
            <span className="ui-step-label">{s}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ---------------- Card head helper ---------------- */
function CardHead({ title, desc, right }) {
  return (
    <div className="card-head">
      <div style={{ minWidth: 0 }}>
        <h3>{title}</h3>
        {desc && <div className="eyebrow" style={{ marginTop: 3 }}>{desc}</div>}
      </div>
      {right && <><div className="ag-top-spacer" />{right}</>}
    </div>
  );
}

Object.assign(window, {
  cx, Button, IconButton, Field, Input, Textarea, Select, InputAffix,
  Checkbox, Radio, RadioGroup, Switch, Slider, Badge, Tag, Kbd, Divider,
  Alert, Progress, Skeleton, Tabs, Tooltip, Breadcrumb, Pagination, Stepper, CardHead,
});
