// vespera-blocks.jsx — composed operational blocks (tables, ops, monitoring).
// Composed from Vespera primitives. Each block is drop-in for an admin surface.
const { useState: useB, useMemo: useBMemo, useRef: useBRef, useEffect: useBEffect } = React;

/* ---------- shared block frame ---------- */
function Block({ title, desc, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      {title && <div style={{ marginBottom: 14 }}><div className="dx-h3">{title}</div>{desc && <div className="dx-demo-desc" style={{ fontSize: 13, marginTop: 3 }}>{desc}</div>}</div>}
      <div className="dx-block">{children}</div>
    </div>
  );
}

/* ===================== ORDERS / OPERATIONS TABLE ===================== */
const ORDERS = (() => {
  const rng = (() => { let s = 11; return () => (s = (s * 9301 + 49297) % 233280) / 233280; })();
  const states = ['fulfilled', 'processing', 'pending', 'refunded'];
  const items = ['Annual license', 'Seat add-on', 'API overage', 'Pro upgrade', 'Support plan', 'Onboarding'];
  return Array.from({ length: 8 }, (_, i) => ({
    id: 'ORD-' + (90210 + i),
    customer: window.CUSTOMERS[i % window.CUSTOMERS.length],
    item: items[Math.floor(rng() * items.length)],
    amount: Math.round((rng() * 4000 + 120) / 10) * 10,
    state: states[Math.floor(rng() * states.length)],
    date: `Jun ${Math.floor(rng() * 9) + 1}, 2026`,
  }));
})();
const ORDER_TONE = { fulfilled: 'pos', processing: 'info', pending: 'warn', refunded: 'neg' };

function OrdersBlock() {
  const [tab, setTab] = useB('all');
  const [sel, setSel] = useB(() => new Set());
  const rows = ORDERS.filter(o => tab === 'all' || o.state === tab);
  const allSel = rows.length && rows.every(r => sel.has(r.id));
  const toggleAll = () => setSel(s => { const n = new Set(s); allSel ? rows.forEach(r => n.delete(r.id)) : rows.forEach(r => n.add(r.id)); return n; });
  const toggle = (id) => setSel(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <Block title="Orders" desc="Operational table with tab filters, bulk selection, inline status and a row action menu.">
      <div className="dx-block-bar">
        <Tabs value={tab} onChange={setTab} tabs={[
          { value: 'all', label: 'All', count: ORDERS.length },
          { value: 'processing', label: 'Processing' },
          { value: 'pending', label: 'Pending' },
          { value: 'refunded', label: 'Refunded' },
        ]} />
        <div style={{ flex: 1 }} />
        {sel.size > 0
          ? <><Badge tone="info">{sel.size} selected</Badge><Button variant="ghost" size="sm" leadingIcon="download">Export</Button><Button variant="ghost" size="sm" leadingIcon="check">Fulfill</Button></>
          : <><Button variant="ghost" size="sm" leadingIcon="filter">Filter</Button><Button variant="primary" size="sm" leadingIcon="plus">New order</Button></>}
      </div>
      <div className="dx-block-body flush" style={{ overflowX: 'auto' }}>
        <table className="ui-table" style={{ minWidth: 720 }}>
          <thead><tr>
            <th style={{ width: 44 }}><span className="ui-check-wrap"><span className={cx('ui-check', allSel && 'on')} onClick={toggleAll}><Icon.check /></span></span></th>
            <th><span className="eyebrow">Order</span></th><th><span className="eyebrow">Customer</span></th>
            <th><span className="eyebrow">Item</span></th><th><span className="eyebrow">Status</span></th>
            <th style={{ textAlign: 'right' }}><span className="eyebrow">Amount</span></th><th style={{ width: 44 }}></th>
          </tr></thead>
          <tbody>
            {rows.map(o => (
              <tr key={o.id} style={{ background: sel.has(o.id) ? 'color-mix(in oklab, var(--accent) 7%, transparent)' : undefined }}>
                <td><span className={cx('ui-check', sel.has(o.id) && 'on')} onClick={() => toggle(o.id)}><Icon.check /></span></td>
                <td className="mono" style={{ fontWeight: 600 }}>{o.id}</td>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Av name={o.customer.name} hue={o.customer.hue} size={28} /><span style={{ fontWeight: 500 }}>{o.customer.company}</span></div></td>
                <td style={{ color: 'var(--text-dim)' }}>{o.item}</td>
                <td><Badge tone={ORDER_TONE[o.state]} dot>{o.state}</Badge></td>
                <td style={{ textAlign: 'right', fontWeight: 700 }} className="tnum">${o.amount.toLocaleString()}</td>
                <td><DropdownMenu trigger={<button className="vsp-icon-btn" style={{ width: 30, height: 30, border: 0, background: 'transparent' }}><Icon.more /></button>}
                  items={[{ label: 'View order', icon: 'eye' }, { label: 'Refund', icon: 'refresh' }, { sep: true }, { label: 'Cancel', icon: 'x', danger: true }]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Block>
  );
}

/* ===================== TEAM / ROLES & PERMISSIONS ===================== */
function TeamRolesBlock() {
  const seed = [['Avery Quinn', 'avery@vespera.dev', 250, 'Owner'], ['Maya Okafor', 'maya@northwind.com', 220, 'Admin'], ['Leo Vega', 'leo@halcyon.com', 150, 'Editor'], ['Noor Haddad', 'noor@beacon.com', 40, 'Viewer']];
  const [members, setMembers] = useB(seed.map((m, i) => ({ id: i, name: m[0], email: m[1], hue: m[2], role: m[3] })));
  return (
    <Block title="Team &amp; roles" desc="Manage members and permissions with inline role selects.">
      <div className="dx-block-bar"><Icon.users style={{ width: 17, height: 17, color: 'var(--accent)' }} /><b style={{ fontSize: 13.5 }}>Members</b><Badge tone="muted">{members.length}</Badge><div style={{ flex: 1 }} /><Button variant="primary" size="sm" leadingIcon="mail">Invite</Button></div>
      <div className="dx-block-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
        {members.map(m => (
          <div key={m.id} className="ui-row">
            <Av name={m.name} hue={m.hue} size={38} />
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.name}</div><div className="mono" style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>{m.email}</div></div>
            {m.role === 'Owner'
              ? <Badge tone="info">Owner</Badge>
              : <Select style={{ width: 130, height: 34 }} value={m.role} onChange={e => setMembers(x => x.map(y => y.id === m.id ? { ...y, role: e.target.value } : y))} options={['Admin', 'Editor', 'Viewer']} />}
            <DropdownMenu trigger={<button className="vsp-icon-btn" style={{ width: 32, height: 32 }}><Icon.more /></button>}
              items={[{ label: 'Resend invite', icon: 'mail' }, { label: 'Transfer ownership', icon: 'shield' }, { sep: true }, { label: 'Remove', icon: 'x', danger: true }]} />
          </div>
        ))}
      </div>
    </Block>
  );
}

/* ===================== SYSTEM STATUS / HEALTH ===================== */
function SystemStatusBlock() {
  const svc = [['API gateway', 'operational', 99.98], ['Database', 'operational', 99.95], ['Webhooks', 'degraded', 98.20], ['Auth service', 'operational', 100], ['Billing', 'maintenance', 99.80]];
  const tone = { operational: 'pos', degraded: 'warn', maintenance: 'info', down: 'neg' };
  return (
    <Block title="System status" desc="Live service health with 30-day uptime bars.">
      <div className="dx-block-bar"><span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} /><b style={{ fontSize: 13.5 }}>All systems operational</b><div style={{ flex: 1 }} /><span className="eyebrow">Updated 30s ago</span></div>
      <div className="dx-block-body" style={{ paddingTop: 4, paddingBottom: 8 }}>
        {svc.map(([name, st, up]) => (
          <div key={name} className="ui-row" style={{ alignItems: 'center' }}>
            <div style={{ width: 150, flexShrink: 0 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{name}</div></div>
            <div style={{ flex: 1, display: 'flex', gap: 2, alignItems: 'flex-end', height: 26 }}>
              {Array.from({ length: 44 }).map((_, i) => {
                const bad = (st === 'degraded' && i > 38 && i < 42) || (st === 'maintenance' && i === 43);
                return <span key={i} style={{ flex: 1, height: bad ? '60%' : '100%', borderRadius: 2, background: bad ? (st === 'degraded' ? 'var(--warning)' : 'var(--accent)') : 'color-mix(in oklab, var(--success) 70%, transparent)' }} />;
              })}
            </div>
            <span className="mono tnum" style={{ width: 56, textAlign: 'right', fontSize: 12, color: 'var(--text-dim)' }}>{up}%</span>
            <Badge tone={tone[st]} dot>{st}</Badge>
          </div>
        ))}
      </div>
    </Block>
  );
}

/* ===================== API KEYS ===================== */
function ApiKeysBlock() {
  const [keys, setKeys] = useB([
    { id: 1, name: 'Production', token: 'aeth_live_8f2a…d91c', created: 'Jan 14, 2026', last: '2m ago', reveal: false },
    { id: 2, name: 'Staging', token: 'aeth_test_4b7e…02fa', created: 'Mar 02, 2026', last: '3d ago', reveal: false },
    { id: 3, name: 'CI / CD', token: 'aeth_live_19cc…7a4b', created: 'Apr 21, 2026', last: '12h ago', reveal: false },
  ]);
  return (
    <Block title="API keys" desc="Reveal, copy, and revoke credentials. Secrets stay masked by default.">
      <div className="dx-block-bar"><Icon.bolt style={{ width: 17, height: 17, color: 'var(--accent)' }} /><b style={{ fontSize: 13.5 }}>Secret keys</b><div style={{ flex: 1 }} /><Button variant="primary" size="sm" leadingIcon="plus" onClick={() => window.toast?.({ tone: 'pos', title: 'API key created' })}>Create key</Button></div>
      <div className="dx-block-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
        {keys.map(k => (
          <div key={k.id} className="ui-row">
            <div style={{ minWidth: 96 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{k.name}</div><div className="eyebrow" style={{ marginTop: 2 }}>{k.created}</div></div>
            <code className="mono" style={{ flex: 1, fontSize: 12.5, color: 'var(--text-dim)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '7px 11px', letterSpacing: '.02em' }}>
              {k.reveal ? 'aeth_live_8f2a39c4e7b1d91c' : k.token}
            </code>
            <Tooltip label={k.reveal ? 'Hide' : 'Reveal'}><button className="vsp-icon-btn" style={{ width: 34, height: 34 }} onClick={() => setKeys(x => x.map(y => y.id === k.id ? { ...y, reveal: !y.reveal } : y))}><Icon.eye /></button></Tooltip>
            <Tooltip label="Copy"><button className="vsp-icon-btn" style={{ width: 34, height: 34 }} onClick={() => window.toast?.({ title: 'Copied to clipboard' })}><Icon.doc /></button></Tooltip>
            <span className="eyebrow" style={{ width: 66, textAlign: 'right' }}>{k.last}</span>
            <Button variant="subtle" size="sm" onClick={() => { setKeys(x => x.filter(y => y.id !== k.id)); window.toast?.({ tone: 'neg', title: 'Key revoked' }); }}>Revoke</Button>
          </div>
        ))}
      </div>
    </Block>
  );
}

/* ===================== AUDIT LOG ===================== */
function AuditLogBlock() {
  const log = [
    { who: 'Avery Quinn', hue: 250, act: 'updated billing settings', tag: 'Settings', time: '2 min ago', icon: 'settings' },
    { who: 'Maya Okafor', hue: 220, act: 'upgraded to Enterprise', tag: 'Billing', time: '38 min ago', icon: 'arrowUp' },
    { who: 'System', hue: 40, act: 'rotated production API key', tag: 'Security', time: '1 hr ago', icon: 'shield' },
    { who: 'Leo Vega', hue: 150, act: 'invited 4 members', tag: 'Team', time: '3 hr ago', icon: 'users' },
    { who: 'Billing', hue: 0, act: 'flagged failed payment · Cobalt', tag: 'Billing', time: '5 hr ago', icon: 'bell' },
  ];
  return (
    <Block title="Audit log" desc="A chronological trail of every privileged action.">
      <div className="dx-block-bar"><Icon.clock style={{ width: 17, height: 17, color: 'var(--accent)' }} /><b style={{ fontSize: 13.5 }}>Recent activity</b><div style={{ flex: 1 }} /><Button variant="ghost" size="sm" leadingIcon="download">Export log</Button></div>
      <div className="dx-block-body">
        <div style={{ position: 'relative', paddingLeft: 8 }}>
          {log.map((e, i) => { const I = Icon[e.icon]; return (
            <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: i < log.length - 1 ? 20 : 0, position: 'relative' }}>
              {i < log.length - 1 && <span style={{ position: 'absolute', left: 15, top: 32, bottom: 0, width: 1.5, background: 'var(--border)' }} />}
              <span style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-dim)', zIndex: 1 }}><I style={{ width: 15, height: 15 }} /></span>
              <div style={{ flex: 1, paddingTop: 5 }}>
                <div style={{ fontSize: 13.5 }}><b style={{ fontWeight: 700 }}>{e.who}</b> <span style={{ color: 'var(--text-dim)' }}>{e.act}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}><Badge tone="muted">{e.tag}</Badge><span className="eyebrow">{e.time}</span></div>
              </div>
            </div>
          ); })}
        </div>
      </div>
    </Block>
  );
}

/* ===================== KANBAN / OPS BOARD ===================== */
const KANBAN_INIT = [
  { name: 'Triage', tone: 'var(--text-faint)', cards: [{ id: 'k1', t: 'Cobalt payment failed', tag: 'Billing', tone: 'neg' }, { id: 'k2', t: 'Verify SSO config', tag: 'Security', tone: 'warn' }] },
  { name: 'In progress', tone: 'var(--accent)', cards: [{ id: 'k3', t: 'Migrate Halcyon seats', tag: 'Accounts', tone: 'info' }, { id: 'k4', t: 'Q2 expansion review', tag: 'Revenue', tone: 'info' }, { id: 'k5', t: 'Webhook retry logic', tag: 'Product', tone: 'warn' }] },
  { name: 'Done', tone: 'var(--success)', cards: [{ id: 'k6', t: 'Ship usage billing', tag: 'Product', tone: 'pos' }, { id: 'k7', t: 'Reconcile invoices', tag: 'Finance', tone: 'pos' }] },
];
function KanbanBlock() {
  const [cols, setCols] = useB(KANBAN_INIT);
  const [drag, setDrag] = useB(null);          // { card, from, w, offX, offY }
  const [pt, setPt] = useB({ x: 0, y: 0 });
  const [target, setTarget] = useB(null);       // { col, index }
  const colRefs = useBRef([]);
  const dragRef = useBRef(null), targetRef = useBRef(null);

  const startDrag = (e, card, ci) => {
    if (e.button != null && e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const origIndex = cols[ci].cards.findIndex(c => c.id === card.id);
    const d = { card, from: ci, origIndex, w: rect.width, offX: e.clientX - rect.left, offY: e.clientY - rect.top };
    const home = { col: ci, index: origIndex };
    dragRef.current = d; targetRef.current = home;
    setDrag(d); setPt({ x: e.clientX, y: e.clientY }); setTarget(home);
    e.preventDefault();
  };

  useBEffect(() => {
    if (!drag) return;
    document.body.style.userSelect = 'none'; document.body.style.cursor = 'grabbing';
    const move = (e) => {
      setPt({ x: e.clientX, y: e.clientY });
      let found = null;
      colRefs.current.forEach((el, ci) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top - 60 && e.clientY <= r.bottom + 80) {
          const cards = [].slice.call(el.querySelectorAll('[data-kcard]'));
          let idx = cards.length;
          for (let i = 0; i < cards.length; i++) { const cr = cards[i].getBoundingClientRect(); if (e.clientY < cr.top + cr.height / 2) { idx = i; break; } }
          found = { col: ci, index: idx };
        }
      });
      // never vacate the original slot until released over a real position — fall back home
      if (!found) found = { col: drag.from, index: drag.origIndex };
      targetRef.current = found; setTarget(found);
    };
    const up = () => {
      const d = dragRef.current, tg = targetRef.current;
      if (d && tg) {
        setCols(cs => {
          const next = cs.map(c => ({ ...c, cards: c.cards.filter(x => x.id !== d.card.id) }));
          next[tg.col].cards.splice(tg.index, 0, d.card);
          return next;
        });
      }
      dragRef.current = null; targetRef.current = null;
      setDrag(null); setTarget(null);
      document.body.style.userSelect = ''; document.body.style.cursor = '';
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); document.body.style.userSelect = ''; document.body.style.cursor = ''; };
  }, [drag]);

  const Card = ({ card, ci }) => (
    <div data-kcard className="card card-pad" onPointerDown={e => startDrag(e, card, ci)}
      style={{ padding: 13, cursor: 'grab', touchAction: 'none' }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 9, lineHeight: 1.4 }}>{card.t}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Badge tone={card.tone}>{card.tag}</Badge><Av name="A Q" hue={250} size={22} /></div>
    </div>
  );
  const Placeholder = () => <div style={{ border: '1.6px dashed color-mix(in oklab, var(--accent) 50%, var(--border))', background: 'color-mix(in oklab, var(--accent) 8%, transparent)', borderRadius: 'var(--r-md)', height: 56 }} />;

  return (
    <Block title="Operations board" desc="A lightweight kanban — drag a card to reorder it or move it between columns.">
      <div className="dx-block-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {cols.map((col, ci) => {
          const items = col.cards.filter(c => !(drag && c.id === drag.card.id));
          const showPh = drag && target && target.col === ci;
          return (
            <div key={col.name} ref={el => colRefs.current[ci] = el}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '0 2px' }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: col.tone }} /><b style={{ fontSize: 12.5 }}>{col.name}</b><span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{col.cards.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 64 }}>
                {items.map((card, i) => (
                  <React.Fragment key={card.id}>
                    {showPh && target.index === i && <Placeholder />}
                    <Card card={card} ci={ci} />
                  </React.Fragment>
                ))}
                {showPh && target.index >= items.length && <Placeholder />}
                {items.length === 0 && !showPh && <div style={{ border: '1.5px dashed var(--border)', borderRadius: 'var(--r-sm)', padding: '18px 0', textAlign: 'center', fontSize: 12, color: 'var(--text-faint)' }}>Drop here</div>}
              </div>
            </div>
          );
        })}
      </div>
      {drag && ReactDOM.createPortal(
        <div style={{ position: 'fixed', left: pt.x - drag.offX, top: pt.y - drag.offY, width: drag.w, zIndex: 600, pointerEvents: 'none', transform: 'rotate(2.5deg) scale(1.03)', opacity: 0.96 }}>
          <div className="card card-pad" style={{ padding: 13, boxShadow: 'var(--shadow-lg)', borderColor: 'color-mix(in oklab, var(--accent) 40%, var(--border))' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 9, lineHeight: 1.4 }}>{drag.card.t}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Badge tone={drag.card.tone}>{drag.card.tag}</Badge><Av name="A Q" hue={250} size={22} /></div>
          </div>
        </div>, document.querySelector('.vsp-root') || document.body)}
    </Block>
  );
}

Object.assign(window, { Block, OrdersBlock, TeamRolesBlock, SystemStatusBlock, ApiKeysBlock, AuditLogBlock, KanbanBlock });
