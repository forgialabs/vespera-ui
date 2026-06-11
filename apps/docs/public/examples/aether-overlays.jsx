// aether-overlays.jsx — Dialog, Sheet, Popover, DropdownMenu, Toast, CommandPalette.
// Depends on window.Icon, aether-ui.jsx (cx), ui.css.
const { useState: useOv, useRef: useOvRef, useEffect: useOvEffect, useCallback, useLayoutEffect } = React;
// Portal into .ag-root so overlays inherit theme tokens (--surface-1, --text, etc.).
const agPortal = () => document.querySelector('.ag-root') || document.body;

function useEsc(open, onClose) {
  useOvEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
}

/* ---------------- Dialog ---------------- */
function Dialog({ open, onClose, title, desc, children, footer, maxWidth = 460, icon, tone }) {
  useEsc(open, onClose);
  if (!open) return null;
  const I = icon && window.Icon[icon];
  const toneColor = tone ? { pos: 'var(--success)', neg: 'var(--danger)', warn: 'var(--warning)', info: 'var(--accent)' }[tone] : null;
  return ReactDOM.createPortal(
    <div className="ui-overlay" onMouseDown={e => e.target === e.currentTarget && onClose?.()}>
      <div className="ui-dialog" style={{ maxWidth }} role="dialog" aria-modal="true">
        <div className="ui-dialog-head">
          {I && <span style={{ width: 42, height: 42, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', marginBottom: 14, background: `color-mix(in oklab, ${toneColor || 'var(--accent)'} 13%, transparent)`, color: toneColor || 'var(--accent)' }}><I style={{ width: 21, height: 21 }} /></span>}
          <div className="ui-dialog-title">{title}</div>
          {desc && <div className="ui-dialog-desc">{desc}</div>}
        </div>
        {children && <div className="ui-dialog-body">{children}</div>}
        {footer && <div className="ui-dialog-foot">{footer}</div>}
      </div>
    </div>, agPortal());
}

/* ---------------- Sheet / Drawer ---------------- */
function Sheet({ open, onClose, title, desc, children, footer, icon }) {
  useEsc(open, onClose);
  if (!open) return null;
  const I = icon && window.Icon[icon];
  return ReactDOM.createPortal(
    <div className="ui-overlay" onMouseDown={e => e.target === e.currentTarget && onClose?.()}>
      <div className="ui-sheet" role="dialog" aria-modal="true">
        <div className="ui-sheet-head">
          {I && <span style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', background: 'color-mix(in oklab, var(--accent) 13%, transparent)', color: 'var(--accent)', flexShrink: 0 }}><I style={{ width: 19, height: 19 }} /></span>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.01em' }}>{title}</div>
            {desc && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 3 }}>{desc}</div>}
          </div>
          <button className="ag-icon-btn" style={{ border: 0, background: 'transparent', width: 32, height: 32 }} onClick={onClose}><window.Icon.x /></button>
        </div>
        <div className="ui-sheet-body ag-scroll">{children}</div>
        {footer && <div className="ui-sheet-foot">{footer}</div>}
      </div>
    </div>, agPortal());
}

/* ---------------- anchored layer (popover/menu base) ---------------- */
function Anchored({ trigger, children, align = 'start', width, className = 'ui-menu' }) {
  const [open, setOpen] = useOv(false);
  const [rect, setRect] = useOv(null);
  const triggerRef = useOvRef(null);
  const layerRef = useOvRef(null);
  const place = useCallback(() => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
  }, []);
  useLayoutEffect(() => { if (open) place(); }, [open, place]);
  useOvEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (!layerRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) setOpen(false); };
    const onScroll = () => place();
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onEsc);
    window.addEventListener('resize', onScroll);
    document.querySelector('.ag-content')?.addEventListener('scroll', onScroll, true);
    return () => { document.removeEventListener('mousedown', onDoc); window.removeEventListener('keydown', onEsc); window.removeEventListener('resize', onScroll); document.querySelector('.ag-content')?.removeEventListener('scroll', onScroll, true); };
  }, [open, place]);
  let style = {};
  if (rect) {
    const top = rect.bottom + 6;
    style = { position: 'fixed', top, minWidth: width || rect.width, zIndex: 320 };
    if (align === 'end') style.right = window.innerWidth - rect.right; else style.left = rect.left;
  }
  return (
    <>
      <span ref={triggerRef} onClick={() => setOpen(o => !o)} style={{ display: 'inline-flex' }}>{trigger}</span>
      {open && rect && ReactDOM.createPortal(
        <div ref={layerRef} className={className} style={style}>
          {typeof children === 'function' ? children(() => setOpen(false)) : children}
        </div>, agPortal())}
    </>
  );
}

/* ---------------- DropdownMenu ---------------- */
function DropdownMenu({ trigger, items, align = 'end', width }) {
  return (
    <Anchored trigger={trigger} align={align} width={width}>
      {(close) => items.map((it, i) => {
        if (it.sep) return <div key={i} className="ui-menu-sep" />;
        if (it.label && it.heading) return <div key={i} className="ui-menu-label">{it.label}</div>;
        const I = it.icon && window.Icon[it.icon];
        return (
          <button key={i} className={cx('ui-menu-item', it.danger && 'danger')} onClick={() => { it.onClick?.(); close(); }}>
            {I && <I />}{it.label}{it.kbd && <kbd className="ui-kbd">{it.kbd}</kbd>}
          </button>
        );
      })}
    </Anchored>
  );
}

/* ---------------- Popover ---------------- */
function Popover({ trigger, children, align = 'start', width = 260 }) {
  return <Anchored trigger={trigger} align={align} width={width} className="ui-popover">{children}</Anchored>;
}

/* ---------------- Toast (global singleton) ---------------- */
function ToastHost() {
  const [toasts, setToasts] = useOv([]);
  useOvEffect(() => {
    window.toast = (opts) => {
      const id = Math.random().toString(36).slice(2);
      setToasts(t => [...t, { id, tone: 'info', ...(typeof opts === 'string' ? { title: opts } : opts) }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), opts.duration || 3600);
    };
  }, []);
  const map = { pos: 'checkCircle', neg: 'x', warn: 'bell', info: 'sparkle' };
  return ReactDOM.createPortal(
    <div className="ui-toast-region">
      {toasts.map(t => {
        const I = window.Icon[t.icon || map[t.tone]];
        return (
          <div key={t.id} className={cx('ui-toast', t.tone)}>
            <I />
            <div style={{ flex: 1 }}>
              <div className="ui-toast-title">{t.title}</div>
              {t.body && <div className="ui-toast-body">{t.body}</div>}
            </div>
            <button className="ag-icon-btn" style={{ border: 0, background: 'transparent', width: 26, height: 26 }} onClick={() => setToasts(x => x.filter(y => y.id !== t.id))}><window.Icon.x style={{ width: 15, height: 15 }} /></button>
          </div>
        );
      })}
    </div>, agPortal());
}

/* ---------------- CommandPalette / Quick actions ---------------- */
function CommandPalette({ open, onClose, groups }) {
  const [q, setQ] = useOv('');
  const [active, setActive] = useOv(0);
  const inputRef = useOvRef(null);
  useEsc(open, onClose);
  useOvEffect(() => { if (open) { setQ(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);

  const flat = [];
  groups.forEach(g => g.items.forEach(it => {
    if (!q || (it.label + ' ' + (it.meta || '') + ' ' + (it.keywords || '')).toLowerCase().includes(q.toLowerCase())) flat.push({ ...it, group: g.label });
  }));
  const byGroup = {};
  flat.forEach((it, idx) => { (byGroup[it.group] = byGroup[it.group] || []).push({ ...it, idx }); });

  const run = (it) => { it?.onRun?.(); onClose?.(); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(flat.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(flat[active]); }
  };
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="ui-overlay ui-cmd-wrap" onMouseDown={e => e.target === e.currentTarget && onClose?.()}>
      <div className="ui-cmd" role="dialog" aria-modal="true">
        <div className="ui-cmd-input">
          <window.Icon.search />
          <input ref={inputRef} value={q} placeholder="Type a command or search…"
            onChange={e => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey} />
          <kbd className="ui-kbd">ESC</kbd>
        </div>
        <div className="ui-cmd-list ag-scroll">
          {flat.length === 0 && <div style={{ padding: '28px 12px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>No results for “{q}”</div>}
          {Object.entries(byGroup).map(([g, items]) => (
            <div key={g}>
              <div className="ui-cmd-group">{g}</div>
              {items.map(it => {
                const I = it.icon && window.Icon[it.icon];
                return (
                  <div key={it.idx} className={cx('ui-cmd-item', it.idx === active && 'active')}
                    onMouseEnter={() => setActive(it.idx)} onClick={() => run(it)}>
                    {I && <I />}<span>{it.label}</span>{it.meta && <span className="ui-cmd-meta">{it.meta}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="ui-cmd-foot">
          <span className="k"><kbd className="ui-kbd">↑</kbd><kbd className="ui-kbd">↓</kbd> navigate</span>
          <span className="k"><kbd className="ui-kbd">↵</kbd> select</span>
          <span className="k" style={{ marginLeft: 'auto' }}>Vespera Command</span>
        </div>
      </div>
    </div>, agPortal());
}

/* hook: ⌘K / Ctrl+K to toggle */
function useCmdK(setOpen) {
  useOvEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(o => !o); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [setOpen]);
}

Object.assign(window, { Dialog, Sheet, Anchored, DropdownMenu, Popover, ToastHost, CommandPalette, useCmdK, useEsc });
