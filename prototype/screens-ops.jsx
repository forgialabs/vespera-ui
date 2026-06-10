// screens-ops.jsx — business ops pages: Approvals, Audit & restore, Insights, Notifications.
// Uses window primitives (Button, Badge, Dialog, Sheet, Av, Icon, toast, etc.).
const { useState: useOps } = React;

function OpsHead({ title, desc, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 'var(--gap)', flexWrap: 'wrap' }}>
      <div style={{ minWidth: 0 }}>
        <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, letterSpacing: '-.02em' }}>{title}</h2>
        {desc && <p style={{ margin: '5px 0 0', color: 'var(--text-dim)', fontSize: 13.5, maxWidth: 560, lineHeight: 1.5 }}>{desc}</p>}
      </div>
      <div style={{ flex: 1 }} />
      {right}
    </div>
  );
}

/* ============================= APPROVALS ============================= */
const APPROVALS = [
  { id: 'REQ-2041', type: 'Plan change', who: 'Maya Okafor', co: 'Northwind', hue: 220, detail: 'Upgrade to Enterprise — +$1,400/mo', amount: 1400, risk: 'low', age: '12m', sla: 'Due in 4h' },
  { id: 'REQ-2040', type: 'Refund', who: 'Diego Moreau', co: 'Cobalt', hue: 12, detail: 'Refund duplicate June invoice', amount: 2280, risk: 'med', age: '38m', sla: 'Due in 2h' },
  { id: 'REQ-2039', type: 'Access', who: 'Leo Vega', co: 'Halcyon', hue: 150, detail: 'Admin role for 2 new members', amount: 0, risk: 'med', age: '1h', sla: 'Due today' },
  { id: 'REQ-2038', type: 'Discount', who: 'Saanvi Iyer', co: 'Vertex AI', hue: 285, detail: '15% annual discount approval', amount: 4320, risk: 'high', age: '3h', sla: 'Overdue' },
  { id: 'REQ-2037', type: 'Seat add-on', who: 'Theo Novak', co: 'Beacon', hue: 40, detail: '+24 seats provisioning', amount: 960, risk: 'low', age: '5h', sla: 'Due tomorrow' },
];
const RISK = { low: 'pos', med: 'warn', high: 'neg' };

function ApprovalsScreen() {
  const [tab, setTab] = useOps('pending');
  const [items, setItems] = useOps(APPROVALS);
  const [active, setActive] = useOps(null);
  const decide = (id, ok) => {
    setItems(x => x.filter(i => i.id !== id)); setActive(null);
    window.toast?.({ tone: ok ? 'pos' : 'neg', title: ok ? 'Request approved' : 'Request rejected', body: id });
  };
  return (
    <div className="ag-content-inner">
      <OpsHead title="Approvals" desc="Requests routed to you for sign-off, with risk scoring and SLA timers."
        right={<><Button variant="ghost" size="sm" leadingIcon="filter">Filter</Button><Button variant="ghost" size="sm" leadingIcon="checkCircle" onClick={() => { setItems([]); window.toast?.({ tone: 'pos', title: 'Queue cleared' }); }}>Approve all low-risk</Button></>} />

      <div className="grid stat-grid" style={{ marginBottom: 'var(--gap)' }}>
        <MiniKpi icon="inbox" label="Pending" value={String(items.length)} tone="var(--accent)" />
        <MiniKpi icon="clock" label="Overdue" value="1" tone="var(--danger)" />
        <MiniKpi icon="dollar" label="Value at stake" value="$9.0k" tone="var(--warning)" />
        <MiniKpi icon="checkCircle" label="Approved today" value="14" tone="var(--success)" />
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-head" style={{ padding: '10px var(--pad)' }}>
          <Tabs value={tab} onChange={setTab} tabs={[{ value: 'pending', label: 'Pending', count: items.length }, { value: 'mine', label: 'Awaiting others' }, { value: 'done', label: 'Resolved' }]} />
        </div>
        {items.length === 0
          ? <div style={{ padding: '56px 24px', textAlign: 'center', color: 'var(--text-faint)' }}><Icon.checkCircle style={{ width: 30, height: 30, margin: '0 auto 12px', color: 'var(--success)' }} /><div style={{ fontWeight: 600, color: 'var(--text)' }}>All caught up</div><div style={{ fontSize: 13, marginTop: 4 }}>No requests waiting on you.</div></div>
          : items.map((r, i) => (
            <div key={r.id} className="ag-trow" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 'var(--row-py) var(--pad)', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 0, cursor: 'pointer' }} onClick={() => setActive(r)}>
              <Av name={r.who} hue={r.hue} size={36} />
              <div style={{ width: 150, flexShrink: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.who}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{r.co}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Badge tone="muted">{r.type}</Badge><Badge tone={RISK[r.risk]} dot>{r.risk} risk</Badge></div>
                <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 5 }}>{r.detail}</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 90 }}>
                <div className="mono" style={{ fontSize: 11, color: r.sla === 'Overdue' ? 'var(--danger)' : 'var(--text-faint)' }}>{r.sla}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                <button className="ag-icon-btn" title="Reject" style={{ width: 34, height: 34 }} onClick={() => decide(r.id, false)}><Icon.x /></button>
                <Button variant="primary" size="sm" onClick={() => decide(r.id, true)}>Approve</Button>
              </div>
            </div>
          ))}
      </div>

      <Sheet open={!!active} onClose={() => setActive(null)} icon="checkCircle" title={active?.type} desc={active ? `${active.id} · ${active.co}` : ''}
        footer={active && <><Button variant="ghost" size="sm" style={{ flex: 1 }} onClick={() => decide(active.id, false)}>Reject</Button><Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => decide(active.id, true)}>Approve</Button></>}>
        {active && <div style={{ display: 'grid', gap: 16 }}>
          <Alert tone={RISK[active.risk] === 'neg' ? 'warn' : 'info'} title={`${active.risk[0].toUpperCase()}${active.risk.slice(1)} risk`}>{active.detail}</Alert>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><Av name={active.who} hue={active.hue} size={40} /><div><div style={{ fontWeight: 600 }}>{active.who}</div><div className="mono" style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>Requested {active.age} ago</div></div></div>
          {[['Request ID', active.id], ['Type', active.type], ['Value', active.amount ? `$${active.amount.toLocaleString()}` : '—'], ['SLA', active.sla]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 11 }}><span className="eyebrow">{k}</span><span className="mono" style={{ fontSize: 12.5, fontWeight: 500 }}>{v}</span></div>
          ))}
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Approval chain</div>
            {[['Requester', active.who, 'done'], ['Finance review', 'Auto-approved', 'done'], ['Your approval', 'Pending', 'active']].map(([role, name, st], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0, background: st === 'done' ? 'var(--success)' : 'color-mix(in oklab, var(--accent) 18%, transparent)', color: st === 'done' ? '#fff' : 'var(--accent)' }}>{st === 'done' ? <Icon.check style={{ width: 12, height: 12 }} /> : <Icon.clock style={{ width: 12, height: 12 }} />}</span>
                <span style={{ fontSize: 13, fontWeight: 600, width: 120 }}>{role}</span>
                <span style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>}
      </Sheet>
    </div>
  );
}

function MiniKpi({ icon, label, value, tone }) {
  const I = Icon[icon];
  return (
    <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
      <span style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', flexShrink: 0, background: `color-mix(in oklab, ${tone} 14%, transparent)`, color: tone }}><I style={{ width: 19, height: 19 }} /></span>
      <div><div className="eyebrow">{label}</div><div className="tnum" style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>{value}</div></div>
    </div>
  );
}

Object.assign(window, { OpsHead, MiniKpi, ApprovalsScreen });
