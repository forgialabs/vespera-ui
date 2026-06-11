// aether-select.jsx — searchable single-select, multi-select, and token input.
// Depends on window.Icon, cx, Tag, Checkbox. Exports Combobox, MultiSelect, TokenInput.
const { useState: useSel, useRef: useSelRef, useEffect: useSelEffect, useLayoutEffect: useSelLayout } = React;
const selPortal = () => document.querySelector('.ag-root') || document.body;
const normOpt = (o) => (typeof o === 'object' ? o : { value: o, label: String(o) });

/* anchored dropdown panel — positions under trigger, closes on outside/esc */
function SelPanel({ open, anchorRef, onClose, width, children }) {
  const [rect, setRect] = useSel(null);
  const ref = useSelRef(null);
  useSelLayout(() => { if (open && anchorRef.current) setRect(anchorRef.current.getBoundingClientRect()); }, [open]);
  useSelEffect(() => {
    if (!open) return;
    const reposition = () => anchorRef.current && setRect(anchorRef.current.getBoundingClientRect());
    const onDoc = (e) => { if (!ref.current?.contains(e.target) && !anchorRef.current?.contains(e.target)) onClose(); };
    const onEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onEsc);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => { document.removeEventListener('mousedown', onDoc); window.removeEventListener('keydown', onEsc); window.removeEventListener('resize', reposition); window.removeEventListener('scroll', reposition, true); };
  }, [open]);
  if (!open || !rect) return null;
  const maxBelow = window.innerHeight - rect.bottom - 16;
  return ReactDOM.createPortal(
    <div ref={ref} className="ui-menu ui-combo" style={{ position: 'fixed', top: rect.bottom + 6, left: rect.left, width: width || rect.width, zIndex: 330, maxHeight: Math.max(220, maxBelow) }}>
      {children}
    </div>, selPortal());
}

function ComboList({ q, setQ, items, onPick, activeIdx, setActiveIdx, isSel, searchPlaceholder, footer }) {
  const inputRef = useSelRef(null);
  useSelEffect(() => { setTimeout(() => inputRef.current?.focus(), 30); }, []);
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(items.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); items[activeIdx] && onPick(items[activeIdx]); }
  };
  return (
    <>
      <div className="ui-combo-search">
        <window.Icon.search /><input ref={inputRef} value={q} placeholder={searchPlaceholder || 'Search…'} onChange={e => { setQ(e.target.value); setActiveIdx(0); }} onKeyDown={onKey} />
      </div>
      <div className="ui-combo-list">
        {items.length === 0 && <div className="ui-combo-empty">No matches for “{q}”</div>}
        {items.map((o, i) => (
          <div key={o.value} className={cx('ui-combo-item', i === activeIdx && 'active')} onMouseEnter={() => setActiveIdx(i)} onClick={() => onPick(o)}>
            {o.swatch && <span style={{ width: 9, height: 9, borderRadius: 3, background: o.swatch, flexShrink: 0 }} />}
            <span>{o.label}</span>
            {isSel(o) && <window.Icon.check className="tick" />}
          </div>
        ))}
      </div>
      {footer}
    </>
  );
}

/* ---------------- Combobox (searchable single select) ---------------- */
function Combobox({ options = [], value, onChange, placeholder = 'Select…', searchPlaceholder, clearable }) {
  const opts = options.map(normOpt);
  const [open, setOpen] = useSel(false);
  const [q, setQ] = useSel('');
  const [active, setActive] = useSel(0);
  const anchor = useSelRef(null);
  const sel = opts.find(o => o.value === value);
  const items = opts.filter(o => o.label.toLowerCase().includes(q.toLowerCase()));
  const pick = (o) => { onChange?.(o.value); setOpen(false); setQ(''); };
  return (
    <>
      <button type="button" ref={anchor} className={cx('ui-trigger', open && 'open')} onClick={() => setOpen(o => !o)}>
        <span className={cx('val', !sel && 'ph')}>{sel ? sel.label : placeholder}</span>
        {clearable && sel && <span onClick={e => { e.stopPropagation(); onChange?.(null); }} style={{ display: 'grid', placeItems: 'center', color: 'var(--text-faint)' }}><window.Icon.x style={{ width: 14, height: 14 }} /></span>}
        <window.Icon.chevDown className="chev" />
      </button>
      <SelPanel open={open} anchorRef={anchor} onClose={() => setOpen(false)}>
        {open && <ComboList q={q} setQ={setQ} items={items} activeIdx={active} setActiveIdx={setActive} onPick={pick} isSel={o => o.value === value} searchPlaceholder={searchPlaceholder} />}
      </SelPanel>
    </>
  );
}

/* ---------------- MultiSelect (searchable, tagged) ---------------- */
function MultiSelect({ options = [], value = [], onChange, placeholder = 'Select…', searchPlaceholder, max }) {
  const opts = options.map(normOpt);
  const [open, setOpen] = useSel(false);
  const [q, setQ] = useSel('');
  const [active, setActive] = useSel(0);
  const anchor = useSelRef(null);
  const items = opts.filter(o => o.label.toLowerCase().includes(q.toLowerCase()));
  const has = (v) => value.includes(v);
  const toggle = (o) => {
    if (has(o.value)) onChange?.(value.filter(v => v !== o.value));
    else if (!max || value.length < max) onChange?.([...value, o.value]);
  };
  const selOpts = opts.filter(o => has(o.value));
  return (
    <>
      <div role="button" tabIndex={0} ref={anchor} className={cx('ui-trigger', open && 'open')} onClick={() => setOpen(o => !o)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o); } }} style={{ minHeight: 'var(--ctrl-h)' }}>
        {selOpts.length === 0
          ? <span className="val ph">{placeholder}</span>
          : <span className="tags">{selOpts.map(o => (
              <span key={o.value} className="ui-tag" onClick={e => e.stopPropagation()}>{o.label}<button onClick={() => onChange?.(value.filter(v => v !== o.value))}><window.Icon.x style={{ width: 11, height: 11 }} /></button></span>
            ))}</span>}
        <window.Icon.chevDown className="chev" />
      </div>
      <SelPanel open={open} anchorRef={anchor} onClose={() => setOpen(false)}>
        {open && <ComboList q={q} setQ={setQ} items={items} activeIdx={active} setActiveIdx={setActive} onPick={toggle} isSel={o => has(o.value)} searchPlaceholder={searchPlaceholder}
          footer={<div className="ui-combo-foot"><span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{value.length} selected{max ? ` / ${max}` : ''}</span><div style={{ flex: 1 }} />{value.length > 0 && <button className="btn btn-subtle btn-sm" onClick={() => onChange?.([])}>Clear</button>}</div>} />}
      </SelPanel>
    </>
  );
}

/* ---------------- TokenInput (creatable tags) ---------------- */
function TokenInput({ value = [], onChange, placeholder = 'Type and press Enter…' }) {
  const [draft, setDraft] = useSel('');
  const add = () => { const t = draft.trim(); if (t && !value.includes(t)) onChange?.([...value, t]); setDraft(''); };
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
    else if (e.key === 'Backspace' && !draft && value.length) onChange?.(value.slice(0, -1));
  };
  return (
    <div className="ui-trigger" style={{ cursor: 'text', flexWrap: 'wrap', alignItems: 'center', gap: 6, paddingTop: 5, paddingBottom: 5 }} onClick={e => e.currentTarget.querySelector('input')?.focus()}>
      {value.map(t => <span key={t} className="ui-tag" style={{ maxWidth: '100%' }}><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t}</span><button onClick={() => onChange?.(value.filter(v => v !== t))}><window.Icon.x style={{ width: 11, height: 11 }} /></button></span>)}
      <input value={draft} placeholder={value.length ? '' : placeholder} onChange={e => setDraft(e.target.value)} onKeyDown={onKey} onBlur={add}
        style={{ flex: '1 1 80px', minWidth: 80, border: 0, background: 'transparent', outline: 'none', font: 'inherit', fontSize: 13.5, color: 'var(--text)' }} />
    </div>
  );
}

Object.assign(window, { Combobox, MultiSelect, TokenInput, normOpt, Select });

/* ---------------- Select (themed drop-in for native <select>) ---------------- */
function Select({ options = [], value, defaultValue, onChange, placeholder = 'Select…', className, style, disabled, searchable }) {
  const opts = options.map(normOpt);
  const controlled = value !== undefined;
  const [internal, setInternal] = useSel(defaultValue);
  const cur = controlled ? value : (internal !== undefined ? internal : opts[0]?.value);
  const [open, setOpen] = useSel(false);
  const [q, setQ] = useSel('');
  const [active, setActive] = useSel(0);
  const anchor = useSelRef(null);
  const sel = opts.find(o => String(o.value) === String(cur));
  const useSearch = searchable != null ? searchable : opts.length >= 8;
  const items = useSearch ? opts.filter(o => o.label.toLowerCase().includes(q.toLowerCase())) : opts;
  const choose = (o) => { if (!controlled) setInternal(o.value); onChange?.({ target: { value: o.value } }); setOpen(false); setQ(''); };
  return (
    <>
      <button type="button" ref={anchor} disabled={disabled} className={cx('ui-selectbtn', open && 'open', className)} style={style} onClick={() => setOpen(o => !o)}>
        <span className={cx('val', !sel && 'ph')}>{sel ? sel.label : placeholder}</span>
      </button>
      <SelPanel open={open} anchorRef={anchor} onClose={() => setOpen(false)}>
        {open && (useSearch
          ? <ComboList q={q} setQ={setQ} items={items} activeIdx={active} setActiveIdx={setActive} onPick={choose} isSel={o => String(o.value) === String(cur)} />
          : <div className="ui-combo-list">{items.length === 0 ? <div className="ui-combo-empty">No options</div> : items.map(o => (
              <div key={o.value} className={cx('ui-combo-item', String(o.value) === String(cur) && 'active')} onClick={() => choose(o)}>
                {o.swatch && <span style={{ width: 9, height: 9, borderRadius: 3, background: o.swatch, flexShrink: 0 }} />}
                <span>{o.label}</span>{String(o.value) === String(cur) && <window.Icon.check className="tick" />}
              </div>
            ))}</div>)}
      </SelPanel>
    </>
  );
}
Object.assign(window, { Select });
