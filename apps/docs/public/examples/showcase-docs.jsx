// showcase-docs.jsx — developer documentation: install, modularity, component API, theming.
const { useState: useDoc } = React;

function DocCode({ code }) {
  const [done, setDone] = useDoc(false);
  const copy = () => { try { navigator.clipboard?.writeText(code); } catch (e) {} setDone(true); setTimeout(() => setDone(false), 1400); window.toast?.({ title: 'Copied to clipboard' }); };
  return (
    <div className="doc-code">
      <button className="btn btn-ghost btn-sm doc-copy" onClick={copy}>{done ? <Icon.check style={{ width: 14, height: 14, color: 'var(--success)' }} /> : <Icon.doc style={{ width: 14, height: 14 }} />}{done ? 'Copied' : 'Copy'}</button>
      <pre>{code}</pre>
    </div>
  );
}
function PropsTable({ rows }) {
  return (
    <div className="doc-table-wrap"><table className="doc-props">
      <thead><tr><th><span className="eyebrow">Prop</span></th><th><span className="eyebrow">Type</span></th><th><span className="eyebrow">Description</span></th></tr></thead>
      <tbody>{rows.map(([name, type, desc, req]) => (
        <tr key={name}><td>{name}{req && <span className="req"> *</span>}</td><td className="type">{type}</td><td style={{ color: 'var(--text-dim)' }}>{desc}</td></tr>
      ))}</tbody>
    </table></div>
  );
}

const DOC_FILES = [
  ['styles.css', 'Tokens, theming, base + app-shell styles', 'Required'],
  ['ui.css', 'Component styles', 'Required'],
  ['icons.jsx', 'Stroke icon set → window.Icon', 'Most components'],
  ['aether-ui.jsx', 'Button · Input · Field · Checkbox · Radio · Switch · Slider · Badge · Tag · Tabs · Tooltip · Alert · Progress · Skeleton · Breadcrumb · Pagination · Stepper', 'Core'],
  ['aether-overlays.jsx', 'Dialog · Sheet · Popover · DropdownMenu · Toast · CommandPalette', 'needs aether-ui'],
  ['aether-select.jsx', 'Select (themed) · Combobox · MultiSelect · TokenInput', 'needs overlays'],
  ['aether-datepicker.jsx', 'Calendar · DatePicker · DateRangePicker', 'standalone'],
  ['aether-extras.jsx', 'Spinner · CircularProgress · Accordion · FileDropzone · EmptyState · Banner · OTPInput · CopyButton · AvatarGroup · NumberStepper · Tree · Timeline · DescriptionList · InlineEdit · Stat · SettingRow · VerticalTabs · NavGroup', 'needs aether-ui'],
  ['components.jsx', 'AreaChart · BarChart · Donut · Sparkline · StatCard · Avatar', 'standalone'],
  ['aether-blocks.jsx, aether-forms.jsx', 'Pro composed blocks (tables, kanban, wizards, billing…)', 'needs all above'],
];

const DOC_API = [
  { name: 'Button', file: 'aether-ui.jsx', desc: 'Action trigger with five variants, two sizes, optional icons and a loading state.',
    props: [['variant', "'primary' | 'ghost' | 'subtle' | 'outline'", "Visual style. Default 'ghost'."], ['size', "'sm'", 'Compact size; omit for default.'], ['leadingIcon / trailingIcon', 'string', 'Icon name from window.Icon.'], ['loading', 'boolean', 'Shows a spinner and disables the button.'], ['disabled', 'boolean', 'Disable interaction.'], ['onClick', '() => void', 'Click handler.']],
    code: `<Button variant="primary" leadingIcon="plus">New account</Button>
<Button variant="ghost" loading>Saving…</Button>` },
  { name: 'Input / Field', file: 'aether-ui.jsx', desc: 'Text input, wrapped by Field for a label, hint and error message.',
    props: [['label', 'node', 'Field label.'], ['required', 'boolean', 'Adds a required marker.'], ['hint', 'node', 'Helper text below.'], ['error', 'node', 'Error message (replaces hint, red).'], ['invalid', 'boolean', 'Red border on the input.']],
    code: `<Field label="Email" required hint="We'll never share it.">
  <Input type="email" placeholder="you@company.com" />
</Field>` },
  { name: 'Select', file: 'aether-select.jsx', desc: 'Themed dropdown — a drop-in replacement for native <select>. Auto-enables search for 8+ options.',
    props: [['options', 'string[] | {value,label}[]', 'Choices.', true], ['value / defaultValue', 'any', 'Controlled or uncontrolled value.'], ['onChange', '(e) => void', 'Receives an event-like { target: { value } }.'], ['searchable', 'boolean', 'Force the search box on/off.'], ['placeholder', 'string', 'Empty-state text.']],
    code: `<Select
  options={['Starter','Growth','Enterprise']}
  value={plan}
  onChange={e => setPlan(e.target.value)}
/>` },
  { name: 'Combobox / MultiSelect', file: 'aether-select.jsx', desc: 'Searchable single / multi select with type-ahead and keyboard nav.',
    props: [['options', '{value,label}[]', 'Choices.', true], ['value', 'value | value[]', 'Selected value(s).'], ['onChange', '(value) => void', 'Called with the new value (array for MultiSelect).'], ['placeholder / searchPlaceholder', 'string', 'Trigger / search hints.']],
    code: `<MultiSelect
  options={people}
  value={assignees}
  onChange={setAssignees}
  placeholder="Add people…"
/>` },
  { name: 'DatePicker', file: 'aether-datepicker.jsx', desc: 'Calendar popover for a single date. DateRangePicker takes { start, end }.',
    props: [['value', 'Date | null', 'Selected date.'], ['onChange', '(date) => void', 'Called with the chosen Date.'], ['placeholder', 'string', 'Trigger text when empty.']],
    code: `<DatePicker value={date} onChange={setDate} />
<DateRangePicker value={range} onChange={setRange} />` },
  { name: 'Dialog / Sheet', file: 'aether-overlays.jsx', desc: 'Centered modal (Dialog) or right drawer (Sheet). Portalled, Esc-dismissable, theme-aware.',
    props: [['open', 'boolean', 'Visibility.', true], ['onClose', '() => void', 'Close handler.', true], ['title / desc', 'node', 'Header content.'], ['icon / tone', 'string', "Accent icon + tone ('pos','neg','warn','info')."], ['footer', 'node', 'Footer (usually buttons).']],
    code: `<Dialog open={open} onClose={close}
  title="Delete account?" tone="neg" icon="x"
  footer={<>
    <Button size="sm" onClick={close}>Cancel</Button>
    <Button size="sm" variant="primary" onClick={remove}>Delete</Button>
  </>}>
  This action can't be undone.
</Dialog>` },
  { name: 'Toast', file: 'aether-overlays.jsx', desc: 'Global notifications. Mount <ToastHost/> once, then call window.toast() anywhere.',
    props: [['title', 'string', 'Heading.', true], ['body', 'string', 'Optional detail.'], ['tone', "'pos'|'neg'|'warn'|'info'", 'Color + icon.'], ['duration', 'number', 'ms before auto-dismiss (default 3600).']],
    code: `// once near your root:
<ToastHost />

// anywhere:
window.toast({ tone: 'pos', title: 'Saved', body: 'Changes are live.' })` },
  { name: 'DropdownMenu', file: 'aether-overlays.jsx', desc: 'Anchored action menu with headings, separators, icons, shortcuts and danger items.',
    props: [['trigger', 'node', 'The element that opens the menu.', true], ['items', 'Item[]', '{label, icon?, kbd?, onClick?, danger?, sep?, heading?}', true], ['align', "'start' | 'end'", 'Horizontal alignment.']],
    code: `<DropdownMenu
  trigger={<Button trailingIcon="chevDown">Actions</Button>}
  items={[
    { label: 'Manage', heading: true },
    { label: 'Edit', icon: 'settings', kbd: 'E' },
    { sep: true },
    { label: 'Delete', icon: 'x', danger: true },
  ]} />` },
  { name: 'Tabs / Accordion', file: 'aether-ui.jsx · aether-extras.jsx', desc: 'Underline Tabs and an animated, single/multi Accordion.',
    props: [['Tabs.tabs', 'string[] | {value,label,count}[]', 'Tab definitions.', true], ['Tabs.value / onChange', 'controlled', 'Active tab.'], ['Accordion.items', '{title, body, icon?}[]', 'Sections.', true], ['Accordion.multiple', 'boolean', 'Allow multiple open.']],
    code: `<Tabs value={tab} onChange={setTab}
  tabs={[{value:'a',label:'Overview'},{value:'b',label:'Usage',count:3}]} />

<Accordion defaultOpen={[0]} items={[
  { title: 'Security', body: 'Encrypted at rest.' },
]} />` },
  { name: 'Badge', file: 'aether-ui.jsx', desc: 'Status pill with semantic tones and an optional dot.',
    props: [['tone', "'pos'|'neg'|'warn'|'info'|'muted'", 'Color.'], ['dot', 'boolean', 'Leading status dot.']],
    code: `<Badge tone="pos" dot>Active</Badge>
<Badge tone="warn">Pending</Badge>` },
];

function DocsSection({ sub = 'start', onSub }) {
  React.useEffect(() => { window.__docSub = onSub; return () => { if (window.__docSub === onSub) window.__docSub = null; }; }, [onSub]);
  return (
    <>
      <h1 className="dx-h1">Documentation</h1>
      <p className="doc-lede" style={{ marginTop: 10 }}>Vespera is a copy-in component library. There's no package to install and no runtime: you copy the token CSS plus the file(s) for the components you actually use. Nothing you don't reference ships in your bundle.</p>
      <div key={sub} className="ag-rise" style={{ marginTop: 28 }}>
        {sub === 'start' && <DocStart />}
        {sub === 'modular' && <DocModular />}
        {sub === 'api' && <DocApi />}
        {sub === 'theming' && <DocTheming />}
      </div>
    </>
  );
}

function DocStart() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 760 }}>
      <div>
        <h3 className="doc-h3">1 · Drop in React + the tokens</h3>
        <p className="doc-p" style={{ margin: '6px 0 12px' }}>Vespera components are plain React (no build step needed for prototyping). Include React, the design tokens, and the component CSS.</p>
        <DocCode code={`<link rel="stylesheet" href="styles.css" />   <!-- tokens + theme -->
<link rel="stylesheet" href="ui.css" />       <!-- component styles -->

<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>`} />
      </div>
      <div>
        <h3 className="doc-h3">2 · Add only the components you use</h3>
        <p className="doc-p" style={{ margin: '6px 0 12px' }}>Each file registers its components on <span className="doc-pill">window</span>. Include the icon set, the core primitives, then any extras — skip what you don't need.</p>
        <DocCode code={`<script type="text/babel" src="icons.jsx"></script>
<script type="text/babel" src="aether-ui.jsx"></script>      <!-- Button, Input, Badge… -->
<script type="text/babel" src="aether-overlays.jsx"></script> <!-- Dialog, Toast… -->
<script type="text/babel" src="aether-select.jsx"></script>   <!-- Select, Combobox -->`} />
      </div>
      <div>
        <h3 className="doc-h3">3 · Use it</h3>
        <p className="doc-p" style={{ margin: '6px 0 12px' }}>Wrap your app in an element with <span className="doc-pill">.ag-root</span> and a theme attribute — that's what scopes the tokens (and overlays portal into it).</p>
        <DocCode code={`function App() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="ag-root" data-theme="dark">
      <Button variant="primary" leadingIcon="plus"
        onClick={() => setOpen(true)}>New account</Button>

      <Dialog open={open} onClose={() => setOpen(false)}
        title="Create account" icon="plus"
        footer={<Button variant="primary" size="sm">Create</Button>}>
        <Field label="Company"><Input placeholder="Acme Inc." /></Field>
      </Dialog>

      <ToastHost />
    </div>
  );
}`} />
      </div>
      <Alert tone="info" title="Production note">For a real app, copy the JSX into your own .tsx components and compile with your bundler. The in-browser Babel here is for zero-setup prototyping only.</Alert>
    </div>
  );
}

function DocModular() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 860 }}>
      <p className="doc-p">Two CSS files are always required (tokens + component styles). Everything else is opt-in. Pick a row, copy that file, and you're done — its components self-register and read the same tokens, so they look consistent with whatever else you've added.</p>
      <div className="doc-table-wrap"><table className="doc-props">
        <thead><tr><th><span className="eyebrow">File</span></th><th><span className="eyebrow">Provides</span></th><th><span className="eyebrow">Needs</span></th></tr></thead>
        <tbody>{DOC_FILES.map(([f, p, dep]) => (
          <tr key={f}><td style={{ whiteSpace: 'nowrap' }}>{f}</td><td style={{ color: 'var(--text-dim)' }}>{p}</td><td><span className="doc-pill">{dep}</span></td></tr>
        ))}</tbody>
      </table></div>
      <div>
        <h3 className="doc-h3">Example — a form, nothing else</h3>
        <p className="doc-p" style={{ margin: '6px 0 12px' }}>Want just inputs and a date picker? Three CSS/JS files. No charts, no overlays, no blocks in your bundle.</p>
        <DocCode code={`styles.css · ui.css            (tokens + styles)
icons.jsx · aether-ui.jsx      (Field, Input, Button, Checkbox…)
aether-datepicker.jsx          (DatePicker)`} />
      </div>
      <Alert tone="pos" title="Why this scales">Because there's no central index importing everything, an unused component is never referenced — so it's never in your build. You ship exactly what you compose.</Alert>
    </div>
  );
}

function DocApi() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {DOC_API.map(c => (
        <div key={c.name} style={{ maxWidth: 820 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
            <h3 className="doc-h3" style={{ margin: 0 }}>{c.name}</h3>
            <span className="doc-dep"><Icon.doc style={{ width: 13, height: 13 }} />{c.file}</span>
          </div>
          <p className="doc-p" style={{ marginBottom: 14 }}>{c.desc}</p>
          <div style={{ display: 'grid', gap: 14 }}>
            <DocCode code={c.code} />
            <PropsTable rows={c.props} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DocTheming() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 760 }}>
      <p className="doc-p">Everything is driven by CSS custom properties on <span className="doc-pill">.ag-root</span>. Re-theme the whole system by overriding a handful of variables — no component edits.</p>
      <div>
        <h3 className="doc-h3">Theme &amp; accent</h3>
        <p className="doc-p" style={{ margin: '6px 0 12px' }}><span className="doc-pill">data-theme</span> swaps light/dark; set <span className="doc-pill">--accent</span> for brand color. <span className="doc-pill">data-density</span> and <span className="doc-pill">data-corners</span> adjust spacing and radii.</p>
        <DocCode code={`<div class="ag-root"
  data-theme="dark"        /* dark | light */
  data-density="comfortable" /* compact | comfortable | spacious */
  data-corners="round"     /* round | soft | sharp */
  style="--accent:#4a7cff">
  …
</div>`} />
      </div>
      <div>
        <h3 className="doc-h3">Key tokens</h3>
        <DocCode code={`--accent           brand / primary color
--bg, --surface-1..3   backgrounds & cards
--text, --text-dim, --text-faint   text scale
--border, --border-strong  hairlines
--success --danger --warning  semantic colors
--r-sm --r-md --r-lg   radii   ·   --pad --gap   spacing
--ctrl-h            control height (inputs/buttons)`} />
      </div>
      <Alert tone="info" title="Fonts">Set <span className="doc-pill">--font-sans</span> and <span className="doc-pill">--font-mono</span> to use your own typefaces — the whole system follows.</Alert>
    </div>
  );
}

Object.assign(window, { DocsSection, DocCode, PropsTable, ChangelogSection });

/* ---------------- Changelog / Releases ---------------- */
const RELEASES = [
  { v: '1.5.0', date: 'Jun 10, 2026', tag: 'latest', items: [['Added', 'EventCalendar — Month / Week (appointment grid) / Agenda; click-to-add, drag range-select, onChange hook.']] },
  { v: '1.4.0', date: 'Jun 10, 2026', items: [['Added', 'Documentation + in-page Customize panel; named color set (--c-*) shared by Accent & Accent 2; --accent-2 token; Geist / Manrope / Outfit typefaces.'], ['Changed', 'Themed Select everywhere; nested side-nav for multi-section pages; tokens → --success / --danger / --warning.'], ['Fixed', 'Rail-mode label clipping; kanban holds the source slot until dropped.']] },
  { v: '1.3.0', date: 'Jun 9, 2026', items: [['Added', 'Spinner, CircularProgress, Accordion, FileDropzone, EmptyState, Banner, OTP, NumberStepper, Tree, Timeline, DescriptionList, InlineEdit, DatePicker; Button loading.'], ['Fixed', 'Overlays portal into .ag-root (theme-aware popups); accent caret.']] },
  { v: '1.2.0', date: 'Jun 9, 2026', items: [['Added', 'Power table (search, filters, sort, columns, CSV); sticky/frozen columns; cursor & load-more pagination; Combobox / MultiSelect / TokenInput; Pie chart.']] },
  { v: '1.1.0', date: 'Jun 8, 2026', items: [['Added', 'Pro blocks (orders, roles, status, keys, audit, kanban, wizards); admin ops screens; ⌘K command palette + search index; toasts.']] },
  { v: '1.0.0', date: 'Jun 8, 2026', items: [['Added', 'Initial Vespera design system + Admin template — tokens, light/dark, density, primitives, charts, showcase.']] },
];
const REL_TONE = { Added: 'success', Changed: 'info', Fixed: 'warning' };
function ChangelogSection() {
  return (
    <>
      <h1 className="dx-h1">Changelog</h1>
      <p className="dx-lede">Versioned releases of the design system. The prototype evolves first; the modular <span className="doc-pill">src/</span> sources and tags catch up and are logged here.</p>
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {RELEASES.map((r, i) => (
          <div key={r.v} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 24, paddingBottom: 28 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="tnum" style={{ fontWeight: 800, fontSize: 17 }}>v{r.v}</span>
                {r.tag && <Badge tone="info">{r.tag}</Badge>}
              </div>
              <div className="eyebrow" style={{ marginTop: 4 }}>{r.date}</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 22, paddingBottom: i < RELEASES.length - 1 ? 4 : 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {r.items.map(([type, text], j) => (
                <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Badge tone={REL_TONE[type]}>{type}</Badge>
                  <span style={{ fontSize: 13.5, color: 'var(--text-dim)', lineHeight: 1.55, flex: 1 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
