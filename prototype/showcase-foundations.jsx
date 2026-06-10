// showcase-foundations.jsx — Demo helper + Foundations, Buttons, Forms sections.
const { useState: useF } = React;

function Demo({ title, desc, col, center, children, style }) {
  return (
    <div className="dx-demo">
      {(title || desc) && <div className="dx-demo-head">{title && <span className="dx-demo-title">{title}</span>}{desc && <span className="dx-demo-desc">{desc}</span>}</div>}
      <div className={cx('dx-demo-stage', col && 'col', center && 'center')} style={style}>{children}</div>
    </div>
  );
}
function Section({ children }) { return <div style={{ marginBottom: 8 }}>{children}</div>; }
function LoadingBtnDemo() {
  const [l, setL] = useF(false);
  return <Button variant="primary" loading={l} leadingIcon="download" onClick={() => { setL(true); setTimeout(() => setL(false), 1600); }}>{l ? 'Exporting…' : 'Export'}</Button>;
}

/* ===================== FOUNDATIONS ===================== */
const FND_PALETTE = [
  { name: 'Blue', v: 'var(--c-blue)' },
  { name: 'Cyan', v: 'var(--c-cyan)' },
  { name: 'Indigo', v: 'var(--c-indigo)' },
  { name: 'Violet', v: 'var(--c-violet)' },
  { name: 'Emerald', v: 'var(--c-emerald)' },
  { name: 'Coral', v: 'var(--c-coral)' },
  { name: 'Amber', v: 'var(--c-amber)' },
  { name: 'Magenta', v: 'var(--c-magenta)' },
];
function FndSwatches({ value, onChange }) {
  const sel = FND_PALETTE.find(p => p.v === value);
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      {FND_PALETTE.map(p => (
        <button key={p.name} title={p.name} onClick={() => onChange(p.v)} style={{ width: 28, height: 28, borderRadius: 7, background: p.v, cursor: 'pointer', display: 'grid', placeItems: 'center', border: value === p.v ? '2px solid var(--text)' : '2px solid transparent', boxShadow: value === p.v ? '0 0 0 1px var(--surface-1)' : '0 0 0 1px var(--border)' }}>
          {value === p.v && <Icon.check style={{ width: 13, height: 13, color: '#fff' }} />}
        </button>
      ))}
      {sel && <span className="mono" style={{ fontSize: 11.5, color: 'var(--text-dim)', marginLeft: 2 }}>{sel.name}</span>}
    </div>
  );
}
function FndSeg({ value, options, onChange }) {
  return (
    <div className="ui-seg">
      {options.map(o => <button key={String(o.v)} className={value === o.v ? 'on' : ''} onClick={() => onChange(o.v)}>{o.label}</button>)}
    </div>
  );
}
function CustomizePanel({ t, setTweak }) {
  const Row = ({ label, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', minHeight: 34 }}>
      <span className="eyebrow" style={{ width: 96, flexShrink: 0 }}>{label}</span>{children}
    </div>
  );
  return (
    <div className="card card-pad" style={{ display: 'grid', gap: 15, marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center', background: 'linear-gradient(140deg, var(--accent), var(--accent-2))', color: '#fff' }}><Icon.sparkle style={{ width: 16, height: 16 }} /></span>
        <b style={{ fontSize: 15 }}>Customize</b><Badge tone="info">live — changes the whole system</Badge>
      </div>
      <Row label="Theme"><FndSeg value={t.dark} options={[{ v: true, label: 'Dark' }, { v: false, label: 'Light' }]} onChange={v => setTweak('dark', v)} /></Row>
      <Row label="Accent"><FndSwatches value={t.accent} onChange={v => setTweak('accent', v)} /></Row>
      <Row label="Accent 2"><FndSwatches value={t.accent2} onChange={v => setTweak('accent2', v)} /></Row>
      <Row label="Typeface"><FndSeg value={t.font} options={[{ v: 'jakarta', label: 'Jakarta' }, { v: 'grotesk', label: 'Grotesk' }, { v: 'sora', label: 'Sora' }, { v: 'geist', label: 'Geist' }, { v: 'manrope', label: 'Manrope' }, { v: 'outfit', label: 'Outfit' }]} onChange={v => setTweak('font', v)} /></Row>
      <Row label="Density"><FndSeg value={t.density} options={[{ v: 'compact', label: 'Compact' }, { v: 'comfortable', label: 'Comfort' }, { v: 'spacious', label: 'Spacious' }]} onChange={v => setTweak('density', v)} /></Row>
      <Row label="Corners"><FndSeg value={t.corners} options={[{ v: 'round', label: 'Round' }, { v: 'soft', label: 'Soft' }, { v: 'sharp', label: 'Sharp' }]} onChange={v => setTweak('corners', v)} /></Row>
      <Row label="Sidebar"><FndSeg value={t.sidebar} options={[{ v: 'full', label: 'Full' }, { v: 'compact', label: 'Rail' }, { v: 'float', label: 'Float' }, { v: 'hidden', label: 'Hidden' }]} onChange={v => setTweak('sidebar', v)} /></Row>
      <Row label="Glow"><div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}><Switch checked={t.bgAnim} onChange={v => setTweak('bgAnim', v)} /><FndSwatches value={t.bgGlow} onChange={v => setTweak('bgGlow', v)} /></div></Row>
    </div>
  );
}
function FoundationsSection({ t, setTweak }) {
  const accents = [['Accent', 'var(--accent)'], ['Accent 2', 'var(--accent-2)'], ['Success', 'var(--success)'], ['Warning', 'var(--warning)'], ['Danger', 'var(--danger)']];
  const neutrals = [['Background', 'var(--bg)'], ['Surface 1', 'var(--surface-1)'], ['Surface 2', 'var(--surface-2)'], ['Surface 3', 'var(--surface-3)'], ['Border', 'var(--border-strong)'], ['Text dim', 'var(--text-dim)'], ['Text', 'var(--text)']];
  const type = [['Display', 36, 800, '-.03em'], ['Title', 24, 800, '-.02em'], ['Heading', 18, 700, '-.01em'], ['Body large', 15, 500, '0'], ['Body', 13.5, 500, '0'], ['Mono label', 11, 600, '.12em', true]];
  const radii = [['sm', 'var(--r-sm)'], ['md', 'var(--r-md)'], ['lg', 'var(--r-lg)'], ['pill', '999px']];
  return (
    <>
      <h1 className="dx-h1">Foundations</h1>
      <p className="dx-lede">The Aether design language: a deep-space palette with an electric accent, geometric sans paired with a technical mono, and tokens that flex across light, dark, and three densities — all driven by CSS variables you can re-theme in one place.</p>

      <h2 className="dx-h2">Customize the system</h2>
      {t && <CustomizePanel t={t} setTweak={setTweak} />}
      <h2 className="dx-h2">Color · Accent &amp; semantic</h2>
      <div className="dx-grid three">
        {accents.map(([n, v]) => (
          <div key={n} className="dx-swatch"><div className="chip-color" style={{ background: v }} /><div className="chip-meta"><div className="chip-name">{n}</div><div className="chip-val">{v}</div></div></div>
        ))}
      </div>

      <h2 className="dx-h2">Color · Neutrals</h2>
      <div className="dx-grid" style={{ gridTemplateColumns: 'repeat(7,1fr)' }}>
        {neutrals.map(([n, v]) => (
          <div key={n} className="dx-swatch"><div className="chip-color" style={{ background: v, height: 56 }} /><div className="chip-meta"><div className="chip-name" style={{ fontSize: 11 }}>{n}</div></div></div>
        ))}
      </div>

      <h2 className="dx-h2">Typography</h2>
      <div className="dx-demo"><div className="dx-demo-stage col" style={{ gap: 18, background: 'var(--surface-1)' }}>
        {type.map(([n, sz, w, ls, mono]) => (
          <div key={n} style={{ display: 'flex', alignItems: 'baseline', gap: 20, borderBottom: '1px solid var(--border)', paddingBottom: 14, width: '100%' }}>
            <span className="eyebrow" style={{ width: 110, flexShrink: 0 }}>{n}</span>
            <span style={{ fontSize: sz, fontWeight: w, letterSpacing: ls, fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', textTransform: mono ? 'uppercase' : 'none', flex: 1 }}>
              {mono ? 'ESCAPE VELOCITY' : 'Run your business at escape velocity'}
            </span>
            <span className="mono" style={{ color: 'var(--text-faint)', fontSize: 11 }}>{sz}px</span>
          </div>
        ))}
      </div></div>

      <h2 className="dx-h2">Radius &amp; elevation</h2>
      <div className="dx-grid two">
        <Demo title="Corner radius" desc="Reskins via the Corners tweak">
          {radii.map(([n, v]) => <div key={n} style={{ textAlign: 'center' }}><div style={{ width: 64, height: 64, borderRadius: v, background: 'color-mix(in oklab, var(--accent) 18%, var(--surface-3))', border: '1px solid color-mix(in oklab,var(--accent) 30%, transparent)' }} /><div className="mono" style={{ fontSize: 10.5, color: 'var(--text-faint)', marginTop: 8 }}>{n}</div></div>)}
        </Demo>
        <Demo title="Elevation">
          <div style={{ width: 90, height: 64, borderRadius: 'var(--r-md)', background: 'var(--surface-1)', boxShadow: 'var(--shadow)', display: 'grid', placeItems: 'center', fontSize: 11, color: 'var(--text-faint)' }} className="mono">shadow</div>
          <div style={{ width: 90, height: 64, borderRadius: 'var(--r-md)', background: 'var(--surface-1)', boxShadow: 'var(--shadow-lg)', display: 'grid', placeItems: 'center', fontSize: 11, color: 'var(--text-faint)' }} className="mono">shadow-lg</div>
        </Demo>
      </div>

      <h2 className="dx-h2">Iconography</h2>
      <Demo desc="Consistent 1.8px stroke set">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px,1fr))', gap: 14, width: '100%' }}>
          {Object.keys(window.Icon).slice(0, 36).map(k => { const I = window.Icon[k]; return (
            <div key={k} style={{ display: 'grid', placeItems: 'center', gap: 7, padding: '12px 0', borderRadius: 'var(--r-sm)', color: 'var(--text-dim)' }}>
              <I style={{ width: 20, height: 20 }} /><span className="mono" style={{ fontSize: 9, color: 'var(--text-faint)' }}>{k}</span>
            </div>
          ); })}
        </div>
      </Demo>
    </>
  );
}

/* ===================== BUTTONS & ACTIONS ===================== */
function ButtonsSection() {
  return (
    <>
      <h1 className="dx-h1">Buttons &amp; Actions</h1>
      <p className="dx-lede">Five variants, two sizes, optional leading/trailing icons. Built on a single <span className="mono">.btn</span> base so they re-theme instantly.</p>

      <h2 className="dx-h2">Variants</h2>
      <Demo>
        <Button variant="primary" leadingIcon="plus">Primary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="subtle">Subtle</Button>
        <Button variant="primary" trailingIcon="arrowRight">Continue</Button>
        <Button variant="ghost" leadingIcon="download">Export</Button>
      </Demo>

      <h2 className="dx-h2">Sizes &amp; icon buttons</h2>
      <Demo>
        <Button variant="primary">Default</Button>
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="ghost" size="sm" leadingIcon="filter">Filter</Button>
        <IconButton icon="bell" label="Notifications" dot />
        <IconButton icon="settings" label="Settings" />
        <IconButton icon="more" label="More" />
      </Demo>

      <h2 className="dx-h2">Loading &amp; utility</h2>
      <Demo>
        <LoadingBtnDemo />
        <Button variant="ghost" loading>Saving…</Button>
        <CopyButton text="aeth_live_8f2a39c4e7b1d91c" label="Copy token" />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, color: 'var(--text-dim)', fontSize: 13 }}><Spinner /> Loading</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, color: 'var(--text-dim)', fontSize: 13 }}><Spinner size="lg" /></span>
      </Demo>

      <h2 className="dx-h2">In context</h2>
      <Demo style={{ background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <Button variant="subtle" size="sm">Cancel</Button>
          <Button variant="ghost" size="sm">Save draft</Button>
          <Button variant="primary" size="sm" leadingIcon="check">Publish</Button>
        </div>
      </Demo>
    </>
  );
}

/* ===================== FORMS & INPUTS ===================== */
function FormsSection() {
  const [check, setCheck] = useF(true);
  const [radio, setRadio] = useF('growth');
  const [sw, setSw] = useF(true);
  const [slider, setSlider] = useF(40);
  const [tags, setTags] = useF(['Enterprise', 'us-east-1', 'Priority']);
  const [region, setRegion] = useF('us-east-1');
  const [members, setMembers] = useF(['maya', 'leo']);
  const [labels, setLabels] = useF(['billing', 'priority']);
  const [date, setDate] = useF(null);
  const [range, setRange] = useF({});
  const [otp, setOtp] = useF('');
  const [qty, setQty] = useF(12);
  const [inlineVal, setInlineVal] = useF('Northwind Inc.');
  const REGIONS = [{ value: 'us-east-1', label: 'US East (N. Virginia)' }, { value: 'us-west-2', label: 'US West (Oregon)' }, { value: 'eu-west-1', label: 'EU West (Ireland)' }, { value: 'eu-central-1', label: 'EU Central (Frankfurt)' }, { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' }, { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' }, { value: 'sa-east-1', label: 'South America (São Paulo)' }];
  const PEOPLE = [{ value: 'maya', label: 'Maya Okafor' }, { value: 'leo', label: 'Leo Vega' }, { value: 'aria', label: 'Aria Lindqvist' }, { value: 'kenji', label: 'Kenji Tanaka' }, { value: 'noor', label: 'Noor Haddad' }, { value: 'diego', label: 'Diego Moreau' }, { value: 'saanvi', label: 'Saanvi Iyer' }];
  return (
    <>
      <h1 className="dx-h1">Forms &amp; Inputs</h1>
      <p className="dx-lede">Every control shares one focus ring, one border token, and consistent 40px sizing — so dense operational forms stay legible and aligned.</p>

      <h2 className="dx-h2">Searchable selects</h2>
      <p className="dx-demo-desc" style={{ marginBottom: 14 }}>Fully themed comboboxes with type-ahead filtering and keyboard nav — what the native &lt;select&gt; can’t do.</p>
      <div className="dx-grid three">
        <Demo title="Single · searchable" col style={{ alignItems: 'stretch', overflow: 'visible' }}>
          <Field label="Region"><Combobox options={REGIONS} value={region} onChange={setRegion} placeholder="Choose a region" searchPlaceholder="Search regions…" clearable /></Field>
        </Demo>
        <Demo title="Multi · searchable" col style={{ alignItems: 'stretch', overflow: 'visible' }}>
          <Field label="Assignees"><MultiSelect options={PEOPLE} value={members} onChange={setMembers} placeholder="Add people…" searchPlaceholder="Search teammates…" /></Field>
        </Demo>
        <Demo title="Token · creatable" col style={{ alignItems: 'stretch', overflow: 'visible' }}>
          <Field label="Labels" hint="Press Enter to add"><TokenInput value={labels} onChange={setLabels} placeholder="Add a label…" /></Field>
        </Demo>
      </div>

      <h2 className="dx-h2">Date &amp; time</h2>
      <div className="dx-grid two">
        <Demo title="Date picker" col style={{ alignItems: 'stretch', overflow: 'visible' }}>
          <Field label="Renewal date"><DatePicker value={date} onChange={setDate} placeholder="Pick a date" /></Field>
        </Demo>
        <Demo title="Date range" col style={{ alignItems: 'stretch', overflow: 'visible' }}>
          <Field label="Reporting period"><DateRangePicker value={range} onChange={setRange} placeholder="Pick a range" /></Field>
        </Demo>
      </div>

      <h2 className="dx-h2">Upload &amp; verification</h2>
      <div className="dx-grid two">
        <Demo title="File dropzone" col style={{ alignItems: 'stretch' }}>
          <FileDropzone />
        </Demo>
        <Demo title="One-time code" col>
          <OTPInput length={6} value={otp} onChange={setOtp} />
          <span className="dx-demo-desc">Auto-advances; ⌫ steps back.</span>
        </Demo>
      </div>

      <h2 className="dx-h2">Stepper &amp; inline edit</h2>
      <div className="dx-grid two">
        <Demo title="Number stepper">
          <NumberStepper value={qty} onChange={setQty} min={0} max={99} unit="seats" />
        </Demo>
        <Demo title="Inline edit" col><span className="dx-demo-desc" style={{ marginBottom: 6 }}>Click the value to edit — Enter saves, Esc cancels.</span>
          <div style={{ fontSize: 14 }}>Company: <InlineEdit value={inlineVal} onSave={setInlineVal} /></div>
        </Demo>
      </div>

      <h2 className="dx-h2">Text fields</h2>
      <Demo col>
        <div className="dx-grid two" style={{ width: '100%' }}>
          <Field label="Workspace name" required hint="Shown to your whole team."><Input placeholder="Acme Inc." defaultValue="Aether Labs" /></Field>
          <Field label="Billing email" required><Input type="email" placeholder="billing@acme.com" /></Field>
          <Field label="Seats"><InputAffix type="number" defaultValue={24} leadingIcon="users" /></Field>
          <Field label="Monthly budget"><InputAffix type="number" prefix="$" unit="USD" defaultValue={2400} /></Field>
          <Field label="API endpoint" error="That host is unreachable."><Input className="invalid" defaultValue="https://broken.host" /></Field>
          <Field label="Disabled"><Input disabled placeholder="Read only" /></Field>
        </div>
        <Field label="Notes" hint="Markdown supported." style={{ width: '100%' }}><Textarea placeholder="Add a note for your team…" /></Field>
        <Field label="Plan" style={{ maxWidth: 280 }}><Select options={window.PLANS} /></Field>
      </Demo>

      <h2 className="dx-h2">Selection controls</h2>
      <div className="dx-grid two">
        <Demo title="Checkbox" col>
          <Checkbox checked={check} onChange={setCheck} label="Email me product updates" sub="Roughly one message per month." />
          <Checkbox checked onChange={() => {}} label="Required notices" />
          <Checkbox checked={false} onChange={() => {}} label="Disabled option" disabled />
        </Demo>
        <Demo title="Radio group" col>
          <RadioGroup value={radio} onChange={setRadio} options={[
            { value: 'starter', label: 'Starter', sub: 'For small teams getting started.' },
            { value: 'growth', label: 'Growth', sub: 'Usage-based, scales with you.' },
            { value: 'enterprise', label: 'Enterprise', sub: 'SSO, SLA, dedicated support.' },
          ]} />
        </Demo>
        <Demo title="Switch" col>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Switch checked={sw} onChange={setSw} /><span style={{ fontSize: 13.5 }}>Two-factor authentication</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Switch size="sm" checked onChange={() => {}} /><span style={{ fontSize: 13.5 }}>Compact toggle</span></div>
        </Demo>
        <Demo title="Slider">
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><span className="eyebrow">Sampling rate</span><span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{slider}%</span></div>
            <Slider value={slider} onChange={setSlider} />
          </div>
        </Demo>
      </div>

      <h2 className="dx-h2">Tags</h2>
      <Demo>
        {tags.map(t => <Tag key={t} onRemove={() => setTags(x => x.filter(y => y !== t))}>{t}</Tag>)}
        <Button variant="subtle" size="sm" leadingIcon="plus">Add tag</Button>
      </Demo>
    </>
  );
}

Object.assign(window, { Demo, Section, FoundationsSection, ButtonsSection, FormsSection });
