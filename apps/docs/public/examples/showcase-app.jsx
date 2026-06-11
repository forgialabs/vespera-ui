// showcase-app.jsx — Vespera UI docs shell: sidebar nav, router, command palette.
const { useState: useS, useEffect: useSE } = React;

const SC_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": true,
  "accent": "var(--c-blue)",
  "accent2": "var(--c-violet)",
  "font": "jakarta",
  "sidebar": "full",
  "corners": "round",
  "density": "comfortable",
  "bgAnim": true,
  "bgGlow": "var(--c-blue)"
}/*EDITMODE-END*/;
const SC_ACCENTS = ['var(--c-blue)', 'var(--c-cyan)', 'var(--c-indigo)', 'var(--c-violet)', 'var(--c-emerald)', 'var(--c-coral)', 'var(--c-amber)', 'var(--c-magenta)'];
const SC_FONTS = {
  jakarta: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
  grotesk: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
  sora: "'Sora', ui-sans-serif, system-ui, sans-serif",
  geist: "'Geist', ui-sans-serif, system-ui, sans-serif",
  manrope: "'Manrope', ui-sans-serif, system-ui, sans-serif",
  outfit: "'Outfit', ui-sans-serif, system-ui, sans-serif",
};

const SC_NAV = [
  { group: 'Get started', items: [{ id: 'overview', label: 'Overview', icon: 'sparkle' }, { id: 'foundations', label: 'Foundations', icon: 'layers' }] },
  { group: 'Components', items: [
    { id: 'buttons', label: 'Buttons & Actions', icon: 'bolt' },
    { id: 'forms', label: 'Forms & Inputs', icon: 'doc' },
    { id: 'data', label: 'Data Display', icon: 'table', children: [
      { id: 'essentials', label: 'Essentials' }, { id: 'tables', label: 'Tables' },
      { id: 'pagination', label: 'Pagination' }, { id: 'charts', label: 'Charts' },
    ] },
    { id: 'feedback', label: 'Feedback & Overlays', icon: 'bell' },
    { id: 'nav', label: 'Navigation', icon: 'grid' },
  ]},
  { group: 'Blocks', items: [
    { id: 'b-dash', label: 'Dashboards', icon: 'chart' },
    { id: 'b-ops', label: 'Tables & Ops', icon: 'database' },
    { id: 'b-forms', label: 'Forms & Wizards', icon: 'inbox' },
    { id: 'b-auth', label: 'Auth', icon: 'shield' },
  ]},
  { group: 'Resources', items: [{ id: 'docs', label: 'Documentation', icon: 'doc', children: [
      { id: 'start', label: 'Get started' }, { id: 'modular', label: 'Modularity' },
      { id: 'api', label: 'Components API' }, { id: 'theming', label: 'Theming' },
    ] }, { id: 'changelog', label: 'Changelog', icon: 'clock' }, { id: 'templates', label: 'Templates', icon: 'globe' }] },
];
const SC_LABELS = Object.fromEntries(SC_NAV.flatMap(g => g.items.map(i => [i.id, i.label])));

// Searchable component index: every component → page (+ data sub-tab) + heading to scroll to.
const SC_INDEX = [
  { cat: 'Foundations', page: 'foundations', items: [
    ['Colors & tokens', 'Color', 'palette swatch accent semantic neutral'],
    ['Typography', 'Typography', 'font type scale text'],
    ['Radius & elevation', 'Radius', 'corner shadow'],
    ['Icons', 'Iconography', 'icon glyph'],
  ]},
  { cat: 'Buttons & Actions', page: 'buttons', items: [
    ['Button', 'Variants', 'primary ghost subtle cta'],
    ['Icon button', 'Sizes', 'icon'],
    ['Loading button', 'Loading', 'spinner busy'],
    ['Spinner', 'Loading', 'loading busy'],
    ['Copy button', 'Loading', 'clipboard copy'],
  ]},
  { cat: 'Forms & Inputs', page: 'forms', items: [
    ['Text input', 'Text fields', 'field email number'],
    ['Textarea', 'Text fields', 'multiline notes'],
    ['Select (themed)', 'Text fields', 'dropdown'],
    ['Combobox · searchable select', 'Searchable selects', 'autocomplete typeahead'],
    ['Multi-select', 'Searchable selects', 'tags multiple'],
    ['Token / creatable input', 'Searchable selects', 'tags chips'],
    ['Checkbox', 'Selection controls', 'check'],
    ['Radio group', 'Selection controls', 'radio'],
    ['Switch / toggle', 'Selection controls', 'toggle'],
    ['Slider', 'Selection controls', 'range'],
    ['Date picker', 'Date & time', 'calendar day'],
    ['Date range picker', 'Date & time', 'calendar range period'],
    ['File upload / dropzone', 'Upload & verification', 'drop attach'],
    ['OTP / one-time code', 'Upload & verification', 'pin code verify'],
    ['Number stepper', 'Stepper & inline edit', 'quantity increment'],
    ['Inline edit', 'Stepper & inline edit', 'edit in place'],
    ['Tags', 'Tags', 'chip token'],
  ]},
  { cat: 'Data Display', page: 'data', items: [
    ['Badge / status', null, 'pill status', 'essentials', 'Badges'],
    ['Avatar', null, 'user photo', 'essentials', 'Avatars'],
    ['Avatar group', null, 'stack people', 'essentials', 'Avatars'],
    ['Progress & meters', null, 'bar percent', 'essentials', 'Progress'],
    ['KPI / stat card', null, 'metric number', 'essentials', 'KPI'],
    ['Timeline', null, 'activity feed history', 'essentials', 'Timeline'],
    ['Tree view', null, 'hierarchy nested', 'essentials', 'Tree'],
    ['Description list', null, 'key value details', 'essentials', 'Tree'],
    ['Power table', null, 'data grid sort filter', 'tables', 'Power table'],
    ['Universal search table', null, 'filter search', 'tables', 'Universal search'],
    ['Per-column filters', null, 'column filter', 'tables', 'Per-column'],
    ['Sticky / frozen columns', null, 'freeze pinned', 'tables', 'Sticky'],
    ['Nested / combo order', null, 'expandable rows', 'tables', 'Nested'],
    ['Single order detail', null, 'invoice line items', 'tables', 'Single custom'],
    ['Offset pagination', null, 'pages', 'pagination', 'Offset'],
    ['Cursor pagination', null, 'next prev cursor', 'pagination', 'Cursor'],
    ['Load more', null, 'infinite total', 'pagination', 'Load more'],
    ['Pie chart', null, 'chart', 'charts', 'Pie'],
    ['Donut chart', null, 'chart ring', 'charts', 'Pie'],
    ['Bar chart', null, 'chart', 'charts', 'Trend'],
    ['Area chart', null, 'chart line', 'charts', 'Trend'],
  ]},
  { cat: 'Feedback & Overlays', page: 'feedback', items: [
    ['Alert / callout', 'Alerts', 'inline message'],
    ['Toast', 'Toasts', 'notification snackbar'],
    ['Banner', 'Banners', 'announcement bar'],
    ['Dialog / modal', 'Dialogs', 'popup confirm'],
    ['Drawer / sheet', 'Dialogs', 'side panel'],
    ['Tooltip', 'Tooltip', 'hint'],
    ['Skeleton', 'Tooltip', 'loading placeholder'],
    ['Circular progress', 'Spinners', 'ring percent'],
    ['Empty state', 'Empty', 'no data placeholder'],
  ]},
  { cat: 'Navigation', page: 'nav', items: [
    ['Tabs', 'Tabs', 'tab'],
    ['Segmented control', 'Segmented', 'toggle group'],
    ['Breadcrumb', 'Segmented', 'path'],
    ['Dropdown menu', 'Menus', 'context actions'],
    ['Popover', 'Menus', 'overlay'],
    ['Command palette', 'Menus', 'cmdk search'],
    ['Stepper', 'Stepper', 'wizard progress'],
    ['Accordion', 'Accordion', 'collapse expand faq'],
  ]},
  { cat: 'Blocks', items: [
    ['Dashboard / metrics', 'b-dash', 'kpi overview', null, 'Metrics'],
    ['Orders table', 'b-ops', 'operational', null, 'Orders'],
    ['Team & roles', 'b-ops', 'members permissions', null, 'Team'],
    ['System status', 'b-ops', 'health uptime monitor', null, 'System status'],
    ['API keys', 'b-ops', 'secret credentials', null, 'API keys'],
    ['Audit log', 'b-ops', 'history trail', null, 'Audit log'],
    ['Kanban board', 'b-ops', 'drag board triage', null, 'Operations board'],
    ['Onboarding wizard', 'b-forms', 'multi step', null, 'Onboarding'],
    ['Account form', 'b-forms', 'create edit record', null, 'Create account'],
    ['Billing / payment form', 'b-forms', 'card checkout', null, 'Payment'],
    ['Advanced filter panel', 'b-forms', 'filters', null, 'Advanced filters'],
    ['Sign-in / auth card', 'b-auth', 'login', null, 'Sign-in'],
  ]},
];

function Showcase() {
  const [t, setTweak] = useTweaks(SC_DEFAULTS);
  const [page, setPage] = useS('overview');
  const [cmd, setCmd] = useS(false);
  const [navClosed, setNavClosed] = useS(() => new Set());
  const [dataSub, setDataSub] = useS('essentials');
  const [docSub, setDocSub] = useS('start');
  const curSub = (id) => id === 'data' ? dataSub : id === 'docs' ? docSub : null;
  const setSubFor = (id, s) => { (id === 'data' ? setDataSub : setDocSub)(s); };
  const toggleGrp = (name) => setNavClosed(s => { const n = new Set(s); n.has(name) ? n.delete(name) : n.add(name); return n; });
  useCmdK(setCmd);
  useSE(() => { window.__openCmd = () => setCmd(true); }, []);
  const go = (id) => { setPage(id); document.querySelector('.dx-main')?.scrollTo(0, 0); };

  const goToSec = (id, sub, anchor) => {
    setPage(id);
    document.querySelector('.dx-main')?.scrollTo(0, 0);
    if (sub) setTimeout(() => window.__dataSub?.(sub), 60);
    if (anchor) setTimeout(() => {
      const main = document.querySelector('.dx-main');
      const els = [...document.querySelectorAll('.dx-content h1, .dx-content h2, .dx-content h3, .dx-demo-title')];
      const tgt = els.find(e => e.textContent.trim().toLowerCase().includes(anchor.toLowerCase()));
      if (tgt && main) { const top = tgt.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 80; main.scrollTo({ top, behavior: 'smooth' }); }
    }, sub ? 240 : 110);
  };

  const cmdGroups = SC_INDEX.map(g => ({
    label: g.cat,
    items: g.items.map(it => {
      let page, sub = null, anchor, kw;
      if (!g.page) { page = it[1]; kw = it[2]; sub = it[3] || null; anchor = it[4]; }
      else if (g.page === 'data') { page = 'data'; kw = it[2]; sub = it[3] || null; anchor = it[4]; }
      else { page = g.page; anchor = it[1]; kw = it[2]; }
      return { label: it[0], keywords: kw, onRun: () => goToSec(page, sub, anchor) };
    }),
  }));

  return (
    <div className="ag-root" data-theme={t.dark ? 'dark' : 'light'} data-corners={t.corners} data-density={t.density} data-dxside={t.sidebar} data-bganim={t.bgAnim ? 'on' : 'off'}
         style={{ '--accent': t.accent, '--accent-2': t.accent2, '--accent-ink': '#fff', '--font-sans': SC_FONTS[t.font] || SC_FONTS.jakarta, '--bg-accent': t.bgGlow }}>
      {t.bgAnim && <div className="ag-bg" aria-hidden="true"><b /><b /><b /></div>}
      <div className="dx-shell">
        <aside className="dx-side">
          <div className="dx-side-head">
            <span className="ag-brand-mark"><Icon.bolt style={{ width: 17, height: 17, color: '#fff', position: 'relative', zIndex: 1 }} /></span>
            <div className="dx-side-text"><div style={{ fontWeight: 700, fontSize: 15 }}>Vespera</div><div className="mono" style={{ fontSize: 9.5, color: 'var(--text-faint)', letterSpacing: '.1em' }}>UI · v1.0</div></div>
          </div>
          <nav className="dx-nav ag-scroll">
            {SC_NAV.map(g => {
              const open = !navClosed.has(g.group);
              return (
                <div key={g.group}>
                  <button className="dx-nav-group" onClick={() => toggleGrp(g.group)} style={{ alignItems: 'center', gap: 8, width: '100%', border: 0, background: 'transparent', cursor: 'pointer' }}>
                    <span>{g.group}</span>
                    <Icon.chevRight style={{ width: 13, height: 13, marginLeft: 'auto', color: 'var(--text-faint)', transition: 'transform .2s', transform: open ? 'rotate(90deg)' : 'none' }} />
                  </button>
                  <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows .22s cubic-bezier(.4,.6,.3,1)' }}>
                    <div style={{ overflow: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {g.items.map(it => { const I = Icon[it.icon];
                        if (it.children) {
                          const exp = page === it.id;
                          return (
                            <div key={it.id}>
                              <button title={it.label} className={cx('dx-nav-item', page === it.id && 'on')} onClick={() => { go(it.id); }}>
                                <I /><span className="dx-nav-label">{it.label}</span><Icon.chevRight className="dx-nav-label" style={{ width: 13, height: 13, marginLeft: 'auto', color: 'var(--text-faint)', transition: 'transform .2s', transform: exp ? 'rotate(90deg)' : 'none' }} />
                              </button>
                              <div style={{ display: 'grid', gridTemplateRows: exp ? '1fr' : '0fr', transition: 'grid-template-rows .22s cubic-bezier(.4,.6,.3,1)' }}>
                                <div style={{ overflow: 'hidden', minHeight: 0 }}>
                                  <div className="dx-nav-label" style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '2px 0 2px 16px', paddingLeft: 4, borderLeft: '1px solid var(--border)' }}>
                                    {it.children.map(ch => (
                                      <button key={ch.id} className={cx('dx-nav-item', page === it.id && curSub(it.id) === ch.id && 'on')} style={{ fontSize: 12.5, padding: '6px 10px' }} onClick={() => { setPage(it.id); setSubFor(it.id, ch.id); document.querySelector('.dx-main')?.scrollTo(0, 0); }}>{ch.label}</button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <button key={it.id} title={it.label} className={cx('dx-nav-item', page === it.id && 'on')} onClick={() => go(it.id)}><I /><span className="dx-nav-label">{it.label}</span></button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="dx-main ag-scroll">
          <div className="dx-top">
            <button className="ag-icon-btn" title="Toggle sidebar" onClick={() => setTweak('sidebar', { full: 'compact', compact: 'float', float: 'hidden', hidden: 'full' }[t.sidebar] || 'full')}><Icon.table /></button>
            <button className="ag-search" onClick={() => setCmd(true)} style={{ cursor: 'pointer', font: 'inherit', width: 260 }}>
              <Icon.search /><span style={{ flex: 1, textAlign: 'left', color: 'var(--text-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Search components &amp; blocks…</span><kbd>⌘K</kbd>
            </button>
            <div className="ag-top-spacer" />
            <a className="btn btn-ghost btn-sm" href="admin.html"><Icon.grid />Live admin demo</a>
            <button className="ag-icon-btn" title="Toggle theme" onClick={() => setTweak('dark', !t.dark)}>{t.dark ? <Icon.sun /> : <Icon.moon />}</button>
            <a className="ag-icon-btn" href="https://github.com" title="Source" onClick={e => e.preventDefault()}><Icon.doc /></a>
          </div>

          <div className={cx('dx-content', String(page).startsWith('b-') && 'wide')}>
            <div key={page} className="ag-screen">
              {page === 'overview' && <OverviewPage go={go} />}
              {page === 'foundations' && <FoundationsSection t={t} setTweak={setTweak} />}
              {page === 'buttons' && <ButtonsSection />}
              {page === 'forms' && <FormsSection />}
              {page === 'data' && <DataDisplaySection sub={dataSub} onSub={setDataSub} />}
              {page === 'feedback' && <FeedbackSection />}
              {page === 'nav' && <NavigationSection />}
              {page === 'b-dash' && <DashboardsBlockPage />}
              {page === 'b-ops' && <OpsBlockPage />}
              {page === 'b-forms' && <FormsBlockPage />}
              {page === 'b-auth' && <AuthBlockPage />}
              {page === 'docs' && <DocsSection sub={docSub} onSub={setDocSub} />}
              {page === 'changelog' && <ChangelogSection />}
              {page === 'templates' && <TemplatesPage />}
            </div>
          </div>
        </main>
      </div>

      <SCTweaks t={t} setTweak={setTweak} />
      <CommandPalette open={cmd} onClose={() => setCmd(false)} groups={cmdGroups} />
      <ToastHost />
    </div>
  );
}

/* ---------- Overview ---------- */
function OverviewPage({ go }) {
  const feats = [
    ['layers', 'Token-driven', 'One set of CSS variables drives light, dark, three densities and three corner styles. Re-theme the whole system from a single accent.'],
    ['bolt', 'Composable primitives', '25+ prop-driven React components — buttons, inputs, overlays, tables — that you copy in and own outright.'],
    ['database', 'Ready-made blocks', 'Pre-composed operational surfaces: orders, roles, audit logs, wizards and billing forms. Start from a use case, not a blank file.'],
  ];
  return (
    <>
      <div className="eyebrow" style={{ marginBottom: 14 }}>Vespera · Design System v1.0</div>
      <h1 className="dx-h1" style={{ fontSize: 40, maxWidth: 720 }}>A weightless component system for admin &amp; operational software.</h1>
      <p className="dx-lede">Vespera is a deep-space design language and React component library built for dense, data-heavy products. Flexible enough to reskin per product, complete enough to ship a console today.</p>
      <div style={{ display: 'flex', gap: 10, margin: '26px 0 8px' }}>
        <Button variant="primary" leadingIcon="bolt" onClick={() => go('foundations')}>Explore foundations</Button>
        <Button variant="ghost" leadingIcon="database" onClick={() => go('b-ops')}>Browse blocks</Button>
      </div>

      <h2 className="dx-h2">What's inside</h2>
      <div className="dx-grid three">
        {feats.map(([ic, t2, d]) => { const I = Icon[ic]; return (
          <div key={t2} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ width: 40, height: 40, borderRadius: 11, display: 'grid', placeItems: 'center', background: 'color-mix(in oklab, var(--accent) 13%, transparent)', color: 'var(--accent)' }}><I style={{ width: 20, height: 20 }} /></span>
            <div className="dx-h3">{t2}</div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.55 }}>{d}</p>
          </div>
        ); })}
      </div>

      <h2 className="dx-h2">Everything's included — free &amp; open source</h2>
      <div className="dx-grid two">
        <div className="card card-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}><b style={{ fontSize: 15 }}>Components</b><Badge tone="success" dot>Open source</Badge></div>
          {['All foundations & tokens', '40+ primitives & widgets', 'Overlays & command palette', 'Light / dark / density / corners'].map(x => <div key={x} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', fontSize: 13.5 }}><Icon.check style={{ width: 16, height: 16, color: 'var(--success)' }} />{x}</div>)}
        </div>
        <div className="card card-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}><b style={{ fontSize: 15 }}>Blocks &amp; templates</b><Badge tone="success" dot>Open source</Badge></div>
          {['Operational tables & boards', 'Multi-step wizards & forms', 'Billing, auth & dashboard layouts', 'Full admin template'].map(x => <div key={x} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', fontSize: 13.5 }}><Icon.check style={{ width: 16, height: 16, color: 'var(--success)' }} />{x}</div>)}
        </div>
      </div>
    </>
  );
}

/* ---------- block pages ---------- */
function ProHeader({ title, lede }) {
  return (
    <>
      <h1 className="dx-h1" style={{ marginBottom: 12 }}>{title}</h1>
      <p className="dx-lede" style={{ marginTop: 0 }}>{lede}</p>
      <div style={{ height: 28 }} />
    </>
  );
}
function DashboardsBlockPage() {
  return (
    <>
      <ProHeader title="Dashboards" lede="Composable KPI rows, charts and activity — assembled from primitives into ready overview layouts." />
      <Block title="Metrics overview" desc="A KPI row plus a revenue chart and channel breakdown.">
        <div className="dx-block-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="grid stat-grid">
            <StatCard icon="dollar" label="MRR" value="$248.9k" delta="12.4%" deltaDir="up" spark={window.revenue30.slice(-12)} />
            <StatCard icon="users" label="Accounts" value="3,914" delta="6.1%" deltaDir="up" spark={[40,44,48,52,55,60,64,70,73,78]} sparkColor="var(--accent-2)" />
            <StatCard icon="pulse" label="Net retention" value="118%" delta="2.0%" deltaDir="up" spark={[100,104,108,110,112,115,117,118]} sparkColor="#34d399" />
            <StatCard icon="cart" label="Churn" value="1.8%" delta="0.4%" deltaDir="down" spark={[3,2.8,2.6,2.4,2.2,2,1.9,1.8]} sparkColor="#fb7185" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18 }}>
            <div className="card"><CardHead title="Revenue" desc="Gross MRR · 30 days" /><div className="card-pad"><AreaChart series={[window.revenue30, window.revenuePrev]} labels={window.dayLabels} dual color2="var(--text-faint)" height={230} /></div></div>
            <div className="card"><CardHead title="Acquisition" /><div className="card-pad"><Donut data={window.channelDonut} size={150} /></div></div>
          </div>
        </div>
      </Block>
      <Block title="Monthly sessions" desc="A bar chart block with header actions.">
        <div className="dx-block-bar"><b style={{ fontSize: 13.5 }}>Sessions by month</b><div style={{ flex: 1 }} /><Segmented options={['Bar', 'Line']} value="Bar" onChange={() => {}} /></div>
        <div className="dx-block-body"><BarChart data={window.trafficBars} labels={window.monthLabels} height={240} /></div>
      </Block>
    </>
  );
}
function OpsBlockPage() {
  return (
    <>
      <ProHeader title="Tables & Operations" lede="The operational core: orders, team & roles, system health, API keys, audit logs and a triage board." />
      <OrdersBlock /><TeamRolesBlock /><SystemStatusBlock /><ApiKeysBlock /><AuditLogBlock /><KanbanBlock />
    </>
  );
}
function FormsBlockPage() {
  return (
    <>
      <ProHeader title="Forms & Wizards" lede="From a multi-step onboarding wizard to sectioned record forms, billing capture and advanced filters." />
      <OnboardingWizard /><AccountForm /><BillingForm /><FilterPanelBlock />
    </>
  );
}
function AuthBlockPage() {
  return (
    <>
      <ProHeader title="Auth" lede="Self-contained sign-in surfaces that drop onto any blank page." />
      <AuthCardBlock />
    </>
  );
}

/* ---------- Templates ---------- */
function TemplatesPage() {
  return (
    <>
      <h1 className="dx-h1">Templates</h1>
      <p className="dx-lede">Full applications assembled from Vespera. Open them, then lift any screen straight into your product.</p>
      <h2 className="dx-h2">Available now</h2>
      <a href="admin.html" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card" style={{ overflow: 'hidden', cursor: 'pointer' }}>
          <div style={{ height: 150, background: 'radial-gradient(500px 240px at 75% 0%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 65%), radial-gradient(400px 300px at 10% 120%, color-mix(in oklab, var(--accent-2) 24%, transparent), transparent 60%), var(--surface-2)', borderBottom: '1px solid var(--border)', position: 'relative', display: 'grid', placeItems: 'center' }}>
            <span className="ag-brand-mark" style={{ width: 46, height: 46 }}><Icon.grid style={{ width: 22, height: 22, color: '#fff', position: 'relative', zIndex: 1 }} /></span>
          </div>
          <div className="card-pad" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}><div className="dx-h3">Vespera Admin</div><p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-dim)' }}>Analytics console — dashboard, accounts table, detail, settings, auth, and command palette.</p></div>
            <Button variant="primary" trailingIcon="arrowRight">Open</Button>
          </div>
        </div>
      </a>
    </>
  );
}

/* ---------- Tweaks ---------- */
function SCTweaks({ t, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakToggle label="Dark mode" value={t.dark} onChange={v => setTweak('dark', v)} />
      <TweakColor label="Accent" value={t.accent} options={SC_ACCENTS} onChange={v => setTweak('accent', v)} />
      <TweakSection label="Background" />
      <TweakToggle label="Animated glow" value={t.bgAnim} onChange={v => setTweak('bgAnim', v)} />
      <TweakColor label="Glow color" value={t.bgGlow} options={SC_ACCENTS} onChange={v => setTweak('bgGlow', v)} />
      <TweakSection label="Typography" />
      <TweakRadio label="Typeface" value={t.font} options={[{ value: 'jakarta', label: 'Jakarta' }, { value: 'grotesk', label: 'Grotesk' }, { value: 'sora', label: 'Sora' }, { value: 'geist', label: 'Geist' }, { value: 'manrope', label: 'Manrope' }, { value: 'outfit', label: 'Outfit' }]} onChange={v => setTweak('font', v)} />
      <TweakSection label="Layout" />
      <TweakRadio label="Sidebar" value={t.sidebar} options={[{ value: 'full', label: 'Full' }, { value: 'compact', label: 'Rail' }, { value: 'float', label: 'Float' }, { value: 'hidden', label: 'Hidden' }]} onChange={v => setTweak('sidebar', v)} />
      <TweakSection label="Shape & density" />
      <TweakRadio label="Corners" value={t.corners} options={[{ value: 'round', label: 'Round' }, { value: 'soft', label: 'Soft' }, { value: 'sharp', label: 'Sharp' }]} onChange={v => setTweak('corners', v)} />
      <TweakRadio label="Density" value={t.density} options={[{ value: 'compact', label: 'Compact' }, { value: 'comfortable', label: 'Comfort' }, { value: 'spacious', label: 'Spacious' }]} onChange={v => setTweak('density', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Showcase />);
