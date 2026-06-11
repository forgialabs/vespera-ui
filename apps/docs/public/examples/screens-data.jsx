// screens-data.jsx — Data table (list) + record detail. Depends on components + data.
const { useState: useStateD, useMemo } = React;

/* ============================= DATA TABLE ============================= */
function TableScreen({ onOpen }) {
  const [q, setQ] = useStateD('');
  const [status, setStatus] = useStateD('all');
  const [sort, setSort] = useStateD({ key: 'mrr', dir: 'desc' });
  const [sel, setSel] = useStateD(() => new Set());
  const [page, setPage] = useStateD(0);
  const per = 9;

  const filtered = useMemo(() => {
    let r = CUSTOMERS.filter(c =>
      (status === 'all' || c.status === status) &&
      (q === '' || (c.name + c.company + c.email).toLowerCase().includes(q.toLowerCase())));
    r = [...r].sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      const d = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
      return sort.dir === 'asc' ? d : -d;
    });
    return r;
  }, [q, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / per));
  const rows = filtered.slice(page * per, page * per + per);
  const pageIds = rows.map(r => r.id);
  const allSel = pageIds.length > 0 && pageIds.every(id => sel.has(id));

  const toggleAll = () => setSel(s => { const n = new Set(s); allSel ? pageIds.forEach(id => n.delete(id)) : pageIds.forEach(id => n.add(id)); return n; });
  const toggle = (id) => setSel(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const setSortKey = (key) => setSort(s => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }));

  const Th = ({ k, children, align = 'left', sortable = true }) => (
    <th onClick={sortable ? () => setSortKey(k) : undefined}
      style={{ textAlign: align, padding: '0 14px', height: 42, cursor: sortable ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap', position: 'sticky', top: 0, background: 'var(--surface-1)', zIndex: 1 }}>
      <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: sort.key === k ? 'var(--accent)' : 'var(--text-faint)' }}>
        {children}{sortable && sort.key === k && (sort.dir === 'desc' ? <Icon.chevDown style={{ width: 12, height: 12 }} /> : <Icon.arrowUp style={{ width: 12, height: 12 }} />)}
      </span>
    </th>
  );

  return (
    <div className="vsp-content-inner">
      <PageToolbar right={<>
        <button className="btn btn-ghost btn-sm"><Icon.filter />Filters</button>
        <button className="btn btn-ghost btn-sm"><Icon.download />Export</button>
        <button className="btn btn-primary btn-sm"><Icon.plus />Add account</button>
      </>}>
        <div className="vsp-search" style={{ width: 260 }}>
          <Icon.search /><input placeholder="Search accounts…" value={q} onChange={e => { setQ(e.target.value); setPage(0); }} />
        </div>
      </PageToolbar>

      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--gap)', flexWrap: 'wrap' }}>
        <button className={`chip ${status === 'all' ? 'active' : ''}`} onClick={() => { setStatus('all'); setPage(0); }}>All<span className="mono" style={{ opacity: .6 }}>{CUSTOMERS.length}</span></button>
        {Object.entries(STATUSES).map(([k, v]) => (
          <button key={k} className={`chip ${status === k ? 'active' : ''}`} onClick={() => { setStatus(k); setPage(0); }}>
            {v.label}<span className="mono" style={{ opacity: .6 }}>{CUSTOMERS.filter(c => c.status === k).length}</span>
          </button>
        ))}
      </div>

      {sel.size > 0 && (
        <div className="card vsp-rise" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', marginBottom: 12, borderColor: 'color-mix(in oklab, var(--accent) 30%, var(--border))' }}>
          <span className="badge badge-info">{sel.size} selected</span>
          <button className="btn btn-subtle btn-sm"><Icon.mail />Email</button>
          <button className="btn btn-subtle btn-sm"><Icon.layers />Change plan</button>
          <div style={{ flex: 1 }} />
          <button className="btn btn-subtle btn-sm" onClick={() => setSel(new Set())}><Icon.x />Clear</button>
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }} className="vsp-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 880 }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ width: 44, padding: '0 0 0 16px', position: 'sticky', top: 0, background: 'var(--surface-1)' }}>
                <Check on={allSel} onClick={toggleAll} />
              </th>
              <Th k="name">Account</Th>
              <Th k="company">Company</Th>
              <Th k="plan">Plan</Th>
              <Th k="status">Status</Th>
              <Th k="seats" align="right">Seats</Th>
              <Th k="mrr" align="right">MRR</Th>
              <Th k="usage" sortable={false}>Usage</Th>
              <th style={{ width: 44, position: 'sticky', top: 0, background: 'var(--surface-1)' }}></th>
            </tr></thead>
            <tbody>
              {rows.map(c => {
                const st = STATUSES[c.status];
                const isSel = sel.has(c.id);
                return (
                  <tr key={c.id} onClick={() => onOpen(c)} className="vsp-trow"
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', background: isSel ? 'color-mix(in oklab, var(--accent) 7%, transparent)' : 'transparent', transition: 'background .12s' }}>
                    <td style={{ padding: '0 0 0 16px' }} onClick={e => { e.stopPropagation(); toggle(c.id); }}><Check on={isSel} /></td>
                    <td style={{ padding: 'var(--row-py) 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <Av name={c.name} hue={c.hue} size={32} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{c.name}</div>
                          <div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--row-py) 14px', color: 'var(--text-dim)' }}>{c.company}</td>
                    <td style={{ padding: 'var(--row-py) 14px' }}><span style={{ fontWeight: 600 }}>{c.plan}</span></td>
                    <td style={{ padding: 'var(--row-py) 14px' }}><span className={`badge ${st.cls}`}><i />{st.label}</span></td>
                    <td style={{ padding: 'var(--row-py) 14px', textAlign: 'right' }} className="tnum mono">{c.seats}</td>
                    <td style={{ padding: 'var(--row-py) 14px', textAlign: 'right' }} className="tnum" ><b style={{ fontWeight: 700 }}>${c.mrr.toLocaleString()}</b></td>
                    <td style={{ padding: 'var(--row-py) 14px', minWidth: 120 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="meter" style={{ flex: 1, height: 5 }}><i style={{ width: `${c.usage}%`, background: c.usage > 85 ? 'var(--warning)' : 'var(--accent)' }} /></div>
                        <span className="mono tnum" style={{ fontSize: 11, color: 'var(--text-faint)', width: 30 }}>{c.usage}%</span>
                      </div>
                    </td>
                    <td onClick={e => e.stopPropagation()}><button className="vsp-icon-btn" style={{ width: 30, height: 30, border: 0, background: 'transparent' }}><Icon.more /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>{filtered.length} accounts · page {page + 1} of {pages}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost btn-sm" disabled={page === 0} style={{ opacity: page === 0 ? .4 : 1 }} onClick={() => setPage(p => Math.max(0, p - 1))}><Icon.chevLeft style={{ width: 14, height: 14 }} />Prev</button>
            <button className="btn btn-ghost btn-sm" disabled={page >= pages - 1} style={{ opacity: page >= pages - 1 ? .4 : 1 }} onClick={() => setPage(p => Math.min(pages - 1, p + 1))}>Next<Icon.chevRight style={{ width: 14, height: 14 }} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Check({ on, onClick }) {
  return (
    <span onClick={onClick} style={{ width: 18, height: 18, borderRadius: 5, display: 'inline-grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0,
      border: on ? 0 : '1.6px solid var(--border-strong)', background: on ? 'var(--accent)' : 'transparent', color: '#fff', transition: 'all .15s' }}>
      {on && <Icon.check style={{ width: 12, height: 12 }} />}
    </span>
  );
}

/* ============================= DETAIL ============================= */
function DetailScreen({ customer, onBack }) {
  const c = customer || CUSTOMERS[0];
  const st = STATUSES[c.status];
  return (
    <div className="vsp-content-inner">
      <button className="btn btn-subtle btn-sm" onClick={onBack} style={{ marginBottom: 16, paddingLeft: 8 }}><Icon.chevLeft style={{ width: 15, height: 15 }} />Accounts</button>

      <div className="card vsp-rise" style={{ marginBottom: 'var(--gap)', overflow: 'hidden' }}>
        <div style={{ height: 76, background: `linear-gradient(110deg, color-mix(in oklab, var(--accent) 22%, var(--surface-2)), color-mix(in oklab, var(--accent-2) 18%, var(--surface-2)))` }} />
        <div className="card-pad" style={{ paddingTop: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: -30, flexWrap: 'wrap' }}>
            <div style={{ border: '4px solid var(--surface-1)', borderRadius: '50%' }}><Av name={c.name} hue={c.hue} size={72} /></div>
            <div style={{ flex: 1, minWidth: 200, paddingBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>{c.name}</h2>
                <span className={`badge ${st.cls}`}><i />{st.label}</span>
              </div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 3 }}>{c.company} · {c.email} · {c.id}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
              <button className="btn btn-ghost btn-sm"><Icon.mail />Message</button>
              <button className="btn btn-primary btn-sm"><Icon.bolt />Manage</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid stat-grid" style={{ marginBottom: 'var(--gap)' }}>
        <MiniStat label="MRR" value={`$${c.mrr.toLocaleString()}`} sub="+8.2% MoM" tone="pos" />
        <MiniStat label="Plan" value={c.plan} sub={`${c.seats} seats`} />
        <MiniStat label="Usage" value={`${c.usage}%`} sub="of quota" tone={c.usage > 85 ? 'warn' : 'pos'} />
        <MiniStat label="Customer since" value={c.joined.slice(0, 7)} sub="14 months" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        <div className="card vsp-rise">
          <div className="card-head"><h3>Usage trend</h3><div className="vsp-top-spacer" /><Segmented options={['API','Seats','Storage']} value="API" onChange={() => {}} /></div>
          <div className="card-pad"><AreaChart series={[c.spark.map(x => x * 12)]} labels={monthLabels} height={230} /></div>
        </div>
        <div className="card vsp-rise">
          <div className="card-head"><h3>Details</h3></div>
          <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[['Account ID', c.id], ['Company', c.company], ['Plan', c.plan], ['Seats', String(c.seats)], ['Billing', 'Monthly · Card'], ['Region', 'us-east-1'], ['Owner', c.name]].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: i < 6 ? '1px solid var(--border)' : 0 }}>
                <span className="eyebrow">{k}</span><span className="mono" style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, sub, tone }) {
  const c = { pos: 'var(--success)', warn: 'var(--warning)', neg: 'var(--danger)' }[tone] || 'var(--text-faint)';
  return (
    <div className="card card-pad vsp-rise">
      <div className="eyebrow">{label}</div>
      <div className="tnum" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', margin: '8px 0 4px' }}>{value}</div>
      <div style={{ fontSize: 12, color: c, fontWeight: 600 }}>{sub}</div>
    </div>
  );
}

Object.assign(window, { TableScreen, DetailScreen });
