'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { Icon } from '@vespera-ui/icons';
import {
  ApiKeysBlock,
  AreaChart,
  AuditLogBlock,
  Avatar,
  Badge,
  BarChart,
  Button,
  Card,
  CardHead,
  CircularProgress,
  CommandPalette,
  DatePicker,
  DateRangePicker,
  Dialog,
  Divider,
  Donut,
  DropdownMenu,
  EventCalendar,
  Field,
  IconButton,
  Input,
  KanbanBlock,
  NavGroup,
  NavItem,
  OrdersBlock,
  Popover,
  Progress,
  RadioGroup,
  Segmented,
  Select,
  SettingRow,
  Sheet,
  Slider,
  Sparkline,
  StatCard,
  Switch,
  SystemStatusBlock,
  TeamRolesBlock,
  Textarea,
  Timeline,
  ToastHost,
  toast,
  useCmdK,
  type DateRange,
  type SelectValue,
} from '@vespera-ui/react';
import { DashboardTemplate } from './templates';

const ACCENTS = ['#4a7cff', '#1fb574', '#b16cff', '#ff7a6b', '#f5a524', '#16b6c9'];
const revenue = [
  [12, 18, 15, 22, 19, 26, 24, 31, 28, 35, 33, 42],
  [8, 11, 10, 14, 13, 16, 15, 19, 18, 22, 21, 27],
];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const traffic = [
  { label: 'Direct', value: 42, color: 'var(--accent)' },
  { label: 'Referral', value: 28, color: 'var(--accent-2)' },
  { label: 'Organic', value: 19, color: 'var(--success)' },
  { label: 'Social', value: 11, color: 'var(--warning)' },
];

interface ThemeState {
  theme: 'dark' | 'light';
  setTheme: (v: 'dark' | 'light') => void;
  accent: string;
  setAccent: (v: string) => void;
  density: string;
  setDensity: (v: string) => void;
  corners: string;
  setCorners: (v: string) => void;
}

/* ---------------- appearance controls (shared by the Customize sheet + Settings) ---------------- */
function Appearance(t: ThemeState) {
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Theme
        </div>
        <Segmented
          options={['dark', 'light']}
          value={t.theme}
          onChange={(v) => t.setTheme(v as 'dark' | 'light')}
        />
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Accent
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ACCENTS.map((a) => (
            <button
              key={a}
              type="button"
              aria-label={`accent ${a}`}
              onClick={() => t.setAccent(a)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                cursor: 'pointer',
                background: a,
                border: a === t.accent ? '2px solid var(--text)' : '2px solid var(--border)',
                boxShadow: a === t.accent ? `0 0 0 2px ${a}` : 'none',
              }}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Density
        </div>
        <Segmented
          options={['compact', 'comfortable', 'spacious']}
          value={t.density}
          onChange={t.setDensity}
        />
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Corners
        </div>
        <Segmented options={['sharp', 'soft', 'round']} value={t.corners} onChange={t.setCorners} />
      </div>
    </div>
  );
}

/* ---------------- views ---------------- */
function AnalyticsView() {
  const [range, setRange] = useState('30d');
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: '-.02em' }}>Analytics</h2>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--text-dim)' }}>
            Revenue, sessions, and conversion over time.
          </p>
        </div>
        <Segmented options={['7d', '30d', '90d']} value={range} onChange={setRange} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <StatCard icon={<Icon.dollar />} label="Revenue" value="$48.2k" delta="12%" deltaDir="up" spark={[12, 18, 15, 22, 19, 26, 24, 31]} />
        <StatCard icon={<Icon.globe />} label="Sessions" value="92.4k" delta="6%" deltaDir="up" spark={[20, 22, 21, 25, 24, 28, 27, 31]} sparkColor="var(--accent-2)" />
        <StatCard icon={<Icon.trend />} label="Conversion" value="3.8%" delta="0.6%" deltaDir="up" spark={[2, 3, 3, 4, 4, 5, 5, 6]} sparkColor="var(--success)" />
        <StatCard icon={<Icon.clock />} label="Avg. session" value="4m 12s" delta="14s" deltaDir="down" spark={[6, 5, 6, 5, 5, 4, 5, 4]} sparkColor="var(--warning)" />
      </div>
      <Card>
        <CardHead title="Revenue vs. target" desc="Last 12 months" right={<Badge tone="pos" dot>+18%</Badge>} />
        <div className="card-pad">
          <AreaChart series={revenue} labels={months} height={240} dual />
        </div>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <Card>
          <CardHead title="Weekly orders" />
          <div className="card-pad">
            <BarChart data={[40, 65, 52, 78, 61, 90, 72]} labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']} height={180} />
          </div>
        </Card>
        <Card>
          <CardHead title="Traffic sources" />
          <div className="card-pad" style={{ display: 'flex', justifyContent: 'center' }}>
            <Donut data={traffic} size={180} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function CalendarView() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <EventCalendar />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <Card>
          <CardHead title="Jump to date" />
          <div className="card-pad" style={{ display: 'grid', gap: 14 }}>
            <Field label="Date">
              <DatePicker value={date} onChange={setDate} />
            </Field>
            <Field label="Reporting range">
              <DateRangePicker value={range} onChange={setRange} />
            </Field>
          </div>
        </Card>
        <Card>
          <CardHead title="Upcoming" />
          <div className="card-pad">
            <Timeline
              items={[
                { title: 'Q2 board review', time: 'Tomorrow · 10:00', tone: 'info', icon: <Icon.users /> },
                { title: 'Security audit', time: 'Thu · 13:00', tone: 'warn', icon: <Icon.shield /> },
                { title: 'Quarterly close', time: 'Fri · all day', tone: 'pos', icon: <Icon.check /> },
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function SettingsView(t: ThemeState & { onDelete: () => void }) {
  const [name, setName] = useState('Avery Quinn');
  const [tz, setTz] = useState<SelectValue>('UTC');
  const [plan, setPlan] = useState('Annual');
  const [emails, setEmails] = useState(true);
  const [digest, setDigest] = useState(false);
  const [seats, setSeats] = useState(12);
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 760 }}>
      <Card>
        <CardHead title="Profile" desc="Your personal account details." />
        <div className="card-pad" style={{ display: 'grid', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar name={name} hue={250} size={52} />
            <Button size="sm" variant="outline" leadingIcon={<Icon.refresh />}>
              Change photo
            </Button>
          </div>
          <Field label="Full name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input defaultValue="avery@vespera.dev" />
          </Field>
          <div>
            <Button variant="primary" size="sm" onClick={() => toast({ tone: 'pos', title: 'Profile saved' })}>
              Save changes
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHead title="Workspace" desc="Plan, seats, and notifications." />
        <div className="card-pad">
          <SettingRow title="Email notifications" desc="Activity, mentions, and invites.">
            <Switch checked={emails} onChange={setEmails} aria-label="Email notifications" />
          </SettingRow>
          <SettingRow title="Weekly digest" desc="A Monday summary of the week.">
            <Switch checked={digest} onChange={setDigest} aria-label="Weekly digest" />
          </SettingRow>
          <SettingRow title="Timezone">
            <div style={{ width: 180 }}>
              <Select options={['UTC', 'America/New_York', 'Europe/London', 'Asia/Singapore']} value={tz} onChange={setTz} />
            </div>
          </SettingRow>
          <SettingRow title="Billing plan" desc="Annual saves 20%.">
            <RadioGroup
              value={plan}
              onChange={setPlan}
              options={[
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Annual', label: 'Annual' },
              ]}
            />
          </SettingRow>
          <SettingRow title={`Seats · ${seats}`} desc="Included in your plan." last>
            <div style={{ width: 200 }}>
              <Slider value={seats} onChange={setSeats} min={1} max={50} />
            </div>
          </SettingRow>
        </div>
      </Card>

      <Card>
        <CardHead title="Appearance" desc="Theme, accent, density, and corners — applied live." />
        <div className="card-pad">
          <Appearance {...t} />
        </div>
      </Card>

      <Card>
        <CardHead title="Danger zone" />
        <div className="card-pad" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
            Permanently delete this workspace and all of its data.
          </div>
          <Button variant="danger" size="sm" onClick={t.onDelete}>
            Delete workspace
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface ViewDef {
  id: string;
  label: string;
  icon: ReactNode;
  group: 'Workspace' | 'Manage';
  badge?: string;
  render: (t: ThemeState & { onDelete: () => void }) => ReactNode;
}

const VIEWS: ViewDef[] = [
  { id: 'overview', label: 'Overview', icon: <Icon.grid />, group: 'Workspace', render: () => <DashboardTemplate /> },
  { id: 'analytics', label: 'Analytics', icon: <Icon.trend />, group: 'Workspace', render: () => <AnalyticsView /> },
  { id: 'orders', label: 'Orders', icon: <Icon.cart />, group: 'Workspace', badge: '6', render: () => <OrdersBlock /> },
  { id: 'board', label: 'Board', icon: <Icon.layers />, group: 'Workspace', render: () => <KanbanBlock /> },
  { id: 'calendar', label: 'Calendar', icon: <Icon.calendar />, group: 'Workspace', render: () => <CalendarView /> },
  { id: 'team', label: 'Team', icon: <Icon.users />, group: 'Manage', render: () => <TeamRolesBlock /> },
  { id: 'keys', label: 'API keys', icon: <Icon.bolt />, group: 'Manage', render: () => <ApiKeysBlock /> },
  { id: 'audit', label: 'Audit log', icon: <Icon.clock />, group: 'Manage', render: () => <AuditLogBlock /> },
  { id: 'system', label: 'System', icon: <Icon.pulse />, group: 'Manage', render: () => <SystemStatusBlock /> },
  { id: 'settings', label: 'Settings', icon: <Icon.settings />, group: 'Manage', render: (t) => <SettingsView {...t} /> },
];

/**
 * A complete, navigable admin console composed entirely from `@vespera-ui/react`
 * — grouped sidebar nav, a top bar with ⌘K command palette + notifications + a
 * user menu, a live theme customizer, and a dozen feature views. The real,
 * published components, not a browser-compiled prototype.
 */
export function AdminConsole() {
  const [active, setActive] = useState('overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accent, setAccent] = useState('#4a7cff');
  const [density, setDensity] = useState('comfortable');
  const [corners, setCorners] = useState('round');
  const [cmdOpen, setCmdOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [del, setDel] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  useCmdK(setCmdOpen);

  // Drawer: close on Escape, and restore focus to the trigger when it closes.
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawer(false);
        hamburgerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer]);

  const themeState: ThemeState = { theme, setTheme, accent, setAccent, density, setDensity, corners, setCorners };
  const view = VIEWS.find((v) => v.id === active) ?? VIEWS[0]!;
  const go = (id: string) => {
    setActive(id);
    setCmdOpen(false);
  };

  const navFor = (group: 'Workspace' | 'Manage') =>
    VIEWS.filter((v) => v.group === group).map((v) => (
      <NavItem
        key={v.id}
        icon={v.icon}
        label={v.label}
        badge={v.badge}
        active={v.id === active}
        onClick={() => {
          setActive(v.id);
          setDrawer(false);
        }}
      />
    ));

  return (
    <div
      className="vsp-root vsp-app"
      data-theme={theme}
      data-density={density}
      data-corners={corners}
      data-drawer={drawer ? 'open' : undefined}
      style={{ '--accent': accent, '--bg-accent': accent, minHeight: '100dvh' } as CSSProperties}
    >
      <div className="vsp-bg" aria-hidden="true">
        <b />
        <b />
        <b />
      </div>
      <button
        type="button"
        className="vsp-side-scrim"
        aria-label="Close menu"
        onClick={() => setDrawer(false)}
      />

      {/* Sidebar */}
      <aside
        id="vsp-admin-side"
        className="vsp-side"
        style={{ display: 'flex', flexDirection: 'column', padding: '16px 12px', gap: 2, position: 'relative', zIndex: 1 }}
      >
        <Link
          href="/"
          aria-label="Vespera home"
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 12px', textDecoration: 'none', color: 'inherit' }}
        >
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 'var(--r-sm)',
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(140deg, var(--accent), var(--accent-2))',
              color: '#fff',
            }}
          >
            <Icon.sparkle style={{ width: 17, height: 17 }} />
          </span>
          <div style={{ minWidth: 0 }}>
            <b style={{ fontSize: 15, letterSpacing: '-.01em', display: 'block', lineHeight: 1.1 }}>Vespera</b>
            <span className="eyebrow">Acme Inc</span>
          </div>
        </Link>

        <Link
          href="/docs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '7px 10px',
            marginBottom: 8,
            borderRadius: 'var(--r-sm)',
            color: 'var(--text-dim)',
            textDecoration: 'none',
            fontSize: 12.5,
            fontWeight: 500,
          }}
        >
          <Icon.chevLeft style={{ width: 14, height: 14 }} />
          Back to docs
        </Link>

        <NavGroup label="Workspace" defaultOpen>
          {navFor('Workspace')}
        </NavGroup>
        <NavGroup label="Manage" defaultOpen>
          {navFor('Manage')}
        </NavGroup>

        <div style={{ flex: 1 }} />
        <NavItem icon={<Icon.sun />} label="Customize" onClick={() => setCustomize(true)} />
        <Divider />
        <DropdownMenu
          align="start"
          trigger={
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px',
                width: '100%',
                border: 0,
                background: 'transparent',
                cursor: 'pointer',
                borderRadius: 'var(--r-sm)',
                textAlign: 'left',
              }}
            >
              <Avatar name="Avery Quinn" hue={250} size={30} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>Avery Quinn</div>
                <div className="eyebrow">Owner</div>
              </div>
              <Icon.chevDown style={{ width: 15, height: 15, color: 'var(--text-faint)' }} />
            </button>
          }
          items={[
            { heading: true, label: 'avery@vespera.dev' },
            { label: 'Profile', icon: <Icon.user />, onClick: () => setActive('settings') },
            { label: 'Settings', icon: <Icon.settings />, kbd: '⌘,', onClick: () => setActive('settings') },
            { sep: true },
            { label: 'Log out', icon: <Icon.logout />, danger: true, onClick: () => toast('Logged out') },
          ]}
        />
      </aside>

      {/* Main */}
      <main className="vsp-main" style={{ position: 'relative', zIndex: 1 }}>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 22px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--glass)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <button
            ref={hamburgerRef}
            type="button"
            className="vsp-icon-btn vsp-drawer-btn"
            aria-label="Open menu"
            aria-expanded={drawer}
            aria-controls="vsp-admin-side"
            onClick={() => setDrawer(true)}
          >
            <Icon.menu style={{ width: 18, height: 18 }} />
          </button>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: '-.01em' }}>{view.label}</h1>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={() => setCmdOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              height: 'var(--ctrl-h)',
              padding: '0 10px',
              width: 'min(240px, 30vw)',
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              borderRadius: 'var(--r-sm)',
              color: 'var(--text-faint)',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            <Icon.search style={{ width: 15, height: 15 }} />
            <span style={{ flex: 1, textAlign: 'left' }}>Search…</span>
            <kbd className="ui-kbd">⌘K</kbd>
          </button>
          <IconButton
            icon={theme === 'dark' ? <Icon.sun /> : <Icon.moon />}
            label="Toggle theme"
            onClick={() => setTheme((v) => (v === 'dark' ? 'light' : 'dark'))}
          />
          <Popover
            align="end"
            trigger={
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <IconButton icon={<Icon.bell />} label="Notifications" />
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: 'var(--danger)',
                  }}
                />
              </span>
            }
          >
            <div style={{ padding: '6px 4px', width: 260 }}>
              <div className="eyebrow" style={{ padding: '4px 8px 8px' }}>
                Notifications
              </div>
              {[
                { icon: <Icon.cart />, t: 'New order · Vertex', s: '2m ago' },
                { icon: <Icon.users />, t: 'Maya joined the team', s: '1h ago' },
                { icon: <Icon.shield />, t: 'Production key rotated', s: '3h ago' },
              ].map((n, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px' }}>
                  <span style={{ color: 'var(--text-dim)', display: 'grid', placeItems: 'center', width: 20 }}>
                    {n.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13 }}>{n.t}</div>
                    <div className="eyebrow">{n.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </Popover>
        </header>

        <div className="vsp-content">
          <div className="vsp-content-inner" style={{ padding: 24 }}>
            {view.render({ ...themeState, onDelete: () => setDel(true) })}
          </div>
        </div>
      </main>

      {/* Command palette */}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        groups={[
          {
            label: 'Go to',
            items: VIEWS.map((v) => ({ label: v.label, icon: v.icon, keywords: v.id, onRun: () => go(v.id) })),
          },
          {
            label: 'Actions',
            items: [
              { label: 'New order', icon: <Icon.plus />, meta: '⌘N', onRun: () => toast({ tone: 'pos', title: 'New order' }) },
              { label: 'Invite member', icon: <Icon.mail />, onRun: () => toast('Invite sent') },
              { label: 'Toggle theme', icon: <Icon.sun />, onRun: () => setTheme((v) => (v === 'dark' ? 'light' : 'dark')) },
              { label: 'Customize appearance', icon: <Icon.settings />, onRun: () => setCustomize(true) },
            ],
          },
        ]}
      />

      {/* Customize sheet */}
      <Sheet
        open={customize}
        onClose={() => setCustomize(false)}
        icon={<Icon.sparkle />}
        title="Customize"
        desc="Theme the whole console live — every token is a CSS variable on .vsp-root."
      >
        <Appearance {...themeState} />
      </Sheet>

      {/* Delete dialog */}
      <Dialog
        open={del}
        onClose={() => setDel(false)}
        tone="neg"
        icon={<Icon.shield />}
        title="Delete workspace?"
        desc="This permanently removes the workspace and all of its data."
        footer={
          <>
            <Button onClick={() => setDel(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                setDel(false);
                toast({ tone: 'neg', title: 'Workspace deleted' });
              }}
            >
              Delete
            </Button>
          </>
        }
      />

      <ToastHost />
    </div>
  );
}