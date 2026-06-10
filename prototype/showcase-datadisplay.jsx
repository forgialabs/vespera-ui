// showcase-datadisplay.jsx — comprehensive Data Display section with nested sub-nav.
// Overrides window.DataDisplaySection (loaded AFTER showcase-components.jsx).
const { useState: useDD, useMemo: useDDMemo } = React;

/* ---------- mock orders with line items (for nested / single order) ---------- */
const DD_ORDERS = [
  { id: 'ORD-90210', who: 'Northwind', hue: 220, date: 'Jun 6, 2026', status: 'fulfilled', items: [
    { sku: 'AET-ENT', name: 'Enterprise license', qty: 1, price: 2400 },
    { sku: 'SEAT-08', name: 'Seat add-on', qty: 8, price: 40 },
    { sku: 'SUP-PRIO', name: 'Priority support', qty: 1, price: 480 },
  ]},
  { id: 'ORD-90211', who: 'Vertex AI', hue: 285, date: 'Jun 5, 2026', status: 'processing', items: [
    { sku: 'AET-GRW', name: 'Growth license', qty: 1, price: 980 },
    { sku: 'API-OVR', name: 'API overage', qty: 12, price: 18 },
  ]},
  { id: 'ORD-90212', who: 'Halcyon', hue: 150, date: 'Jun 3, 2026', status: 'fulfilled', items: [
    { sku: 'AET-PRO', name: 'Pro license', qty: 1, price: 560 },
    { sku: 'SEAT-04', name: 'Seat add-on', qty: 4, price: 40 },
    { sku: 'ONB-STD', name: 'Onboarding', qty: 1, price: 300 },
  ]},
];
const orderTotal = (o) => o.items.reduce((s, i) => s + i.qty * i.price, 0);
const STATUS_TONE = { fulfilled: 'pos', processing: 'info', pending: 'warn', refunded: 'neg' };

/* ============================= MAIN ============================= */
function DataDisplaySection({ sub = 'essentials', onSub }) {
  React.useEffect(() => { window.__dataSub = onSub; return () => { if (window.__dataSub === onSub) window.__dataSub = null; }; }, [onSub]);
  return (
    <>
      <h1 className="dx-h1">Data Display</h1>
      <p className="dx-lede">The vocabulary for status and identity, plus the patterns that carry real operational data — tables, search, nested orders, every pagination strategy, and charts.</p>
      <div key={sub} className="ag-rise" style={{ marginTop: 28 }}>
        {sub === 'essentials' && <DDEssentials />}
        {sub === 'tables' && <DDTables />}
        {sub === 'pagination' && <DDPagination />}
        {sub === 'charts' && <DDCharts />}
      </div>
    </>
  );
}

/* ============================= ESSENTIALS ============================= */
function DDEssentials() {
  return (
    <>
      <h2 className="dx-h2">Event calendar</h2>
      <p className="dx-demo-desc" style={{ marginBottom: 14 }}>A full month calendar with events, an agenda view, and month navigation — alongside the popover DatePicker in Forms.</p>
      <EventCalendar />

      <h2 className="dx-h2">Badges &amp; status</h2>
      <Demo>
        <Badge tone="pos" dot>Active</Badge><Badge tone="info" dot>Trial</Badge><Badge tone="warn" dot>Pending</Badge>
        <Badge tone="neg" dot>Churned</Badge><Badge tone="muted">Paused</Badge><Badge tone="info">v1.0</Badge>
      </Demo>
      <h2 className="dx-h2">Avatars &amp; identity</h2>
      <Demo>
        <Av name="Maya Okafor" hue={220} size={44} /><Av name="Leo Vega" hue={150} size={44} /><Av name="Vertex AI" hue={285} size={44} />
        <div style={{ display: 'flex' }}>
          {[220, 150, 40, 300].map((h, i) => <span key={i} style={{ marginLeft: i ? -10 : 0, border: '2px solid var(--surface-1)', borderRadius: '50%' }}><Av name={'A B'} hue={h} size={34} /></span>)}
          <span style={{ marginLeft: -10, width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--surface-3)', border: '2px solid var(--surface-1)', fontSize: 11, fontWeight: 700, color: 'var(--text-dim)' }}>+9</span>
        </div>
      </Demo>
      <h2 className="dx-h2">Progress &amp; meters</h2>
      <Demo col>
        <div style={{ width: '100%' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span className="eyebrow">Storage used</span><span className="mono" style={{ fontSize: 12 }}>68%</span></div><Progress value={68} /></div>
        <div style={{ width: '100%' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span className="eyebrow">API quota</span><span className="mono" style={{ fontSize: 12, color: 'var(--warning)' }}>92%</span></div><Progress value={92} tone="var(--warning)" /></div>
      </Demo>
      <h2 className="dx-h2">KPI stats</h2>
      <div className="dx-grid three">
        <StatCard icon="dollar" label="MRR" value="$248.9k" delta="12.4%" deltaDir="up" spark={window.revenue30.slice(-12)} />
        <StatCard icon="users" label="Accounts" value="3,914" delta="6.1%" deltaDir="up" spark={[40,44,48,52,55,60,64,70,73,78]} sparkColor="var(--accent-2)" />
        <StatCard icon="cart" label="Churn" value="1.8%" delta="0.4%" deltaDir="down" spark={[3,2.8,2.6,2.4,2.2,2,1.9,1.8]} sparkColor="#fb7185" />
      </div>

      <h2 className="dx-h2">Timeline</h2>
      <div className="dx-block"><div className="dx-block-body">
        <Timeline items={[
          { icon: 'arrowUp', tone: 'pos', title: 'Upgraded to Enterprise', time: '2m ago', body: 'Maya Okafor · +$1,400 MRR' },
          { icon: 'plus', tone: 'info', title: 'Workspace created', time: '14m ago', body: 'Vertex AI · 4 members invited' },
          { icon: 'shield', title: 'API key rotated', time: '1h ago', body: 'Production key · by system' },
          { icon: 'bell', tone: 'warn', title: 'Payment flagged', time: '3h ago', body: 'Cobalt · card declined' },
        ]} />
      </div></div>

      <h2 className="dx-h2">Tree &amp; key-value</h2>
      <div className="dx-grid two">
        <div className="dx-block"><div className="dx-block-body">
          <Tree defaultExpanded={['Workspace', 'Billing']} data={[
            { label: 'Workspace', icon: 'grid', children: [
              { label: 'Accounts', icon: 'users', badge: 42 },
              { label: 'Billing', icon: 'card', children: [{ label: 'Invoices', icon: 'doc' }, { label: 'Payment methods', icon: 'card' }] },
              { label: 'API keys', icon: 'bolt', badge: 3 },
            ]},
            { label: 'System', icon: 'settings', children: [{ label: 'Audit log', icon: 'shield' }, { label: 'Webhooks', icon: 'globe' }] },
          ]} />
        </div></div>
        <div className="dx-block"><div className="dx-block-body">
          <DescriptionList items={[['Account ID', <span className="mono">ATG-4810</span>], ['Plan', 'Enterprise'], ['Seats', '48'], ['Region', <span className="mono">us-east-1</span>], ['Owner', 'Maya Okafor'], ['Status', <Badge tone="pos" dot>Active</Badge>]]} />
        </div></div>
      </div>
    </>
  );
}

/* ============================= TABLES ============================= */
const PT_COLS = [
  { key: 'name', label: 'Account', sortable: true, filter: 'text' },
  { key: 'plan', label: 'Plan', sortable: true, filter: 'select', opts: () => window.PLANS },
  { key: 'status', label: 'Status', sortable: true, filter: 'select', opts: () => Object.keys(window.STATUSES) },
  { key: 'seats', label: 'Seats', sortable: true, align: 'right', filter: 'num' },
  { key: 'mrr', label: 'MRR', sortable: true, align: 'right', filter: 'num' },
  { key: 'usage', label: 'Usage', sortable: true, align: 'right' },
];

function PowerTable() {
  const [q, setQ] = useDD('');
  const [sort, setSort] = useDD({ key: 'mrr', dir: 'desc' });
  const [colFilters, setColFilters] = useDD({});
  const [showFilters, setShowFilters] = useDD(false);
  const [hidden, setHidden] = useDD(() => new Set());
  const [sel, setSel] = useDD(() => new Set());
  const [per, setPer] = useDD(8);
  const [page, setPage] = useDD(0);

  const cols = PT_COLS.filter(c => !hidden.has(c.key));

  const filtered = useDDMemo(() => {
    let r = window.CUSTOMERS.filter(c => {
      if (q && !(c.name + ' ' + c.company + ' ' + c.email + ' ' + c.plan).toLowerCase().includes(q.toLowerCase())) return false;
      for (const [k, v] of Object.entries(colFilters)) {
        if (!v) continue;
        const col = PT_COLS.find(x => x.key === k);
        if (col.filter === 'num') { if (c[k] < Number(v)) return false; }
        else if (col.filter === 'select') { if (String(c[k]) !== v) return false; }
        else if (!String(k === 'name' ? c.name + ' ' + c.company : c[k]).toLowerCase().includes(v.toLowerCase())) return false;
      }
      return true;
    });
    r = [...r].sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      const d = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
      return sort.dir === 'asc' ? d : -d;
    });
    return r;
  }, [q, colFilters, sort]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / per));
  const pg = Math.min(page, pages - 1);
  const rows = filtered.slice(pg * per, pg * per + per);
  const pageIds = rows.map(r => r.id);
  const allSel = pageIds.length > 0 && pageIds.every(id => sel.has(id));

  const setColFilter = (k, v) => { setColFilters(f => ({ ...f, [k]: v })); setPage(0); };
  const toggleSort = (k) => setSort(s => ({ key: k, dir: s.key === k && s.dir === 'desc' ? 'asc' : 'desc' }));
  const toggleSel = (id) => setSel(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSel(s => { const n = new Set(s); allSel ? pageIds.forEach(id => n.delete(id)) : pageIds.forEach(id => n.add(id)); return n; });
  const toggleCol = (k) => setHidden(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const activeFilters = Object.values(colFilters).filter(Boolean).length;

  const exportCsv = () => {
    const head = cols.map(c => c.label);
    const lines = filtered.map(c => cols.map(col => {
      const v = col.key === 'name' ? `${c.name} (${c.company})` : c[col.key];
      return `"${String(v).replace(/"/g, '""')}"`;
    }).join(','));
    const csv = [head.join(','), ...lines].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = 'accounts.csv'; a.click();
    URL.revokeObjectURL(url);
    window.toast?.({ tone: 'pos', title: 'Exported', body: `${filtered.length} rows → accounts.csv` });
  };

  const cell = (c, col) => {
    if (col.key === 'name') return <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><Av name={c.name} hue={c.hue} size={30} /><div style={{ minWidth: 0 }}><div style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{hl(c.name, q || colFilters.name)}</div><div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{c.company}</div></div></div>;
    if (col.key === 'status') { const st = window.STATUSES[c.status]; return <Badge tone={st.cls.replace('badge-', '')} dot>{st.label}</Badge>; }
    if (col.key === 'plan') return <span style={{ fontWeight: 600 }}>{c.plan}</span>;
    if (col.key === 'mrr') return <span className="tnum" style={{ fontWeight: 700 }}>${c.mrr.toLocaleString()}</span>;
    if (col.key === 'seats') return <span className="tnum mono">{c.seats}</span>;
    if (col.key === 'usage') return <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}><div className="meter" style={{ width: 54, height: 5 }}><i style={{ width: `${c.usage}%`, background: c.usage > 85 ? 'var(--warning)' : 'var(--accent)' }} /></div><span className="mono tnum" style={{ fontSize: 11, color: 'var(--text-faint)', width: 28 }}>{c.usage}%</span></div>;
    return c[col.key];
  };

  return (
    <div className="dx-block">
      <div className="dx-block-bar" style={{ gap: 10, flexWrap: 'wrap' }}>
        <div className="ui-affix" style={{ flex: 1, minWidth: 200, maxWidth: 300 }}><Icon.search /><input placeholder="Search accounts…" value={q} onChange={e => { setQ(e.target.value); setPage(0); }} /></div>
        <div style={{ flex: 1 }} />
        <Button variant={showFilters ? 'primary' : 'ghost'} size="sm" leadingIcon="filter" onClick={() => setShowFilters(v => !v)}>Filters{activeFilters ? ` · ${activeFilters}` : ''}</Button>
        <Popover align="end" width={210} trigger={<Button variant="ghost" size="sm" leadingIcon="layers" trailingIcon="chevDown">Columns</Button>}>
          <div style={{ display: 'grid', gap: 10 }}>
            <div className="eyebrow">Visible columns</div>
            {PT_COLS.map(c => <Checkbox key={c.key} checked={!hidden.has(c.key)} onChange={() => toggleCol(c.key)} label={c.label} />)}
          </div>
        </Popover>
        <Button variant="ghost" size="sm" leadingIcon="download" onClick={exportCsv}>CSV</Button>
      </div>

      {sel.size > 0 && (
        <div className="dx-block-bar" style={{ background: 'color-mix(in oklab, var(--accent) 8%, transparent)' }}>
          <Badge tone="info">{sel.size} selected</Badge>
          <Button variant="subtle" size="sm" leadingIcon="mail">Email</Button>
          <Button variant="subtle" size="sm" leadingIcon="download">Export selected</Button>
          <div style={{ flex: 1 }} />
          <Button variant="subtle" size="sm" leadingIcon="x" onClick={() => setSel(new Set())}>Clear</Button>
        </div>
      )}

      <div className="dx-block-body flush" style={{ overflowX: 'auto' }}>
        <table className="ui-table" style={{ minWidth: 720 }}>
          <thead>
            <tr>
              <th style={{ width: 42, paddingLeft: 16 }}><span className={cx('ui-check', allSel && 'on')} onClick={toggleAll}><Icon.check /></span></th>
              {cols.map(col => (
                <th key={col.key} style={{ textAlign: col.align || 'left', cursor: col.sortable ? 'pointer' : 'default', whiteSpace: 'nowrap' }} onClick={col.sortable ? () => toggleSort(col.key) : undefined}>
                  <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: sort.key === col.key ? 'var(--accent)' : 'var(--text-faint)' }}>
                    {col.align === 'right' && col.sortable && sort.key === col.key && <SortCaret dir={sort.dir} />}
                    {col.label}
                    {col.align !== 'right' && col.sortable && sort.key === col.key && <SortCaret dir={sort.dir} />}
                  </span>
                </th>
              ))}
            </tr>
            {showFilters && (
              <tr>
                <th style={{ paddingLeft: 16 }}></th>
                {cols.map(col => (
                  <th key={col.key} style={{ padding: '0 14px 10px' }}>
                    {col.filter === 'select'
                      ? <Select style={{ height: 30, fontSize: 12.5, padding: '0 24px 0 9px' }} value={colFilters[col.key] || 'any'} onChange={e => setColFilter(col.key, e.target.value === 'any' ? '' : e.target.value)} options={[{ value: 'any', label: 'Any' }, ...col.opts().map(o => ({ value: o, label: window.STATUSES[o]?.label || o }))]} />
                      : col.filter === 'num'
                        ? <ColInput type="number" placeholder="Min" value={colFilters[col.key] || ''} onChange={e => setColFilter(col.key, e.target.value)} style={{ height: 30, fontSize: 12.5, padding: '0 9px', textAlign: 'right' }} />
                        : col.filter === 'text'
                          ? <ColInput placeholder="Filter…" value={colFilters[col.key] || ''} onChange={e => setColFilter(col.key, e.target.value)} />
                          : null}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {rows.length === 0
              ? <tr><td colSpan={cols.length + 1} style={{ textAlign: 'center', padding: '44px 0', color: 'var(--text-faint)' }}>No accounts match your filters.</td></tr>
              : rows.map(c => (
                <tr key={c.id} style={{ background: sel.has(c.id) ? 'color-mix(in oklab, var(--accent) 7%, transparent)' : undefined }}>
                  <td style={{ paddingLeft: 16 }}><span className={cx('ui-check', sel.has(c.id) && 'on')} onClick={() => toggleSel(c.id)}><Icon.check /></span></td>
                  {cols.map(col => <td key={col.key} style={{ textAlign: col.align || 'left' }}>{cell(c, col)}</td>)}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="dx-block-bar" style={{ borderTop: '1px solid var(--border)', borderBottom: 0, gap: 14, flexWrap: 'wrap' }}>
        <span className="mono" style={{ fontSize: 12, color: 'var(--text-faint)' }}>{total === 0 ? '0' : `${pg * per + 1}–${Math.min(pg * per + per, total)}`} of {total}{sel.size ? ` · ${sel.size} selected` : ''}</span>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span className="eyebrow">Rows</span>
          <Select style={{ width: 72, height: 32 }} value={per} onChange={e => { setPer(Number(e.target.value)); setPage(0); }} options={[{ value: 8, label: '8' }, { value: 15, label: '15' }, { value: 25, label: '25' }]} />
        </label>
        <div style={{ flex: 1 }} />
        <Pagination page={pg} pages={pages} onPage={setPage} />
      </div>
    </div>
  );
}
function SortCaret({ dir }) {
  return dir === 'desc'
    ? <Icon.chevDown style={{ width: 12, height: 12 }} />
    : <Icon.arrowUp style={{ width: 11, height: 11 }} />;
}

/* ============================= TABLES ============================= */
const ST_COLS = [
  { key: 'name', label: 'Account', w: 210 },
  { key: 'plan', label: 'Plan', w: 120 },
  { key: 'status', label: 'Status', w: 120 },
  { key: 'seats', label: 'Seats', w: 90, align: 'right' },
  { key: 'usage', label: 'Usage', w: 100, align: 'right' },
  { key: 'mrr', label: 'MRR', w: 110, align: 'right' },
  { key: 'joined', label: 'Joined', w: 120 },
  { key: 'region', label: 'Region', w: 130 },
  { key: 'email', label: 'Email', w: 230 },
];
const ST_REGIONS = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];
function StickyTable() {
  const [freeze, setFreeze] = useDD(1);
  const rows = window.CUSTOMERS.slice(0, 14);
  const offsets = ST_COLS.map((_, i) => ST_COLS.slice(0, i).reduce((s, c) => s + c.w, 0));
  const totalW = ST_COLS.reduce((s, c) => s + c.w, 0);
  const cellStyle = (i) => i < freeze ? { left: offsets[i] } : {};
  const cls = (i) => cx(i < freeze && 'freeze', i === freeze - 1 && 'edge');
  const render = (c, col) => {
    if (col.key === 'name') return <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Av name={c.name} hue={c.hue} size={28} /><span style={{ fontWeight: 600 }}>{c.name}</span></div>;
    if (col.key === 'status') { const st = window.STATUSES[c.status]; return <Badge tone={st.cls.replace('badge-', '')} dot>{st.label}</Badge>; }
    if (col.key === 'mrr') return <b className="tnum">${c.mrr.toLocaleString()}</b>;
    if (col.key === 'usage') return <span className="mono tnum" style={{ color: c.usage > 85 ? 'var(--warning)' : 'var(--text-dim)' }}>{c.usage}%</span>;
    if (col.key === 'seats') return <span className="mono tnum">{c.seats}</span>;
    if (col.key === 'joined') return <span className="mono" style={{ color: 'var(--text-dim)', fontSize: 12 }}>{c.joined}</span>;
    if (col.key === 'region') return <span className="mono" style={{ color: 'var(--text-dim)', fontSize: 12 }}>{ST_REGIONS[c.seats % 4]}</span>;
    if (col.key === 'email') return <span className="mono" style={{ color: 'var(--text-faint)', fontSize: 12 }}>{c.email}</span>;
    return c[col.key];
  };
  return (
    <div className="dx-block">
      <div className="dx-block-bar">
        <Icon.table style={{ width: 16, height: 16, color: 'var(--accent)' }} />
        <b style={{ fontSize: 13.5 }}>Wide dataset</b>
        <div style={{ flex: 1 }} />
        <span className="eyebrow">Freeze</span>
        <Segmented options={['1', '2', '3']} value={String(freeze)} onChange={v => setFreeze(Number(v))} />
      </div>
      <div className="ui-sticky-wrap ag-scroll">
        <table className="ui-sticky" style={{ minWidth: totalW }}>
          <colgroup>{ST_COLS.map(c => <col key={c.key} style={{ width: c.w }} />)}</colgroup>
          <thead><tr>
            {ST_COLS.map((col, i) => (
              <th key={col.key} className={cls(i)} style={{ ...cellStyle(i), textAlign: col.align || 'left' }}>
                <span className="eyebrow">{col.label}</span>
              </th>
            ))}
          </tr></thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id}>
                {ST_COLS.map((col, i) => (
                  <td key={col.key} className={cls(i)} style={{ ...cellStyle(i), textAlign: col.align || 'left' }}>{render(c, col)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DDTables() {
  return (
    <>
      <h2 className="dx-h2">Power table</h2>
      <p className="dx-demo-desc" style={{ marginBottom: 14 }}>Everything together — universal search, per-column filters, sortable headers, column show/hide, row selection, rows-per-page, pagination and CSV export.</p>
      <PowerTable />

      <h2 className="dx-h2">Universal search</h2>
      <p className="dx-demo-desc" style={{ marginBottom: 14 }}>One input filters across every column, with a live result count and empty state.</p>
      <SearchTable />

      <h2 className="dx-h2">Per-column search</h2>
      <p className="dx-demo-desc" style={{ marginBottom: 14 }}>A filter control under each column header — text inputs, a select, and a numeric range — combined with AND.</p>
      <ColumnFilterTable />

      <h2 className="dx-h2">Sticky header &amp; frozen columns</h2>
      <p className="dx-demo-desc" style={{ marginBottom: 14 }}>The header row stays pinned on vertical scroll, and the first N columns freeze on horizontal scroll — for wide datasets.</p>
      <StickyTable />

      <h2 className="dx-h2">Nested / combo order</h2>
      <p className="dx-demo-desc" style={{ marginBottom: 14 }}>Parent rows expand to reveal nested line items — for grouped or composite orders.</p>
      <NestedOrders />

      <h2 className="dx-h2">Single custom order</h2>
      <p className="dx-demo-desc" style={{ marginBottom: 14 }}>A bespoke record layout: line items, quantities and a totals summary.</p>
      <SingleOrder />
    </>
  );
}

function SearchTable() {
  const [q, setQ] = useDD('');
  const rows = useDDMemo(() => window.CUSTOMERS.filter(c =>
    !q || (c.name + ' ' + c.company + ' ' + c.email + ' ' + c.plan).toLowerCase().includes(q.toLowerCase())).slice(0, 20), [q]);
  return (
    <div className="dx-block">
      <div className="dx-block-bar">
        <div className="ui-affix" style={{ flex: 1, maxWidth: 320 }}><Icon.search /><input placeholder="Search name, company, email, plan…" value={q} onChange={e => setQ(e.target.value)} /></div>
        <div style={{ flex: 1 }} />
        <Badge tone="muted">{rows.length} {rows.length === 1 ? 'result' : 'results'}</Badge>
      </div>
      <div className="dx-block-body flush" style={{ maxHeight: 340, overflowY: 'auto' }}>
        {rows.length === 0
          ? <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-faint)' }}><Icon.search style={{ width: 26, height: 26, margin: '0 auto 10px' }} /><div style={{ fontWeight: 600, color: 'var(--text)' }}>No matches</div><div style={{ fontSize: 13, marginTop: 3 }}>Nothing matches “{q}”.</div></div>
          : <table className="ui-table"><thead><tr>
              <th><span className="eyebrow">Account</span></th><th><span className="eyebrow">Plan</span></th><th><span className="eyebrow">Status</span></th><th style={{ textAlign: 'right' }}><span className="eyebrow">MRR</span></th>
            </tr></thead><tbody>
              {rows.map(c => { const st = window.STATUSES[c.status]; return (
                <tr key={c.id}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><Av name={c.name} hue={c.hue} size={30} /><div><div style={{ fontWeight: 600 }}>{hl(c.name, q)}</div><div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{hl(c.company, q)}</div></div></div></td>
                  <td style={{ fontWeight: 600 }}>{c.plan}</td>
                  <td><Badge tone={st.cls.replace('badge-', '')} dot>{st.label}</Badge></td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }} className="tnum">${c.mrr.toLocaleString()}</td>
                </tr>
              ); })}
            </tbody></table>}
      </div>
    </div>
  );
}
function hl(text, q) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return <>{text.slice(0, i)}<mark style={{ background: 'color-mix(in oklab, var(--accent) 35%, transparent)', color: 'var(--text)', borderRadius: 3, padding: '0 1px' }}>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
}

function ColHead({ label, align, children }) {
  return (
    <th style={{ textAlign: align || 'left', verticalAlign: 'top', padding: '10px 14px' }}>
      <div className="eyebrow" style={{ marginBottom: 7 }}>{label}</div>
      {children}
    </th>
  );
}
function ColInput(props) {
  return <input {...props} onClick={e => e.stopPropagation()} className="ui-input" style={{ height: 30, fontSize: 12.5, padding: '0 9px', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--font-sans)' }} />;
}
function ColumnFilterTable() {
  const [f, setF] = useDD({ name: '', company: '', plan: 'any', status: 'any', minMrr: '' });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const rows = useDDMemo(() => window.CUSTOMERS.filter(c =>
    (!f.name || c.name.toLowerCase().includes(f.name.toLowerCase())) &&
    (!f.company || c.company.toLowerCase().includes(f.company.toLowerCase())) &&
    (f.plan === 'any' || c.plan === f.plan) &&
    (f.status === 'any' || c.status === f.status) &&
    (!f.minMrr || c.mrr >= Number(f.minMrr))
  ).slice(0, 40), [f]);
  const active = (f.name || f.company || f.plan !== 'any' || f.status !== 'any' || f.minMrr);
  return (
    <div className="dx-block">
      <div className="dx-block-bar">
        <Icon.filter style={{ width: 16, height: 16, color: 'var(--accent)' }} />
        <b style={{ fontSize: 13.5 }}>Filter by column</b>
        <div style={{ flex: 1 }} />
        <Badge tone="muted">{rows.length} {rows.length === 1 ? 'match' : 'matches'}</Badge>
        {active ? <Button variant="subtle" size="sm" leadingIcon="x" onClick={() => setF({ name: '', company: '', plan: 'any', status: 'any', minMrr: '' })}>Clear</Button> : null}
      </div>
      <div className="dx-block-body flush" style={{ maxHeight: 380, overflowY: 'auto' }}>
        <table className="ui-table">
          <thead><tr style={{ background: 'var(--surface-1)' }}>
            <ColHead label="Account"><ColInput placeholder="Name…" value={f.name} onChange={e => set('name', e.target.value)} /></ColHead>
            <ColHead label="Company"><ColInput placeholder="Company…" value={f.company} onChange={e => set('company', e.target.value)} /></ColHead>
            <ColHead label="Plan"><Select style={{ height: 30, fontSize: 12.5, padding: '0 26px 0 9px' }} value={f.plan} onChange={e => set('plan', e.target.value)} options={[{ value: 'any', label: 'Any' }, ...window.PLANS.map(p => ({ value: p, label: p }))]} /></ColHead>
            <ColHead label="Status"><Select style={{ height: 30, fontSize: 12.5, padding: '0 26px 0 9px' }} value={f.status} onChange={e => set('status', e.target.value)} options={[{ value: 'any', label: 'Any' }, ...Object.entries(window.STATUSES).map(([k, v]) => ({ value: k, label: v.label }))]} /></ColHead>
            <ColHead label="Min MRR" align="right"><ColInput type="number" placeholder="0" value={f.minMrr} onChange={e => set('minMrr', e.target.value)} style={{ height: 30, fontSize: 12.5, padding: '0 9px', textAlign: 'right' }} /></ColHead>
          </tr></thead>
          <tbody>
            {rows.length === 0
              ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-faint)' }}>No rows match these filters.</td></tr>
              : rows.map(c => { const st = window.STATUSES[c.status]; return (
                <tr key={c.id}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><Av name={c.name} hue={c.hue} size={30} /><div style={{ fontWeight: 600 }}>{hl(c.name, f.name)}</div></div></td>
                  <td style={{ color: 'var(--text-dim)' }}>{hl(c.company, f.company)}</td>
                  <td style={{ fontWeight: 600 }}>{c.plan}</td>
                  <td><Badge tone={st.cls.replace('badge-', '')} dot>{st.label}</Badge></td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }} className="tnum">${c.mrr.toLocaleString()}</td>
                </tr>
              ); })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NestedOrders() {
  const [open, setOpen] = useDD(() => new Set([DD_ORDERS[0].id]));
  const toggle = (id) => setOpen(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <div className="dx-block">
      <div className="dx-block-body flush">
        <table className="ui-table">
          <thead><tr>
            <th style={{ width: 40 }}></th><th><span className="eyebrow">Order</span></th><th><span className="eyebrow">Customer</span></th>
            <th><span className="eyebrow">Date</span></th><th><span className="eyebrow">Status</span></th>
            <th style={{ textAlign: 'right' }}><span className="eyebrow">Items</span></th><th style={{ textAlign: 'right' }}><span className="eyebrow">Total</span></th>
          </tr></thead>
          <tbody>
            {DD_ORDERS.map(o => {
              const isOpen = open.has(o.id);
              return <React.Fragment key={o.id}>
                <tr onClick={() => toggle(o.id)} style={{ cursor: 'pointer' }}>
                  <td><Icon.chevRight style={{ width: 15, height: 15, color: 'var(--text-faint)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .18s' }} /></td>
                  <td className="mono" style={{ fontWeight: 600 }}>{o.id}</td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Av name={o.who} hue={o.hue} size={26} />{o.who}</div></td>
                  <td style={{ color: 'var(--text-dim)' }}>{o.date}</td>
                  <td><Badge tone={STATUS_TONE[o.status]} dot>{o.status}</Badge></td>
                  <td style={{ textAlign: 'right' }} className="tnum mono">{o.items.length}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }} className="tnum">${orderTotal(o).toLocaleString()}</td>
                </tr>
                {isOpen && o.items.map((it, i) => (
                  <tr key={it.sku} style={{ background: 'var(--surface-2)' }}>
                    <td></td>
                    <td colSpan={2} style={{ paddingLeft: 14 }}><div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-dim)' }}><span style={{ width: 6, height: 6, borderRadius: 2, background: 'var(--border-strong)' }} /><span className="mono" style={{ fontSize: 11.5 }}>{it.sku}</span><span style={{ color: 'var(--text)' }}>{it.name}</span></div></td>
                    <td colSpan={2} style={{ color: 'var(--text-faint)', fontSize: 12.5 }}>{it.qty} × ${it.price}</td>
                    <td style={{ textAlign: 'right' }} className="tnum mono">×{it.qty}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }} className="tnum">${(it.qty * it.price).toLocaleString()}</td>
                  </tr>
                ))}
              </React.Fragment>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SingleOrder() {
  const o = DD_ORDERS[0];
  const sub = orderTotal(o), tax = Math.round(sub * 0.09), total = sub + tax;
  return (
    <div className="dx-block">
      <div className="dx-block-bar">
        <Icon.cart style={{ width: 17, height: 17, color: 'var(--accent)' }} />
        <b className="mono" style={{ fontSize: 13.5 }}>{o.id}</b><Badge tone={STATUS_TONE[o.status]} dot>{o.status}</Badge>
        <div style={{ flex: 1 }} /><span className="eyebrow">{o.date}</span>
      </div>
      <div className="dx-block-body" style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}><Av name={o.who} hue={o.hue} size={38} /><div><div style={{ fontWeight: 700 }}>{o.who}</div><div className="mono" style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>billing@{o.who.toLowerCase().replace(/\s/g, '')}.com</div></div></div>
          <table className="ui-table"><thead><tr><th><span className="eyebrow">Item</span></th><th style={{ textAlign: 'center' }}><span className="eyebrow">Qty</span></th><th style={{ textAlign: 'right' }}><span className="eyebrow">Unit</span></th><th style={{ textAlign: 'right' }}><span className="eyebrow">Amount</span></th></tr></thead>
            <tbody>{o.items.map(it => (
              <tr key={it.sku}><td><div style={{ fontWeight: 600 }}>{it.name}</div><div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{it.sku}</div></td><td style={{ textAlign: 'center' }} className="tnum mono">{it.qty}</td><td style={{ textAlign: 'right' }} className="tnum mono">${it.price}</td><td style={{ textAlign: 'right', fontWeight: 600 }} className="tnum">${(it.qty * it.price).toLocaleString()}</td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="card card-pad" style={{ alignSelf: 'start', boxShadow: 'none', display: 'grid', gap: 11 }}>
          <div className="eyebrow">Summary</div>
          {[['Subtotal', sub], ['Tax (9%)', tax]].map(([k, v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'var(--text-dim)' }}>{k}</span><span className="tnum" style={{ fontWeight: 600 }}>${v.toLocaleString()}</span></div>)}
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><b>Total</b><span className="tnum" style={{ fontSize: 22, fontWeight: 800 }}>${total.toLocaleString()}</span></div>
          <Button variant="primary" size="sm" leadingIcon="download">Invoice</Button>
        </div>
      </div>
    </div>
  );
}

/* ============================= PAGINATION & LOADING ============================= */
function DDPagination() {
  return (
    <>
      <h2 className="dx-h2">Offset pagination</h2>
      <p className="dx-demo-desc" style={{ marginBottom: 14 }}>Numbered pages with a total count — best when the total is known and cheap to compute.</p>
      <OffsetPager />

      <h2 className="dx-h2">Cursor-based pagination</h2>
      <p className="dx-demo-desc" style={{ marginBottom: 14 }}>Prev / next by cursor token — stable for large or live datasets where offsets drift. No jump-to-page.</p>
      <CursorPager />

      <h2 className="dx-h2">Load more &amp; total to load</h2>
      <p className="dx-demo-desc" style={{ marginBottom: 14 }}>Progressive loading with a running “loaded of total” count and progress bar.</p>
      <LoadMore />
    </>
  );
}

function rowList(arr) {
  return arr.map(c => { const st = window.STATUSES[c.status]; return (
    <div key={c.id} className="ui-row" style={{ padding: 'var(--row-py) 18px' }}>
      <Av name={c.name} hue={c.hue} size={30} />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</div><div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{c.company}</div></div>
      <Badge tone={st.cls.replace('badge-', '')} dot>{st.label}</Badge>
      <span className="tnum" style={{ fontWeight: 700, width: 70, textAlign: 'right' }}>${c.mrr.toLocaleString()}</span>
    </div>
  ); });
}

function OffsetPager() {
  const total = window.CUSTOMERS.length;
  const [per, setPer] = useDD(6);
  const [page, setPage] = useDD(0);
  const pages = Math.ceil(total / per);
  const start = Math.min(page, pages - 1) * per;
  const rows = window.CUSTOMERS.slice(start, start + per);
  return (
    <div className="dx-block">
      <div className="dx-block-body flush">{rowList(rows)}</div>
      <div className="dx-block-bar" style={{ borderTop: '1px solid var(--border)', borderBottom: 0, gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: 'var(--text-faint)' }}>Showing {start + 1}–{Math.min(start + per, total)} of {total}</span>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
          <span className="eyebrow">Rows</span>
          <Select style={{ width: 76, height: 32 }} value={per} onChange={e => { setPer(Number(e.target.value)); setPage(0); }} options={[{ value: 6, label: '6' }, { value: 10, label: '10' }, { value: 15, label: '15' }, { value: 25, label: '25' }]} />
        </label>
        <div style={{ flex: 1 }} />
        <Pagination page={Math.min(page, pages - 1)} pages={pages} onPage={setPage} />
      </div>
    </div>
  );
}

function CursorPager() {
  const per = 6, total = window.CUSTOMERS.length;
  const [start, setStart] = useDD(0);
  const rows = window.CUSTOMERS.slice(start, start + per);
  const cursor = btoa('id:' + (rows[0]?.id || '')).slice(0, 10);
  return (
    <div className="dx-block">
      <div className="dx-block-bar">
        <Icon.database style={{ width: 16, height: 16, color: 'var(--accent)' }} />
        <span className="mono" style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>cursor: <span style={{ color: 'var(--text-dim)' }}>{cursor}…</span></span>
      </div>
      <div className="dx-block-body flush">{rowList(rows)}</div>
      <div className="dx-block-bar" style={{ borderTop: '1px solid var(--border)', borderBottom: 0 }}>
        <span className="mono" style={{ fontSize: 12, color: 'var(--text-faint)' }}>{rows.length} per page</span>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="sm" leadingIcon="chevLeft" disabled={start === 0} onClick={() => setStart(s => Math.max(0, s - per))} style={{ opacity: start === 0 ? .4 : 1 }}>Prev</Button>
        <Button variant="ghost" size="sm" trailingIcon="chevRight" disabled={start + per >= total} onClick={() => setStart(s => s + per)} style={{ opacity: start + per >= total ? .4 : 1 }}>Next</Button>
      </div>
    </div>
  );
}

function LoadMore() {
  const total = window.CUSTOMERS.length, step = 7;
  const [count, setCount] = useDD(step);
  const [loading, setLoading] = useDD(false);
  const rows = window.CUSTOMERS.slice(0, count);
  const more = () => { setLoading(true); setTimeout(() => { setCount(c => Math.min(total, c + step)); setLoading(false); }, 550); };
  const done = count >= total;
  return (
    <div className="dx-block">
      <div className="dx-block-body flush" style={{ maxHeight: 360, overflowY: 'auto' }}>{rowList(rows)}</div>
      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><span className="eyebrow">Loaded</span><span className="mono" style={{ fontSize: 12, color: 'var(--text-dim)' }}>{rows.length} of {total}</span></div>
        <Progress value={count / total * 100} height={5} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
          {done
            ? <span className="mono" style={{ fontSize: 12, color: 'var(--text-faint)', display: 'inline-flex', alignItems: 'center', gap: 7 }}><Icon.checkCircle style={{ width: 15, height: 15, color: 'var(--success)' }} />All {total} loaded</span>
            : <Button variant="ghost" size="sm" leadingIcon={loading ? undefined : 'refresh'} onClick={more} disabled={loading}>{loading ? 'Loading…' : `Load ${Math.min(step, total - count)} more`}</Button>}
        </div>
      </div>
    </div>
  );
}

/* ============================= CHARTS ============================= */
function Pie({ data, size = 168 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2, cy = size / 2, r = size / 2 - 2;
  let a0 = -Math.PI / 2;
  const pt = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {data.map((d, i) => {
          const a1 = a0 + (d.value / total) * Math.PI * 2;
          const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
          const large = a1 - a0 > Math.PI ? 1 : 0;
          const path = `M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
          a0 = a1;
          return <path key={i} d={path} fill={d.color} stroke="var(--surface-1)" strokeWidth="2" />;
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5 }}>
            <i style={{ width: 9, height: 9, borderRadius: 3, background: d.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-dim)', flex: 1 }}>{d.label}</span>
            <span className="mono tnum" style={{ fontWeight: 600 }}>{Math.round(d.value / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DDCharts() {
  const pie = [
    { label: 'Enterprise', value: 42, color: 'var(--accent)' },
    { label: 'Growth', value: 28, color: 'var(--accent-2)' },
    { label: 'Pro', value: 19, color: '#34d399' },
    { label: 'Starter', value: 11, color: '#fbbf24' },
  ];
  return (
    <>
      <h2 className="dx-h2">Pie &amp; donut</h2>
      <div className="dx-grid two">
        <Demo title="Pie chart" desc="Full wedges"><Pie data={pie} /></Demo>
        <Demo title="Donut" desc="With center space"><Donut data={window.channelDonut} size={150} /></Demo>
      </div>
      <h2 className="dx-h2">Trend &amp; comparison</h2>
      <div className="dx-grid two">
        <div className="card"><CardHead title="Revenue" desc="Area · 30 days" /><div className="card-pad"><AreaChart series={[window.revenue30]} labels={window.dayLabels} height={210} /></div></div>
        <div className="card"><CardHead title="Sessions" desc="Bar · monthly" /><div className="card-pad"><BarChart data={window.trafficBars} labels={window.monthLabels} height={210} /></div></div>
      </div>
    </>
  );
}

Object.assign(window, { DataDisplaySection, Pie });
