// app.jsx — shell (sidebar + topbar), router, tweaks. Depends on all screens + tweaks-panel.
const { useState: useApp, useEffect: useAppEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": true,
  "accent": "#4a7cff",
  "font": "jakarta",
  "sidebar": "full",
  "corners": "round",
  "density": "comfortable",
  "bgAnim": true,
  "bgGlow": "#4a7cff"
}/*EDITMODE-END*/;

const FONTS = {
  jakarta: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
  grotesk: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
  sora: "'Sora', ui-sans-serif, system-ui, sans-serif",
  geist: "'Geist', ui-sans-serif, system-ui, sans-serif",
  manrope: "'Manrope', ui-sans-serif, system-ui, sans-serif",
  outfit: "'Outfit', ui-sans-serif, system-ui, sans-serif",
};

const ACCENTS = [
  '#4a7cff', // electric blue
  '#16b6c9', // cyan
  '#8b6cff', // violet
  '#1fb574', // emerald
  '#ff7a6b', // coral
  '#f5a524', // amber
  '#e75cff', // magenta
];

const NAV = [
  { group: 'Workspace', items: [
    { id: 'dashboard', label: 'Overview', icon: 'grid' },
    { id: 'analytics', label: 'Analytics', icon: 'chart' },
    { id: 'accounts', label: 'Accounts', icon: 'users', badge: String(CUSTOMERS.length) },
  ]},
  { group: 'Operations', items: [
    { id: 'approvals', label: 'Approvals', icon: 'checkCircle', badge: '5' },
    { id: 'insights', label: 'Insights', icon: 'sparkle' },
    { id: 'audit', label: 'Audit & restore', icon: 'shield' },
  ]},
  { group: 'System', items: [
    { id: 'notifications', label: 'Notifications', icon: 'bell', badge: '3' },
    { id: 'states', label: 'States', icon: 'layers' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ]},
  { group: 'Resources', items: [
    { id: 'library', label: 'Design system', icon: 'database', href: 'Vespera UI.html' },
  ]},
];

const TITLES = {
  dashboard: ['Overview', 'workspace / overview'],
  analytics: ['Analytics', 'workspace / analytics'],
  accounts: ['Accounts', 'workspace / accounts'],
  detail: ['Account', 'workspace / accounts / detail'],
  approvals: ['Approvals', 'operations / approvals'],
  insights: ['Insights', 'operations / insights'],
  audit: ['Audit & restore', 'operations / audit'],
  notifications: ['Notifications', 'system / notifications'],
  states: ['States', 'system / states'],
  settings: ['Settings', 'system / settings'],
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useApp('dashboard');
  const [selected, setSelected] = useApp(null);
  const [authed, setAuthed] = useApp(true);
  const [cmdOpen, setCmdOpen] = useApp(false);
  const [createOpen, setCreateOpen] = useApp(false);
  useCmdK(setCmdOpen);

  // apply theme tokens to root
  const rootStyle = { '--accent': t.accent, '--accent-ink': '#ffffff', '--font-sans': FONTS[t.font] || FONTS.jakarta, '--bg-accent': t.bgGlow };

  if (!authed) {
    return (
      <div className="vsp-root" data-theme={t.dark ? 'dark' : 'light'} data-corners={t.corners} data-bganim={t.bgAnim ? 'on' : 'off'} style={rootStyle}>
        {t.bgAnim && <div className="vsp-bg" aria-hidden="true"><b /><b /><b /></div>}
        <LoginScreen onSignIn={() => setAuthed(true)} />
        <TweaksUI t={t} setTweak={setTweak} />
      </div>
    );
  }

  const [title, crumb] = TITLES[screen] || ['', ''];
  const go = (id) => { setScreen(id); document.querySelector('.vsp-content')?.scrollTo(0, 0); };
  const openAccount = (c) => { setSelected(c); go('detail'); };

  const cmdGroups = [
    { label: 'Navigate', items: [
      { label: 'Overview', icon: 'grid', meta: 'G O', onRun: () => go('dashboard') },
      { label: 'Analytics', icon: 'chart', meta: 'G A', onRun: () => go('analytics') },
      { label: 'Accounts', icon: 'users', meta: 'G C', onRun: () => go('accounts') },
      { label: 'Approvals', icon: 'checkCircle', onRun: () => go('approvals') },
      { label: 'Insights', icon: 'sparkle', onRun: () => go('insights') },
      { label: 'Audit & restore', icon: 'shield', onRun: () => go('audit') },
      { label: 'Notifications', icon: 'bell', onRun: () => go('notifications') },
      { label: 'Settings', icon: 'settings', meta: 'G S', onRun: () => go('settings') },
      { label: 'Open design system library', icon: 'database', onRun: () => { window.location.href = 'Vespera UI.html'; } },
    ]},
    { label: 'Quick actions', items: [
      { label: 'Add account', icon: 'plus', onRun: () => { setCreateOpen(true); } },
      { label: 'Invite teammate', icon: 'mail', onRun: () => window.toast?.({ tone: 'pos', title: 'Invite sent', body: 'We emailed your teammate.' }) },
      { label: 'Export report', icon: 'download', onRun: () => window.toast?.({ tone: 'info', title: 'Export queued', body: 'Your CSV will download shortly.' }) },
      { label: 'New API key', icon: 'bolt', onRun: () => window.toast?.({ tone: 'pos', title: 'API key created' }) },
    ]},
    { label: 'Preferences', items: [
      { label: t.dark ? 'Switch to light mode' : 'Switch to dark mode', icon: t.dark ? 'sun' : 'moon', onRun: () => setTweak('dark', !t.dark) },
      { label: 'Toggle sidebar rail', icon: 'table', onRun: () => setTweak('sidebar', t.sidebar === 'rail' ? 'full' : 'rail') },
    ]},
    { label: 'Top accounts', items: [...CUSTOMERS].sort((a,b)=>b.mrr-a.mrr).slice(0,4).map(c => (
      { label: c.name, icon: 'user', meta: c.company, onRun: () => openAccount(c) }
    ))},
  ];

  return (
    <div className="vsp-root" data-theme={t.dark ? 'dark' : 'light'} data-sidebar={t.sidebar}
         data-corners={t.corners} data-density={t.density} data-bganim={t.bgAnim ? 'on' : 'off'} style={rootStyle}>
      {t.bgAnim && <div className="vsp-bg" aria-hidden="true"><b /><b /><b /></div>}
      <div className="vsp-app">
        <Sidebar screen={screen} go={go} onLogout={() => setAuthed(false)} rail={t.sidebar === 'rail'} />
        <div className="vsp-main">
          <Topbar title={title} crumb={crumb} t={t} setTweak={setTweak}
            onOpenCmd={() => setCmdOpen(true)} createOpen={createOpen} setCreateOpen={setCreateOpen} go={go} />
          <div className="vsp-content vsp-scroll">
            <div key={screen} className="vsp-screen">
              {screen === 'dashboard' && <DashboardScreen />}
              {screen === 'analytics' && <AnalyticsScreen />}
              {screen === 'accounts' && <TableScreen onOpen={openAccount} />}
              {screen === 'detail' && <DetailScreen customer={selected} onBack={() => go('accounts')} />}
              {screen === 'approvals' && <ApprovalsScreen />}
              {screen === 'insights' && <InsightsScreen />}
              {screen === 'audit' && <AuditScreen />}
              {screen === 'notifications' && <NotificationsScreen />}
              {screen === 'states' && <StatesScreen />}
              {screen === 'settings' && <SettingsScreen />}
            </div>
          </div>
        </div>
      </div>
      <TweaksUI t={t} setTweak={setTweak} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} groups={cmdGroups} />
      <CreateAccountDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <ToastHost />
    </div>
  );
}

function CreateAccountDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} icon="plus" title="Add account" desc="Create a new customer account in your workspace." maxWidth={460}
      footer={<><Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button><Button variant="primary" size="sm" onClick={() => { onClose(); window.toast?.({ tone: 'pos', title: 'Account created', body: 'The new account is live.' }); }}>Create account</Button></>}>
      <div style={{ display: 'grid', gap: 16 }}>
        <Field label="Company name" required><Input placeholder="Acme Inc." defaultValue="" /></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Owner email" required><Input type="email" placeholder="owner@acme.com" /></Field>
          <Field label="Plan"><Select options={PLANS} /></Field>
        </div>
        <Field label="Seats"><InputAffix type="number" defaultValue={5} leadingIcon="users" /></Field>
      </div>
    </Dialog>
  );
}

function Sidebar({ screen, go, onLogout, rail }) {
  const activeTop = screen === 'detail' ? 'accounts' : screen;
  return (
    <aside className="vsp-side">
      <div className="vsp-brand">
        <span className="vsp-brand-mark"><Icon.bolt style={{ width: 17, height: 17, color: '#fff', position: 'relative', zIndex: 1 }} /></span>
        <div className="vsp-brand-text">
          <div className="vsp-brand-name">Vespera</div>
          <div className="vsp-brand-sub">ADMIN · v1.0</div>
        </div>
      </div>
      <nav className="vsp-nav vsp-scroll">
        {NAV.map(g => (
          <React.Fragment key={g.group}>
            <div className="vsp-nav-group-label">{g.group}</div>
            {g.items.map(it => {
              const I = Icon[it.icon];
              const active = activeTop === it.id;
              if (it.href) {
                return (
                  <a key={it.id} href={it.href} className="vsp-nav-item" title={rail ? it.label : undefined} style={{ font: 'inherit', textDecoration: 'none' }}>
                    <I /><span className="vsp-nav-label">{it.label}</span><Icon.arrowRight className="vsp-nav-label" style={{ width: 14, height: 14, marginLeft: 'auto', color: 'var(--text-faint)' }} />
                  </a>
                );
              }
              return (
                <button key={it.id} className={`vsp-nav-item ${active ? 'active' : ''}`} onClick={() => go(it.id)}
                  title={rail ? it.label : undefined} style={{ font: 'inherit' }}>
                  <I /><span className="vsp-nav-label">{it.label}</span>
                  {it.badge && <span className="vsp-nav-badge">{it.badge}</span>}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </nav>
      <div className="vsp-side-foot">
        <div className="vsp-user" onClick={onLogout} title="Sign out">
          <Av name="Avery Quinn" hue={250} size={34} />
          <div className="vsp-user-text" style={{ flex: 1, minWidth: 0 }}>
            <div className="vsp-user-name">Avery Quinn</div>
            <div className="vsp-user-mail">avery@vespera.dev</div>
          </div>
          <Icon.logout className="vsp-user-chev" style={{ width: 16, height: 16, color: 'var(--text-faint)' }} />
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title, crumb, t, setTweak, onOpenCmd, createOpen, setCreateOpen, go }) {
  return (
    <header className="vsp-top">
      <button className="vsp-icon-btn" title="Toggle sidebar" onClick={() => setTweak('sidebar', t.sidebar === 'rail' ? 'full' : 'rail')}>
        <Icon.table />
      </button>
      <div className="vsp-top-title">
        <h1>{title}</h1>
        <span className="vsp-top-crumb">{crumb}</span>
      </div>
      <div className="vsp-top-spacer" />
      <a className="btn btn-ghost btn-sm" href="Vespera UI.html" title="Back to component library"><Icon.database />Library</a>
      <button className="vsp-search" onClick={onOpenCmd} style={{ cursor: 'pointer', font: 'inherit' }}>
        <Icon.search /><span style={{ flex: 1, textAlign: 'left', color: 'var(--text-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Search or jump to…</span><kbd>⌘K</kbd>
      </button>
      <DropdownMenu align="end" width={220}
        trigger={<button className="btn btn-primary btn-sm" style={{ height: 38 }}><Icon.plus />Create<Icon.chevDown style={{ width: 13, height: 13, opacity: .8 }} /></button>}
        items={[
          { label: 'Quick create', heading: true },
          { label: 'New account', icon: 'users', kbd: 'A', onClick: () => setCreateOpen(true) },
          { label: 'Invite teammate', icon: 'mail', kbd: 'I', onClick: () => window.toast?.({ tone: 'pos', title: 'Invite sent' }) },
          { label: 'New report', icon: 'doc', onClick: () => window.toast?.({ tone: 'info', title: 'Report created' }) },
          { sep: true },
          { label: 'New API key', icon: 'bolt', onClick: () => window.toast?.({ tone: 'pos', title: 'API key created' }) },
        ]} />
      <button className="vsp-icon-btn" title="Toggle theme" onClick={() => setTweak('dark', !t.dark)}>
        {t.dark ? <Icon.sun /> : <Icon.moon />}
      </button>
      <DropdownMenu align="end" width={300}
        trigger={<button className="vsp-icon-btn" title="Notifications"><Icon.bell /><span className="vsp-dot" /></button>}
        items={[
          { label: 'Notifications', heading: true },
          { label: 'Cobalt payment failed', icon: 'bell', onClick: () => {} },
          { label: 'Maya Okafor upgraded to Enterprise', icon: 'arrowUp', onClick: () => {} },
          { label: 'Vertex AI created a workspace', icon: 'plus', onClick: () => {} },
          { sep: true },
          { label: 'Mark all as read', icon: 'check', onClick: () => window.toast?.({ title: 'All caught up' }) },
        ]} />
    </header>
  );
}

function TweaksUI({ t, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakToggle label="Dark mode" value={t.dark} onChange={v => setTweak('dark', v)} />
      <TweakColor label="Accent" value={t.accent} options={ACCENTS} onChange={v => setTweak('accent', v)} />
      <TweakSection label="Background" />
      <TweakToggle label="Animated glow" value={t.bgAnim} onChange={v => setTweak('bgAnim', v)} />
      <TweakColor label="Glow color" value={t.bgGlow} options={ACCENTS} onChange={v => setTweak('bgGlow', v)} />
      <TweakSection label="Typography" />
      <TweakRadio label="Typeface" value={t.font}
        options={[{ value: 'jakarta', label: 'Jakarta' }, { value: 'grotesk', label: 'Grotesk' }, { value: 'sora', label: 'Sora' }, { value: 'geist', label: 'Geist' }, { value: 'manrope', label: 'Manrope' }, { value: 'outfit', label: 'Outfit' }]}
        onChange={v => setTweak('font', v)} />
      <TweakSection label="Layout" />
      <TweakRadio label="Sidebar" value={t.sidebar}
        options={[{ value: 'full', label: 'Full' }, { value: 'rail', label: 'Rail' }, { value: 'float', label: 'Float' }]}
        onChange={v => setTweak('sidebar', v)} />
      <TweakRadio label="Corners" value={t.corners}
        options={[{ value: 'round', label: 'Round' }, { value: 'soft', label: 'Soft' }, { value: 'sharp', label: 'Sharp' }]}
        onChange={v => setTweak('corners', v)} />
      <TweakRadio label="Density" value={t.density}
        options={[{ value: 'compact', label: 'Compact' }, { value: 'comfortable', label: 'Comfort' }, { value: 'spacious', label: 'Spacious' }]}
        onChange={v => setTweak('density', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
