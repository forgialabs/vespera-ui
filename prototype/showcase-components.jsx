// showcase-components.jsx — Data Display, Feedback & Overlays, Navigation sections.
const { useState: useC } = React;

/* ===================== DATA DISPLAY ===================== */
function DataDisplaySection() {
  const [page, setPage] = useC(2);
  return (
    <>
      <h1 className="dx-h1">Data Display</h1>
      <p className="dx-lede">Badges, avatars, meters and tables — the vocabulary for status, identity and dense operational data.</p>

      <h2 className="dx-h2">Badges &amp; status</h2>
      <Demo>
        <Badge tone="pos" dot>Active</Badge>
        <Badge tone="info" dot>Trial</Badge>
        <Badge tone="warn" dot>Pending</Badge>
        <Badge tone="neg" dot>Churned</Badge>
        <Badge tone="muted">Paused</Badge>
        <Badge tone="info">v1.0</Badge>
      </Demo>

      <h2 className="dx-h2">Avatars &amp; identity</h2>
      <Demo>
        <Av name="Maya Okafor" hue={220} size={44} />
        <Av name="Leo Vega" hue={150} size={44} />
        <Av name="Vertex AI" hue={285} size={44} />
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

      <h2 className="dx-h2">Table</h2>
      <div className="dx-block"><div className="dx-block-body flush"><table className="ui-table">
        <thead><tr>
          <th><span className="eyebrow">Account</span></th><th><span className="eyebrow">Plan</span></th>
          <th><span className="eyebrow">Status</span></th><th style={{ textAlign: 'right' }}><span className="eyebrow">MRR</span></th>
        </tr></thead>
        <tbody>
          {window.CUSTOMERS.slice(0, 4).map(c => { const st = window.STATUSES[c.status]; return (
            <tr key={c.id}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><Av name={c.name} hue={c.hue} size={30} /><div><div style={{ fontWeight: 600 }}>{c.name}</div><div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{c.company}</div></div></div></td>
              <td style={{ fontWeight: 600 }}>{c.plan}</td>
              <td><Badge tone={st.cls.replace('badge-', '')} dot>{st.label}</Badge></td>
              <td style={{ textAlign: 'right', fontWeight: 700 }} className="tnum">${c.mrr.toLocaleString()}</td>
            </tr>
          ); })}
        </tbody>
      </table></div></div>

      <h2 className="dx-h2">Pagination</h2>
      <Demo center><Pagination page={page} pages={12} onPage={setPage} /></Demo>
    </>
  );
}

/* ===================== FEEDBACK & OVERLAYS ===================== */
function FeedbackSection() {
  const [dlg, setDlg] = useC(false);
  const [confirm, setConfirm] = useC(false);
  const [sheet, setSheet] = useC(false);
  return (
    <>
      <h1 className="dx-h1">Feedback &amp; Overlays</h1>
      <p className="dx-lede">Alerts, toasts, dialogs and drawers — all portalled, escape-dismissable, and theme-aware. Try them live.</p>

      <h2 className="dx-h2">Alerts</h2>
      <Demo col>
        <Alert tone="info" title="Heads up">Usage-based billing is now live for Growth plans.</Alert>
        <Alert tone="pos" title="Payment received">Invoice #4821 was paid successfully.</Alert>
        <Alert tone="warn" title="Quota nearly reached">Cobalt is at 92% of its API quota this cycle.</Alert>
        <Alert tone="neg" title="Payment failed" action={<Button variant="ghost" size="sm">Retry</Button>}>We couldn't charge the card on file for Driftwood.</Alert>
      </Demo>

      <h2 className="dx-h2">Toasts</h2>
      <Demo>
        <Button variant="ghost" onClick={() => window.toast({ tone: 'pos', title: 'Saved', body: 'Your changes are live.' })}>Success toast</Button>
        <Button variant="ghost" onClick={() => window.toast({ tone: 'neg', title: 'Upload failed', body: 'The file was too large.' })}>Error toast</Button>
        <Button variant="ghost" onClick={() => window.toast({ tone: 'info', title: 'Export queued', body: 'We\u2019ll email you when it\u2019s ready.' })}>Info toast</Button>
      </Demo>

      <h2 className="dx-h2">Dialogs &amp; drawers</h2>
      <Demo>
        <Button variant="primary" onClick={() => setDlg(true)}>Open dialog</Button>
        <Button variant="ghost" onClick={() => setConfirm(true)}>Confirm dialog</Button>
        <Button variant="ghost" leadingIcon="layers" onClick={() => setSheet(true)}>Open drawer</Button>
      </Demo>

      <h2 className="dx-h2">Tooltip &amp; skeleton</h2>
      <div className="dx-grid two">
        <Demo title="Tooltip" center>
          <Tooltip label="Sync now"><IconButton icon="refresh" label="" /></Tooltip>
          <Tooltip label="Pinned to top"><IconButton icon="pin" label="" /></Tooltip>
          <Tooltip label="View details"><Button variant="ghost" size="sm">Hover me</Button></Tooltip>
        </Demo>
        <Demo title="Skeleton" col>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%' }}><Skeleton w={40} h={40} r={20} /><div style={{ flex: 1 }}><Skeleton w="60%" h={11} style={{ marginBottom: 8 }} /><Skeleton w="40%" h={9} /></div></div>
          <Skeleton h={64} r={10} />
        </Demo>
      </div>

      <h2 className="dx-h2">Banners</h2>
      <Demo col>
        <Banner tone="accent" action={<Button variant="ghost" size="sm" style={{ background: 'rgba(255,255,255,.18)', color: '#fff' }}>Upgrade</Button>}>You're on a 14-day trial — 6 days left.</Banner>
        <Banner tone="info" onDismiss={() => {}}>Scheduled maintenance this Sunday at 02:00 UTC.</Banner>
        <Banner tone="warn" onDismiss={() => {}}>Two invoices are overdue and need attention.</Banner>
      </Demo>

      <h2 className="dx-h2">Spinners &amp; circular progress</h2>
      <Demo>
        <CircularProgress value={72} />
        <CircularProgress value={42} size={76} color="var(--success)" />
        <CircularProgress value={88} size={76} color="var(--warning)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 8 }}><Spinner size="lg" /><Spinner /></div>
      </Demo>

      <h2 className="dx-h2">Empty states</h2>
      <div className="dx-block"><EmptyState icon="inbox" title="No accounts yet" desc="When you add your first account it'll show up here with live revenue and usage."
        action={<><Button variant="ghost" size="sm" leadingIcon="download">Import CSV</Button><Button variant="primary" size="sm" leadingIcon="plus">Add account</Button></>} /></div>

      <Dialog open={dlg} onClose={() => setDlg(false)} icon="bolt" title="Upgrade workspace" desc="Move Aether Labs to the Enterprise plan with SSO and priority support."
        footer={<><Button variant="ghost" size="sm" onClick={() => setDlg(false)}>Not now</Button><Button variant="primary" size="sm" onClick={() => { setDlg(false); window.toast({ tone: 'pos', title: 'Upgraded to Enterprise' }); }}>Upgrade</Button></>}>
        <div style={{ display: 'grid', gap: 14 }}>
          <Field label="Billing cycle"><Select options={['Monthly · $2,400', 'Annual · $24,000 (save 17%)']} /></Field>
          <Alert tone="info">Your card ending 4242 will be charged at the start of the next cycle.</Alert>
        </div>
      </Dialog>

      <Dialog open={confirm} onClose={() => setConfirm(false)} icon="x" tone="neg" title="Delete account?" desc="This permanently removes Driftwood and all associated data. This action cannot be undone." maxWidth={420}
        footer={<><Button variant="ghost" size="sm" onClick={() => setConfirm(false)}>Cancel</Button><Button variant="primary" size="sm" className="btn-danger" onClick={() => { setConfirm(false); window.toast({ tone: 'neg', title: 'Account deleted' }); }} style={{ background: 'var(--danger)' }}>Delete</Button></>} />

      <Sheet open={sheet} onClose={() => setSheet(false)} icon="user" title="Maya Okafor" desc="Enterprise · Northwind"
        footer={<><Button variant="ghost" size="sm" style={{ flex: 1 }} onClick={() => setSheet(false)}>Close</Button><Button variant="primary" size="sm" style={{ flex: 1 }}>Manage</Button></>}>
        <div style={{ display: 'grid', gap: 16 }}>
          <Alert tone="pos" title="Healthy account">Net retention is up 8% this quarter.</Alert>
          {[['Account ID', 'ATG-4810'], ['MRR', '$1,840'], ['Seats', '48'], ['Region', 'us-east-1'], ['Owner', 'Maya Okafor']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}><span className="eyebrow">{k}</span><span className="mono" style={{ fontSize: 12.5, fontWeight: 500 }}>{v}</span></div>
          ))}
        </div>
      </Sheet>
    </>
  );
}

/* ===================== NAVIGATION ===================== */
function NavigationSection() {
  const [tab, setTab] = useC('overview');
  const [vtab, setVtab] = useC('workspace');
  const [seg, setSeg] = useC('30D');
  return (
    <>
      <h1 className="dx-h1">Navigation</h1>
      <p className="dx-lede">Tabs, segmented controls, breadcrumbs, menus and the command palette — everything needed to move through a dense admin surface.</p>

      <h2 className="dx-h2">Tabs</h2>
      <Demo col style={{ alignItems: 'stretch' }}>
        <Tabs value={tab} onChange={setTab} tabs={[{ value: 'overview', label: 'Overview' }, { value: 'usage', label: 'Usage', count: 3 }, { value: 'billing', label: 'Billing' }, { value: 'team', label: 'Team', count: 12 }]} />
        <div style={{ padding: '18px 4px', color: 'var(--text-dim)', fontSize: 13.5 }}>Showing the <b style={{ color: 'var(--text)' }}>{tab}</b> tab.</div>
      </Demo>

      <h2 className="dx-h2">Segmented &amp; breadcrumb</h2>
      <div className="dx-grid two">
        <Demo title="Segmented control"><Segmented options={['7D', '30D', '90D', 'YTD']} value={seg} onChange={setSeg} /></Demo>
        <Demo title="Breadcrumb"><Breadcrumb items={['Workspace', 'Accounts', 'Northwind']} /></Demo>
      </div>

      <h2 className="dx-h2">Menus &amp; popovers</h2>
      <Demo>
        <DropdownMenu align="start"
          trigger={<Button variant="ghost" trailingIcon="chevDown">Actions</Button>}
          items={[
            { label: 'Manage', heading: true },
            { label: 'Edit account', icon: 'settings', kbd: 'E' },
            { label: 'Send message', icon: 'mail' },
            { label: 'Export data', icon: 'download' },
            { sep: true },
            { label: 'Delete', icon: 'x', danger: true },
          ]} />
        <Popover align="start" width={280}
          trigger={<Button variant="ghost" leadingIcon="filter">Filters</Button>}>
          <div style={{ display: 'grid', gap: 12 }}>
            <div className="eyebrow">Refine</div>
            <Field label="Status"><Select options={['Any', 'Active', 'Trial', 'Churned']} /></Field>
            <Field label="Min MRR"><InputAffix type="number" prefix="$" defaultValue={500} /></Field>
            <Button variant="primary" size="sm">Apply filters</Button>
          </div>
        </Popover>
        <Tooltip label="⌘K"><Button variant="ghost" leadingIcon="search" onClick={() => window.__openCmd?.()}>Command palette</Button></Tooltip>
      </Demo>

      <h2 className="dx-h2">Stepper</h2>
      <Demo center><Stepper steps={['Account', 'Plan', 'Payment', 'Done']} current={2} /></Demo>

      <h2 className="dx-h2">Accordion</h2>
      <Accordion defaultOpen={[0]} items={[
        { icon: 'shield', title: 'How is my data secured?', body: 'All data is encrypted at rest and in transit. Audit logs are tamper-evident with a hash chain, and SSO + 2FA are available on every plan.' },
        { icon: 'card', title: 'Can I change plans later?', body: 'Yes — upgrade or downgrade anytime. Changes are prorated and reflected on your next invoice.' },
        { icon: 'users', title: 'Is there a seat limit?', body: 'Starter and Growth scale by seat; Enterprise includes unlimited seats with volume pricing.' },
      ]} />

      <h2 className="dx-h2">Vertical tabs &amp; nested nav</h2>
      <div className="dx-grid two">
        <Demo title="Vertical tabs" style={{ alignItems: 'flex-start' }}>
          <div style={{ width: '100%', maxWidth: 230 }}>
            <VerticalTabs value={vtab} onChange={setVtab} tabs={[
              { value: 'profile', label: 'Profile', icon: 'user' },
              { value: 'workspace', label: 'Workspace', icon: 'grid' },
              { value: 'billing', label: 'Billing', icon: 'card' },
              { value: 'notifications', label: 'Notifications', icon: 'bell', badge: 3 },
              { value: 'security', label: 'Security', icon: 'shield' },
            ]} />
          </div>
        </Demo>
        <Demo title="Nested / collapsible nav" style={{ alignItems: 'flex-start' }}>
          <div className="ui-nav" style={{ width: '100%', maxWidth: 230 }}>
            <NavItem icon="grid" label="Overview" active onClick={() => {}} />
            <NavGroup icon="users" label="Accounts" defaultOpen>
              <NavItem label="All accounts" badge={42} onClick={() => {}} sub />
              <NavItem label="Segments" onClick={() => {}} sub />
              <NavItem label="Imports" onClick={() => {}} sub />
            </NavGroup>
            <NavGroup icon="settings" label="System">
              <NavItem label="Audit log" onClick={() => {}} sub />
              <NavItem label="Webhooks" onClick={() => {}} sub />
            </NavGroup>
          </div>
        </Demo>
      </div>
    </>
  );
}

Object.assign(window, { DataDisplaySection, FeedbackSection, NavigationSection });
