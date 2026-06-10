// screens-misc.jsx — Settings, Login, States (empty/loading). Depends on components.
const { useState: useStateX } = React;

/* ============================= SETTINGS ============================= */
function SettingsScreen() {
  const [tab, setTab] = useStateX('Profile');
  const tabs = ['Profile', 'Workspace', 'Billing', 'Notifications', 'Security'];
  return (
    <div className="ag-content-inner" style={{ maxWidth: 1080 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 'var(--gap)', alignItems: 'start' }}>
        <div className="card" style={{ padding: 8, position: 'sticky', top: 0 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`ag-nav-item ${tab === t ? 'active' : ''}`}
              style={{ width: '100%', marginBottom: 2, border: 'none', background: tab === t ? 'color-mix(in oklab, var(--accent) 13%, transparent)' : 'transparent', font: 'inherit' }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
          {tab === 'Profile' && <ProfileSettings />}
          {tab === 'Workspace' && <CardForm title="Workspace" desc="Organization-wide defaults." fields={[['Workspace name', 'Aether Labs Inc.'], ['Workspace URL', 'aether.dev/acme'], ['Default timezone', 'UTC−05:00 · Eastern']]} />}
          {tab === 'Billing' && <BillingSettings />}
          {tab === 'Notifications' && <NotificationSettings />}
          {tab === 'Security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function SettingCard({ title, desc, children, foot }) {
  return (
    <div className="card ag-rise">
      <div className="card-pad" style={{ borderBottom: foot ? 'none' : undefined }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{title}</h3>
        {desc && <p style={{ margin: '4px 0 0', color: 'var(--text-dim)', fontSize: 13 }}>{desc}</p>}
        <div style={{ marginTop: 18 }}>{children}</div>
      </div>
      {foot && <div style={{ padding: '14px var(--pad)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8, background: 'var(--surface-3)' }}>{foot}</div>}
    </div>
  );
}

function Field({ label, value, type = 'text', full }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: full ? '1 / -1' : undefined }}>
      <span className="eyebrow">{label}</span>
      <input defaultValue={value} type={type} style={{ height: 40, padding: '0 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', font: 'inherit', fontSize: 13.5, outline: 'none' }}
        onFocus={e => { e.target.style.borderColor = 'color-mix(in oklab, var(--accent) 50%, var(--border))'; e.target.style.boxShadow = '0 0 0 3px color-mix(in oklab, var(--accent) 14%, transparent)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
    </label>
  );
}

function ProfileSettings() {
  return (
    <SettingCard title="Profile" desc="This information is visible to your team." foot={<><button className="btn btn-ghost btn-sm">Cancel</button><button className="btn btn-primary btn-sm">Save changes</button></>}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, paddingBottom: 22, borderBottom: '1px solid var(--border)' }}>
        <Av name="Avery Quinn" hue={250} size={64} />
        <div>
          <button className="btn btn-ghost btn-sm">Upload photo</button>
          <p style={{ margin: '8px 0 0', fontSize: 11.5, color: 'var(--text-faint)' }}>JPG or PNG. 2MB max.</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="First name" value="Avery" />
        <Field label="Last name" value="Quinn" />
        <Field label="Email" value="avery@aether.dev" type="email" full />
        <Field label="Role" value="Administrator" />
        <Field label="Phone" value="+1 (415) 555-0148" />
      </div>
    </SettingCard>
  );
}

function CardForm({ title, desc, fields }) {
  return (
    <SettingCard title={title} desc={desc} foot={<><button className="btn btn-ghost btn-sm">Cancel</button><button className="btn btn-primary btn-sm">Save</button></>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {fields.map(([l, v], i) => <Field key={i} label={l} value={v} full={i === fields.length - 1 && fields.length % 2 === 1} />)}
      </div>
    </SettingCard>
  );
}

function BillingSettings() {
  return (
    <>
      <SettingCard title="Plan" desc="You're currently on the Enterprise plan.">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 'var(--r-sm)', background: 'color-mix(in oklab, var(--accent) 9%, transparent)', border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><b style={{ fontSize: 16, fontWeight: 700 }}>Enterprise</b><span className="badge badge-info">Current</span></div>
            <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4 }}>Unlimited seats · priority support · SSO</div>
          </div>
          <div style={{ textAlign: 'right' }}><div className="tnum" style={{ fontSize: 26, fontWeight: 800 }}>$2,400<span style={{ fontSize: 13, color: 'var(--text-faint)', fontWeight: 500 }}>/mo</span></div></div>
        </div>
      </SettingCard>
      <SettingCard title="Payment method" foot={<button className="btn btn-ghost btn-sm"><Icon.plus />Add method</button>}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
          <Icon.card style={{ width: 28, height: 28, color: 'var(--accent)' }} />
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>Visa ending 4242</div><div className="mono" style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>Expires 08 / 27</div></div>
          <span className="badge badge-pos"><i />Default</span>
        </div>
      </SettingCard>
    </>
  );
}

function NotificationSettings() {
  const items = [['Product updates', 'News about features and releases', true], ['Weekly digest', 'A summary of your account every Monday', true], ['Billing alerts', 'Payment failures and invoices', true], ['Usage warnings', 'When an account nears its quota', false], ['Security', 'Sign-ins from new devices', true]];
  return (
    <SettingCard title="Notifications" desc="Choose what lands in your inbox.">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map(([t, d, on], i) => <ToggleRow key={i} title={t} desc={d} on={on} last={i === items.length - 1} />)}
      </div>
    </SettingCard>
  );
}

function ToggleRow({ title, desc, on, last }) {
  const [v, setV] = useStateX(on);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: last ? 0 : '1px solid var(--border)' }}>
      <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{title}</div><div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>{desc}</div></div>
      <button onClick={() => setV(!v)} style={{ width: 42, height: 24, borderRadius: 99, border: 0, cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background .2s',
        background: v ? 'var(--accent)' : 'var(--surface-3)', boxShadow: v ? '0 0 12px color-mix(in oklab, var(--accent) 50%, transparent)' : 'none' }}>
        <span style={{ position: 'absolute', top: 3, left: 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'transform .2s', transform: v ? 'translateX(18px)' : 'none', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
      </button>
    </div>
  );
}

function SecuritySettings() {
  return (
    <>
      <CardForm title="Password" desc="Update your password regularly." fields={[['Current password', '••••••••••'], ['New password', '']]} />
      <SettingCard title="Two-factor authentication" desc="Add an extra layer of security.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon.shield style={{ width: 24, height: 24, color: 'var(--success)' }} />
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>Authenticator app</div><div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Enabled · configured Jan 2026</div></div>
          <button className="btn btn-ghost btn-sm">Reconfigure</button>
        </div>
      </SettingCard>
    </>
  );
}

/* ============================= LOGIN ============================= */
function LoginScreen({ onSignIn }) {
  const [email, setEmail] = useStateX('');
  const [pw, setPw] = useStateX('');
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.05fr .95fr' }} className="ag-login">
      {/* brand panel */}
      <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 48,
        background: 'radial-gradient(800px 500px at 70% 10%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 60%), radial-gradient(600px 600px at 10% 100%, color-mix(in oklab, var(--accent-2) 26%, transparent), transparent 55%), var(--bg)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)', backgroundSize: '44px 44px', maskImage: 'radial-gradient(circle at 50% 40%, #000, transparent 75%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, position: 'relative' }}>
          <span className="ag-brand-mark" style={{ width: 34, height: 34 }}><Icon.bolt style={{ width: 18, height: 18, color: '#fff', position: 'relative', zIndex: 1 }} /></span>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Aether</span>
        </div>
        <div style={{ position: 'relative', maxWidth: 420 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Admin Console · v1.0</div>
          <h1 style={{ margin: 0, fontSize: 40, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-.03em' }}>Run your business at&nbsp;escape velocity.</h1>
          <p style={{ margin: '18px 0 0', fontSize: 15, color: 'var(--text-dim)', lineHeight: 1.6 }}>One console for revenue, accounts, and analytics — built to feel weightless.</p>
        </div>
        <div style={{ position: 'relative', display: 'flex', gap: 28 }}>
          {[['3,914', 'Accounts'], ['$248k', 'MRR'], ['118%', 'Retention']].map(([v, l]) => (
            <div key={l}><div className="tnum" style={{ fontSize: 22, fontWeight: 800 }}>{v}</div><div className="eyebrow" style={{ marginTop: 2 }}>{l}</div></div>
          ))}
        </div>
      </div>
      {/* form panel */}
      <div style={{ display: 'grid', placeItems: 'center', padding: 32, background: 'var(--surface-1)' }}>
        <div style={{ width: '100%', maxWidth: 360 }} className="ag-rise">
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>Welcome back</h2>
          <p style={{ margin: '6px 0 28px', color: 'var(--text-dim)', fontSize: 13.5 }}>Sign in to your admin console.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="eyebrow">Email</span>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" style={inputStyleLogin} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="eyebrow" style={{ display: 'flex', justifyContent: 'space-between' }}>Password <a style={{ color: 'var(--accent)', textDecoration: 'none', textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--font-sans)' }}>Forgot?</a></span>
              <input value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder="••••••••" style={inputStyleLogin} />
            </label>
            <button className="btn btn-primary" style={{ height: 44, marginTop: 6 }} onClick={onSignIn}>Sign in<Icon.arrowRight /></button>
            <button className="btn btn-ghost" style={{ height: 44 }}><Icon.globe />Continue with SSO</button>
          </div>
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12.5, color: 'var(--text-faint)' }}>New here? <a style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Request access</a></p>
        </div>
      </div>
    </div>
  );
}
const inputStyleLogin = { height: 44, padding: '0 14px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', font: 'inherit', fontSize: 14, outline: 'none' };

/* ============================= STATES (empty / loading) ============================= */
function StatesScreen() {
  const [mode, setMode] = useStateX('Loading');
  return (
    <div className="ag-content-inner">
      <PageToolbar><Segmented options={['Loading', 'Empty', 'Error']} value={mode} onChange={setMode} /></PageToolbar>
      {mode === 'Loading' && <LoadingState />}
      {mode === 'Empty' && <EmptyState />}
      {mode === 'Error' && <ErrorState />}
    </div>
  );
}

function LoadingState() {
  return (
    <>
      <div className="grid stat-grid" style={{ marginBottom: 'var(--gap)' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><div className="skel" style={{ width: 34, height: 34, borderRadius: 8 }} /><div className="skel" style={{ width: 70, height: 10 }} /></div>
            <div className="skel" style={{ width: '60%', height: 26 }} />
          </div>
        ))}
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        <div className="card card-pad"><div className="skel" style={{ width: 120, height: 14, marginBottom: 20 }} /><div className="skel" style={{ width: '100%', height: 220, borderRadius: 12 }} /></div>
        <div className="card card-pad"><div className="skel" style={{ width: 100, height: 14, marginBottom: 20 }} />{Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}><div className="skel" style={{ width: 32, height: 32, borderRadius: '50%' }} /><div style={{ flex: 1 }}><div className="skel" style={{ width: '70%', height: 11, marginBottom: 7 }} /><div className="skel" style={{ width: '40%', height: 9 }} /></div></div>)}</div>
      </div>
    </>
  );
}

function CenterState({ icon, title, desc, children }) {
  const I = Icon[icon];
  return (
    <div className="card ag-rise" style={{ display: 'grid', placeItems: 'center', textAlign: 'center', padding: '72px 24px', minHeight: 420 }}>
      <div style={{ maxWidth: 360 }}>
        <span style={{ width: 64, height: 64, borderRadius: 18, display: 'grid', placeItems: 'center', margin: '0 auto 22px', background: 'color-mix(in oklab, var(--accent) 12%, transparent)', color: 'var(--accent)', border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)' }}>
          <I style={{ width: 28, height: 28 }} />
        </span>
        <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700 }}>{title}</h2>
        <p style={{ margin: '8px 0 24px', color: 'var(--text-dim)', fontSize: 13.5, lineHeight: 1.6 }}>{desc}</p>
        {children}
      </div>
    </div>
  );
}
function EmptyState() {
  return <CenterState icon="inbox" title="No accounts yet" desc="When you add your first account it'll show up here with live revenue and usage. Import a CSV or create one to get started.">
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}><button className="btn btn-ghost btn-sm"><Icon.download />Import CSV</button><button className="btn btn-primary btn-sm"><Icon.plus />Add account</button></div>
  </CenterState>;
}
function ErrorState() {
  return <CenterState icon="bolt" title="Something went sideways" desc="We couldn't reach the analytics service. This is usually temporary — give it a moment and try again.">
    <button className="btn btn-primary btn-sm" style={{ margin: '0 auto' }}><Icon.refresh />Retry</button>
  </CenterState>;
}

Object.assign(window, { SettingsScreen, LoginScreen, StatesScreen });
