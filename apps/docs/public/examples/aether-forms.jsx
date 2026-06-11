// aether-forms.jsx — Pro form blocks (wizards, create/edit forms, filters, auth).
const { useState: useFm } = React;

/* ===================== ONBOARDING WIZARD ===================== */
function OnboardingWizard() {
  const [step, setStep] = useFm(1);
  const steps = ['Workspace', 'Plan', 'Invite', 'Done'];
  const [plan, setPlan] = useFm('growth');
  return (
    <Block title="Onboarding wizard" desc="A multi-step flow using the Stepper, with validation-ready sections.">
      <div className="dx-block-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Stepper steps={steps} current={step} />
        <div style={{ minHeight: 196 }}>
          {step === 0 && <div style={{ display: 'grid', gap: 16, maxWidth: 460 }}>
            <Field label="Workspace name" required hint="You can change this later."><Input defaultValue="Vespera Labs" /></Field>
            <Field label="Workspace URL"><InputAffix prefix="aether.dev/" defaultValue="acme" /></Field>
            <Field label="Team size"><Select options={['1–10', '11–50', '51–200', '200+']} /></Field>
          </div>}
          {step === 1 && <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
            {[['starter', 'Starter', '$0', 'For trying things out'], ['growth', 'Growth', '$240', 'Usage-based, scales'], ['enterprise', 'Enterprise', 'Custom', 'SSO, SLA, support']].map(([v, n, p, d]) => (
              <button key={v} onClick={() => setPlan(v)} className="card card-pad" style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'var(--text)', border: plan === v ? '1px solid var(--accent)' : '1px solid var(--border)', background: plan === v ? 'color-mix(in oklab, var(--accent) 8%, var(--surface-1))' : 'var(--surface-1)', boxShadow: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><b style={{ fontSize: 14 }}>{n}</b><span className={cx('ui-radio-dot', plan === v && 'on')} /></div>
                <div className="tnum" style={{ fontSize: 22, fontWeight: 800, margin: '10px 0 2px' }}>{p}<span style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 500 }}>{p !== 'Custom' ? '/mo' : ''}</span></div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{d}</div>
              </button>
            ))}
          </div>}
          {step === 2 && <div style={{ display: 'grid', gap: 16, maxWidth: 460 }}>
            <Field label="Invite teammates" hint="Comma-separated emails."><Textarea placeholder="maya@acme.com, leo@acme.com" /></Field>
            <Field label="Default role"><Select options={['Viewer', 'Editor', 'Admin']} /></Field>
            <Checkbox checked onChange={() => {}} label="Send a welcome email" />
          </div>}
          {step === 3 && <div style={{ display: 'grid', placeItems: 'center', textAlign: 'center', padding: '24px 0' }}>
            <span style={{ width: 56, height: 56, borderRadius: 16, display: 'grid', placeItems: 'center', background: 'color-mix(in oklab, var(--success) 14%, transparent)', color: 'var(--success)', marginBottom: 16 }}><Icon.checkCircle style={{ width: 28, height: 28 }} /></span>
            <div className="dx-h3">You're all set</div>
            <p style={{ color: 'var(--text-dim)', fontSize: 13.5, margin: '6px 0 0', maxWidth: 360 }}>Your workspace is ready. Jump into the console to start adding accounts.</p>
          </div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <Button variant="subtle" size="sm" disabled={step === 0} style={{ opacity: step === 0 ? .4 : 1 }} onClick={() => setStep(s => Math.max(0, s - 1))} leadingIcon="chevLeft">Back</Button>
          {step < 3
            ? <Button variant="primary" size="sm" trailingIcon="arrowRight" onClick={() => setStep(s => s + 1)}>Continue</Button>
            : <Button variant="primary" size="sm" leadingIcon="bolt" onClick={() => { setStep(0); window.toast?.({ tone: 'pos', title: 'Workspace created' }); }}>Go to console</Button>}
        </div>
      </div>
    </Block>
  );
}

/* ===================== ACCOUNT / RECORD FORM ===================== */
function AccountForm() {
  return (
    <Block title="Create account" desc="A sectioned create/edit form — the workhorse of any admin.">
      <div className="dx-block-body" style={{ display: 'grid', gap: 0 }}>
        <FormSection title="Profile" desc="Basic information about the account.">
          <div className="dx-grid two" style={{ width: '100%' }}>
            <Field label="Company name" required><Input defaultValue="Northwind" /></Field>
            <Field label="Account ID" hint="Auto-generated"><Input disabled defaultValue="ATG-4810" /></Field>
            <Field label="Primary contact" required><Input defaultValue="Maya Okafor" /></Field>
            <Field label="Email" required><Input type="email" defaultValue="maya@northwind.com" /></Field>
          </div>
        </FormSection>
        <FormSection title="Subscription" desc="Plan, billing and seat allocation.">
          <div className="dx-grid two" style={{ width: '100%' }}>
            <Field label="Plan"><Select options={window.PLANS} /></Field>
            <Field label="Billing cycle"><Select options={['Monthly', 'Annual']} /></Field>
            <Field label="Seats"><InputAffix type="number" defaultValue={48} leadingIcon="users" /></Field>
            <Field label="Monthly value"><InputAffix type="number" prefix="$" unit="USD" defaultValue={1840} /></Field>
          </div>
        </FormSection>
        <FormSection title="Status" desc="Lifecycle and flags." last>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Switch checked onChange={() => {}} /><div><div style={{ fontSize: 13.5, fontWeight: 600 }}>Account active</div><div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Inactive accounts lose API access.</div></div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Switch onChange={() => {}} /><div><div style={{ fontSize: 13.5, fontWeight: 600 }}>Priority support</div><div style={{ fontSize: 12, color: 'var(--text-dim)' }}>24/7 response SLA.</div></div></div>
          </div>
        </FormSection>
      </div>
      <div className="dx-block-bar" style={{ borderTop: '1px solid var(--border)', borderBottom: 0, justifyContent: 'flex-end' }}>
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button variant="primary" size="sm" leadingIcon="check" onClick={() => window.toast?.({ tone: 'pos', title: 'Account saved' })}>Save account</Button>
      </div>
    </Block>
  );
}
function FormSection({ title, desc, children, last }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 28, padding: '22px 0', borderBottom: last ? 0 : '1px solid var(--border)' }}>
      <div><div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>{desc && <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.5 }}>{desc}</div>}</div>
      <div style={{ display: 'flex' }}>{children}</div>
    </div>
  );
}

/* ===================== BILLING / PAYMENT FORM ===================== */
function BillingForm() {
  return (
    <Block title="Payment method" desc="Card capture with summary — a common billing surface.">
      <div className="dx-block-body" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 28 }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <Field label="Cardholder name" required><Input defaultValue="Avery Quinn" /></Field>
          <Field label="Card number" required><InputAffix leadingIcon="card" defaultValue="4242 4242 4242 4242" /></Field>
          <div className="dx-grid two">
            <Field label="Expiry"><Input defaultValue="08 / 27" /></Field>
            <Field label="CVC"><Input defaultValue="•••" /></Field>
          </div>
          <Field label="Billing country"><Select options={['United States', 'United Kingdom', 'Germany', 'Singapore']} /></Field>
        </div>
        <div className="card card-pad" style={{ alignSelf: 'start', display: 'grid', gap: 12, boxShadow: 'none' }}>
          <div className="eyebrow">Order summary</div>
          {[['Enterprise plan', '$2,400'], ['Additional seats (8)', '$320'], ['Tax', '$218']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'var(--text-dim)' }}>{k}</span><span className="tnum" style={{ fontWeight: 600 }}>{v}</span></div>
          ))}
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><b>Total due</b><span className="tnum" style={{ fontSize: 22, fontWeight: 800 }}>$2,938</span></div>
          <Button variant="primary" leadingIcon="shield" onClick={() => window.toast?.({ tone: 'pos', title: 'Payment confirmed' })}>Pay securely</Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-faint)', justifyContent: 'center' }}><Icon.shield style={{ width: 13, height: 13 }} />Encrypted &amp; PCI compliant</div>
        </div>
      </div>
    </Block>
  );
}

/* ===================== FILTER PANEL ===================== */
function FilterPanelBlock() {
  const [tags, setTags] = useFm(['Active', 'Enterprise']);
  const [mrr, setMrr] = useFm(500);
  return (
    <Block title="Advanced filters" desc="A composable filter surface for any data view.">
      <div className="dx-block-body" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 0 }}>
        <div style={{ borderRight: '1px solid var(--border)', paddingRight: 24, display: 'grid', gap: 18, alignContent: 'start' }}>
          <Field label="Search"><InputAffix leadingIcon="search" placeholder="Account or email…" /></Field>
          <Field label="Status"><Select options={['Any status', 'Active', 'Trial', 'Pending', 'Churned']} /></Field>
          <Field label="Plan"><Select options={['Any plan', ...window.PLANS]} /></Field>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><span className="ui-label">Min MRR</span><span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>${mrr}</span></div>
            <Slider value={mrr} onChange={setMrr} min={0} max={2000} step={50} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Checkbox checked onChange={() => {}} label="Has open tickets" />
            <Checkbox checked={false} onChange={() => {}} label="At risk of churn" />
          </div>
          <Button variant="primary" size="sm" leadingIcon="filter">Apply</Button>
        </div>
        <div style={{ paddingLeft: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <span className="eyebrow">Active:</span>
            {tags.map(t => <Tag key={t} onRemove={() => setTags(x => x.filter(y => y !== t))}>{t}</Tag>)}
            <button className="btn btn-subtle btn-sm" onClick={() => setTags([])}>Clear all</button>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {window.CUSTOMERS.slice(0, 4).map(c => { const st = window.STATUSES[c.status]; return (
              <div key={c.id} className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 13, boxShadow: 'none' }}>
                <Av name={c.name} hue={c.hue} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.company}</div><div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{c.plan}</div></div>
                <Badge tone={st.cls.replace('badge-', '')} dot>{st.label}</Badge>
                <span className="tnum" style={{ fontWeight: 700, fontSize: 13.5 }}>${c.mrr.toLocaleString()}</span>
              </div>
            ); })}
          </div>
        </div>
      </div>
    </Block>
  );
}

/* ===================== AUTH CARD ===================== */
function AuthCardBlock() {
  return (
    <Block title="Sign-in card" desc="A self-contained auth surface — drops into any blank page.">
      <div className="dx-block-body" style={{ display: 'grid', placeItems: 'center', padding: 40, background: 'radial-gradient(600px 300px at 50% 0%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 70%)' }}>
        <div className="card" style={{ width: '100%', maxWidth: 380, padding: 28 }}>
          <span className="ag-brand-mark" style={{ width: 38, height: 38, marginBottom: 18 }}><Icon.bolt style={{ width: 19, height: 19, color: '#fff', position: 'relative', zIndex: 1 }} /></span>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em' }}>Sign in to Vespera</div>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', margin: '6px 0 22px' }}>Welcome back. Enter your details to continue.</p>
          <div style={{ display: 'grid', gap: 14 }}>
            <Field label="Email"><Input type="email" placeholder="you@company.com" /></Field>
            <Field label="Password" action={<a style={{ color: 'var(--accent)', fontSize: 11, textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--font-sans)', textDecoration: 'none' }}>Forgot?</a>}><Input type="password" placeholder="••••••••" /></Field>
            <Button variant="primary" trailingIcon="arrowRight">Sign in</Button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-faint)', fontSize: 11 }}><Divider style={{ flex: 1 }} />OR<Divider style={{ flex: 1 }} /></div>
            <Button variant="ghost" leadingIcon="globe">Continue with SSO</Button>
          </div>
        </div>
      </div>
    </Block>
  );
}

Object.assign(window, { OnboardingWizard, AccountForm, FormSection, BillingForm, FilterPanelBlock, AuthCardBlock });
