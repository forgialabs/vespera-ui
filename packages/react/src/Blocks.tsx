import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@vespera-ui/icons';
import { cx } from './cx';
import { getPortalTarget } from './portal';
import { Avatar } from './Avatar';
import { Badge, type BadgeTone } from './Badge';
import { Button } from './Button';
import { Tabs } from './Tabs';
import { Tooltip } from './Tooltip';
import { Select } from './Select';
import { DropdownMenu } from './Anchored';
import { toast } from './Toast';

/* ---------------- shared frame ---------------- */

export interface BlockProps {
  /** Optional heading shown above the card. */
  title?: ReactNode;
  /** Optional sub-heading under the title. */
  desc?: ReactNode;
  children?: ReactNode;
}

/** A titled section wrapping its content in a Vespera `card`. */
export function Block({ title, desc, children }: BlockProps) {
  return (
    <div>
      {title && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.01em' }}>{title}</div>
          {desc && (
            <div style={{ fontSize: 13, marginTop: 3, color: 'var(--text-dim)' }}>{desc}</div>
          )}
        </div>
      )}
      <div className="card">{children}</div>
    </div>
  );
}

const barStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '11px 14px',
  borderBottom: '1px solid var(--border)',
};

function Bar({ children }: { children: ReactNode }) {
  return <div style={barStyle}>{children}</div>;
}

function Body({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ padding: 14, ...style }}>{children}</div>;
}

/* ===================== Orders ===================== */

export type OrderState = 'fulfilled' | 'processing' | 'pending' | 'refunded';

export interface Order {
  id: string;
  company: string;
  hue: number;
  item: string;
  state: OrderState;
  amount: number;
}

const ORDER_TONE: Record<OrderState, BadgeTone> = {
  fulfilled: 'pos',
  processing: 'info',
  pending: 'warn',
  refunded: 'neg',
};

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ORD-90210',
    company: 'Northwind',
    hue: 220,
    item: 'Annual license',
    state: 'fulfilled',
    amount: 2400,
  },
  {
    id: 'ORD-90211',
    company: 'Halcyon',
    hue: 150,
    item: 'Seat add-on',
    state: 'processing',
    amount: 320,
  },
  {
    id: 'ORD-90212',
    company: 'Vertex',
    hue: 280,
    item: 'Pro upgrade',
    state: 'pending',
    amount: 980,
  },
  {
    id: 'ORD-90213',
    company: 'Cobalt',
    hue: 12,
    item: 'API overage',
    state: 'refunded',
    amount: 140,
  },
  {
    id: 'ORD-90214',
    company: 'Beacon',
    hue: 95,
    item: 'Support plan',
    state: 'fulfilled',
    amount: 3120,
  },
  {
    id: 'ORD-90215',
    company: 'Lumen',
    hue: 320,
    item: 'Onboarding',
    state: 'processing',
    amount: 1500,
  },
];

export interface OrdersBlockProps {
  orders?: Order[];
}

/** Operational table: tab filters, bulk selection, status badges, row menu. */
export function OrdersBlock({ orders = DEFAULT_ORDERS }: OrdersBlockProps) {
  const [tab, setTab] = useState('all');
  const [sel, setSel] = useState<Set<string>>(() => new Set());
  const rows = orders.filter((o) => tab === 'all' || o.state === tab);
  const allSel = rows.length > 0 && rows.every((r) => sel.has(r.id));
  const toggleAll = () =>
    setSel((s) => {
      const n = new Set(s);
      if (allSel) rows.forEach((r) => n.delete(r.id));
      else rows.forEach((r) => n.add(r.id));
      return n;
    });
  const toggle = (id: string) =>
    setSel((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <Block
      title="Orders"
      desc="Operational table with tab filters, bulk selection, inline status and a row action menu."
    >
      <Bar>
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'all', label: 'All', count: orders.length },
            { value: 'processing', label: 'Processing' },
            { value: 'pending', label: 'Pending' },
            { value: 'refunded', label: 'Refunded' },
          ]}
        />
        <div style={{ flex: 1 }} />
        {sel.size > 0 ? (
          <>
            <Badge tone="info">{sel.size} selected</Badge>
            <Button variant="ghost" size="sm" leadingIcon={<Icon.download />}>
              Export
            </Button>
            <Button variant="ghost" size="sm" leadingIcon={<Icon.check />}>
              Fulfill
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" leadingIcon={<Icon.filter />}>
              Filter
            </Button>
            <Button variant="primary" size="sm" leadingIcon={<Icon.plus />}>
              New order
            </Button>
          </>
        )}
      </Bar>
      <div style={{ overflowX: 'auto' }}>
        <table className="ui-table" style={{ minWidth: 720 }}>
          <thead>
            <tr>
              <th style={{ width: 44 }}>
                <span
                  className={cx('ui-check', allSel && 'on')}
                  onClick={toggleAll}
                  role="checkbox"
                  aria-checked={allSel}
                >
                  <Icon.check />
                </span>
              </th>
              <th>
                <span className="eyebrow">Order</span>
              </th>
              <th>
                <span className="eyebrow">Customer</span>
              </th>
              <th>
                <span className="eyebrow">Item</span>
              </th>
              <th>
                <span className="eyebrow">Status</span>
              </th>
              <th style={{ textAlign: 'right' }}>
                <span className="eyebrow">Amount</span>
              </th>
              <th style={{ width: 44 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr
                key={o.id}
                style={{
                  background: sel.has(o.id)
                    ? 'color-mix(in oklab, var(--accent) 7%, transparent)'
                    : undefined,
                }}
              >
                <td>
                  <span
                    className={cx('ui-check', sel.has(o.id) && 'on')}
                    onClick={() => toggle(o.id)}
                    role="checkbox"
                    aria-checked={sel.has(o.id)}
                  >
                    <Icon.check />
                  </span>
                </td>
                <td className="mono" style={{ fontWeight: 600 }}>
                  {o.id}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={o.company} hue={o.hue} size={28} />
                    <span style={{ fontWeight: 500 }}>{o.company}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-dim)' }}>{o.item}</td>
                <td>
                  <Badge tone={ORDER_TONE[o.state]} dot>
                    {o.state}
                  </Badge>
                </td>
                <td className="tnum" style={{ textAlign: 'right', fontWeight: 700 }}>
                  ${o.amount.toLocaleString()}
                </td>
                <td>
                  <DropdownMenu
                    trigger={
                      <button
                        type="button"
                        className="vsp-icon-btn"
                        style={{ width: 30, height: 30, border: 0, background: 'transparent' }}
                        aria-label="Row actions"
                      >
                        <Icon.more />
                      </button>
                    }
                    items={[
                      { label: 'View order', icon: <Icon.eye /> },
                      { label: 'Refund', icon: <Icon.refresh /> },
                      { sep: true },
                      { label: 'Cancel', icon: <Icon.x />, danger: true },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Block>
  );
}

/* ===================== Team & roles ===================== */

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  hue: number;
  role: string;
}

const DEFAULT_MEMBERS: TeamMember[] = [
  { id: 0, name: 'Avery Quinn', email: 'avery@vespera.dev', hue: 250, role: 'Owner' },
  { id: 1, name: 'Maya Okafor', email: 'maya@northwind.com', hue: 220, role: 'Admin' },
  { id: 2, name: 'Leo Vega', email: 'leo@halcyon.com', hue: 150, role: 'Editor' },
  { id: 3, name: 'Noor Haddad', email: 'noor@beacon.com', hue: 40, role: 'Viewer' },
];

export interface TeamRolesBlockProps {
  members?: TeamMember[];
}

/** Member list with inline role selects and a per-row action menu. */
export function TeamRolesBlock({ members: initial = DEFAULT_MEMBERS }: TeamRolesBlockProps) {
  const [members, setMembers] = useState(initial);
  return (
    <Block title="Team & roles" desc="Manage members and permissions with inline role selects.">
      <Bar>
        <Icon.users style={{ width: 17, height: 17, color: 'var(--accent)' }} />
        <b style={{ fontSize: 13.5 }}>Members</b>
        <Badge tone="muted">{members.length}</Badge>
        <div style={{ flex: 1 }} />
        <Button variant="primary" size="sm" leadingIcon={<Icon.mail />}>
          Invite
        </Button>
      </Bar>
      <Body style={{ paddingTop: 4, paddingBottom: 4 }}>
        {members.map((m) => (
          <div key={m.id} className="ui-row">
            <Avatar name={m.name} hue={m.hue} size={38} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.name}</div>
              <div className="mono" style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>
                {m.email}
              </div>
            </div>
            {m.role === 'Owner' ? (
              <Badge tone="info">Owner</Badge>
            ) : (
              <div style={{ width: 130 }}>
                <Select
                  value={m.role}
                  onChange={(v) =>
                    setMembers((x) => x.map((y) => (y.id === m.id ? { ...y, role: String(v) } : y)))
                  }
                  options={['Admin', 'Editor', 'Viewer']}
                />
              </div>
            )}
            <DropdownMenu
              trigger={
                <button
                  type="button"
                  className="vsp-icon-btn"
                  style={{ width: 32, height: 32 }}
                  aria-label="Member actions"
                >
                  <Icon.more />
                </button>
              }
              items={[
                { label: 'Resend invite', icon: <Icon.mail /> },
                { label: 'Transfer ownership', icon: <Icon.shield /> },
                { sep: true },
                { label: 'Remove', icon: <Icon.x />, danger: true },
              ]}
            />
          </div>
        ))}
      </Body>
    </Block>
  );
}

/* ===================== System status ===================== */

export type ServiceStatus = 'operational' | 'degraded' | 'maintenance' | 'down';

export interface Service {
  name: string;
  status: ServiceStatus;
  uptime: number;
}

const STATUS_TONE: Record<ServiceStatus, BadgeTone> = {
  operational: 'pos',
  degraded: 'warn',
  maintenance: 'info',
  down: 'neg',
};

const DEFAULT_SERVICES: Service[] = [
  { name: 'API gateway', status: 'operational', uptime: 99.98 },
  { name: 'Database', status: 'operational', uptime: 99.95 },
  { name: 'Webhooks', status: 'degraded', uptime: 98.2 },
  { name: 'Auth service', status: 'operational', uptime: 100 },
  { name: 'Billing', status: 'maintenance', uptime: 99.8 },
];

export interface SystemStatusBlockProps {
  services?: Service[];
}

/** Live service health with 30-day uptime bars. */
export function SystemStatusBlock({ services = DEFAULT_SERVICES }: SystemStatusBlockProps) {
  const allOk = services.every((s) => s.status === 'operational');
  return (
    <Block title="System status" desc="Live service health with 30-day uptime bars.">
      <Bar>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            background: allOk ? 'var(--success)' : 'var(--warning)',
            boxShadow: `0 0 8px ${allOk ? 'var(--success)' : 'var(--warning)'}`,
          }}
        />
        <b style={{ fontSize: 13.5 }}>
          {allOk ? 'All systems operational' : 'Partial degradation'}
        </b>
        <div style={{ flex: 1 }} />
        <span className="eyebrow">Updated 30s ago</span>
      </Bar>
      <Body style={{ paddingTop: 4, paddingBottom: 8 }}>
        {services.map((s) => (
          <div key={s.name} className="ui-row" style={{ alignItems: 'center' }}>
            <div style={{ width: 150, flexShrink: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.name}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', gap: 2, alignItems: 'flex-end', height: 26 }}>
              {Array.from({ length: 44 }).map((_, i) => {
                const bad =
                  (s.status === 'degraded' && i > 38 && i < 42) ||
                  (s.status === 'maintenance' && i === 43);
                return (
                  <span
                    key={i}
                    style={{
                      flex: 1,
                      height: bad ? '60%' : '100%',
                      borderRadius: 2,
                      background: bad
                        ? s.status === 'degraded'
                          ? 'var(--warning)'
                          : 'var(--accent)'
                        : 'color-mix(in oklab, var(--success) 70%, transparent)',
                    }}
                  />
                );
              })}
            </div>
            <span
              className="mono tnum"
              style={{ width: 56, textAlign: 'right', fontSize: 12, color: 'var(--text-dim)' }}
            >
              {s.uptime}%
            </span>
            <Badge tone={STATUS_TONE[s.status]} dot>
              {s.status}
            </Badge>
          </div>
        ))}
      </Body>
    </Block>
  );
}

/* ===================== API keys ===================== */

export interface ApiKey {
  id: number;
  name: string;
  token: string;
  /** Full secret shown when revealed. */
  secret: string;
  created: string;
  last: string;
}

const DEFAULT_KEYS: ApiKey[] = [
  {
    id: 1,
    name: 'Production',
    token: 'vsp_live_8f2a…d91c',
    secret: 'vsp_live_8f2a39c4e7b1d91c',
    created: 'Jan 14, 2026',
    last: '2m ago',
  },
  {
    id: 2,
    name: 'Staging',
    token: 'vsp_test_4b7e…02fa',
    secret: 'vsp_test_4b7e1d9a55c302fa',
    created: 'Mar 02, 2026',
    last: '3d ago',
  },
  {
    id: 3,
    name: 'CI / CD',
    token: 'vsp_live_19cc…7a4b',
    secret: 'vsp_live_19cc8e2f0b6d7a4b',
    created: 'Apr 21, 2026',
    last: '12h ago',
  },
];

export interface ApiKeysBlockProps {
  keys?: ApiKey[];
}

/** Reveal, copy, and revoke API credentials; secrets stay masked by default. */
export function ApiKeysBlock({ keys: initial = DEFAULT_KEYS }: ApiKeysBlockProps) {
  const [keys, setKeys] = useState(initial);
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set());
  const toggleReveal = (id: number) =>
    setRevealed((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  return (
    <Block
      title="API keys"
      desc="Reveal, copy, and revoke credentials. Secrets stay masked by default."
    >
      <Bar>
        <Icon.bolt style={{ width: 17, height: 17, color: 'var(--accent)' }} />
        <b style={{ fontSize: 13.5 }}>Secret keys</b>
        <div style={{ flex: 1 }} />
        <Button
          variant="primary"
          size="sm"
          leadingIcon={<Icon.plus />}
          onClick={() => toast({ tone: 'pos', title: 'API key created' })}
        >
          Create key
        </Button>
      </Bar>
      <Body style={{ paddingTop: 4, paddingBottom: 4 }}>
        {keys.map((k) => {
          const show = revealed.has(k.id);
          return (
            <div key={k.id} className="ui-row">
              <div style={{ minWidth: 96 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{k.name}</div>
                <div className="eyebrow" style={{ marginTop: 2 }}>
                  {k.created}
                </div>
              </div>
              <code
                className="mono"
                style={{
                  flex: 1,
                  fontSize: 12.5,
                  color: 'var(--text-dim)',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  padding: '7px 11px',
                  letterSpacing: '.02em',
                }}
              >
                {show ? k.secret : k.token}
              </code>
              <Tooltip label={show ? 'Hide' : 'Reveal'}>
                <button
                  type="button"
                  className="vsp-icon-btn"
                  style={{ width: 34, height: 34 }}
                  onClick={() => toggleReveal(k.id)}
                  aria-label={show ? 'Hide secret' : 'Reveal secret'}
                >
                  <Icon.eye />
                </button>
              </Tooltip>
              <Tooltip label="Copy">
                <button
                  type="button"
                  className="vsp-icon-btn"
                  style={{ width: 34, height: 34 }}
                  onClick={() => toast({ title: 'Copied to clipboard' })}
                  aria-label="Copy secret"
                >
                  <Icon.doc />
                </button>
              </Tooltip>
              <span className="eyebrow" style={{ width: 66, textAlign: 'right' }}>
                {k.last}
              </span>
              <Button
                variant="subtle"
                size="sm"
                onClick={() => {
                  setKeys((x) => x.filter((y) => y.id !== k.id));
                  toast({ tone: 'neg', title: 'Key revoked' });
                }}
              >
                Revoke
              </Button>
            </div>
          );
        })}
      </Body>
    </Block>
  );
}

/* ===================== Audit log ===================== */

export interface AuditEntry {
  who: string;
  action: string;
  tag: string;
  time: string;
  icon: ReactNode;
}

const DEFAULT_AUDIT: AuditEntry[] = [
  {
    who: 'Avery Quinn',
    action: 'updated billing settings',
    tag: 'Settings',
    time: '2 min ago',
    icon: <Icon.settings />,
  },
  {
    who: 'Maya Okafor',
    action: 'upgraded to Enterprise',
    tag: 'Billing',
    time: '38 min ago',
    icon: <Icon.arrowUp />,
  },
  {
    who: 'System',
    action: 'rotated production API key',
    tag: 'Security',
    time: '1 hr ago',
    icon: <Icon.shield />,
  },
  {
    who: 'Leo Vega',
    action: 'invited 4 members',
    tag: 'Team',
    time: '3 hr ago',
    icon: <Icon.users />,
  },
  {
    who: 'Billing',
    action: 'flagged failed payment · Cobalt',
    tag: 'Billing',
    time: '5 hr ago',
    icon: <Icon.bell />,
  },
];

export interface AuditLogBlockProps {
  entries?: AuditEntry[];
}

/** A chronological trail of privileged actions, as a timeline. */
export function AuditLogBlock({ entries = DEFAULT_AUDIT }: AuditLogBlockProps) {
  return (
    <Block title="Audit log" desc="A chronological trail of every privileged action.">
      <Bar>
        <Icon.clock style={{ width: 17, height: 17, color: 'var(--accent)' }} />
        <b style={{ fontSize: 13.5 }}>Recent activity</b>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="sm" leadingIcon={<Icon.download />}>
          Export log
        </Button>
      </Bar>
      <Body>
        <div style={{ position: 'relative', paddingLeft: 8 }}>
          {entries.map((e, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 14,
                paddingBottom: i < entries.length - 1 ? 20 : 0,
                position: 'relative',
              }}
            >
              {i < entries.length - 1 && (
                <span
                  style={{
                    position: 'absolute',
                    left: 15,
                    top: 32,
                    bottom: 0,
                    width: 1.5,
                    background: 'var(--border)',
                  }}
                />
              )}
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  flexShrink: 0,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-dim)',
                  zIndex: 1,
                }}
              >
                {e.icon}
              </span>
              <div style={{ flex: 1, paddingTop: 5 }}>
                <div style={{ fontSize: 13.5 }}>
                  <b style={{ fontWeight: 700 }}>{e.who}</b>{' '}
                  <span style={{ color: 'var(--text-dim)' }}>{e.action}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                  <Badge tone="muted">{e.tag}</Badge>
                  <span className="eyebrow">{e.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Body>
    </Block>
  );
}

/* ===================== Kanban board ===================== */

export interface KanbanCard {
  id: string;
  title: string;
  tag: string;
  tone: BadgeTone;
}

export interface KanbanColumn {
  name: string;
  tone: string;
  cards: KanbanCard[];
}

const DEFAULT_COLUMNS: KanbanColumn[] = [
  {
    name: 'Triage',
    tone: 'var(--text-faint)',
    cards: [
      { id: 'k1', title: 'Cobalt payment failed', tag: 'Billing', tone: 'neg' },
      { id: 'k2', title: 'Verify SSO config', tag: 'Security', tone: 'warn' },
    ],
  },
  {
    name: 'In progress',
    tone: 'var(--accent)',
    cards: [
      { id: 'k3', title: 'Migrate Halcyon seats', tag: 'Accounts', tone: 'info' },
      { id: 'k4', title: 'Q2 expansion review', tag: 'Revenue', tone: 'info' },
      { id: 'k5', title: 'Webhook retry logic', tag: 'Product', tone: 'warn' },
    ],
  },
  {
    name: 'Done',
    tone: 'var(--success)',
    cards: [
      { id: 'k6', title: 'Ship usage billing', tag: 'Product', tone: 'pos' },
      { id: 'k7', title: 'Reconcile invoices', tag: 'Finance', tone: 'pos' },
    ],
  },
];

interface DragState {
  card: KanbanCard;
  from: number;
  origIndex: number;
  w: number;
  offX: number;
  offY: number;
}
interface DropTarget {
  col: number;
  index: number;
}

export interface KanbanBlockProps {
  columns?: KanbanColumn[];
  /** Called with the full column set after a card is moved. */
  onChange?: (columns: KanbanColumn[]) => void;
}

/** A lightweight kanban — drag cards to reorder or move between columns. */
export function KanbanBlock({ columns: initial = DEFAULT_COLUMNS, onChange }: KanbanBlockProps) {
  const [cols, setCols] = useState(initial);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [pt, setPt] = useState({ x: 0, y: 0 });
  const [target, setTarget] = useState<DropTarget | null>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragRef = useRef<DragState | null>(null);
  const targetRef = useRef<DropTarget | null>(null);

  const startDrag = (e: React.PointerEvent, card: KanbanCard, ci: number) => {
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const origIndex = cols[ci]!.cards.findIndex((c) => c.id === card.id);
    const d: DragState = {
      card,
      from: ci,
      origIndex,
      w: rect.width,
      offX: e.clientX - rect.left,
      offY: e.clientY - rect.top,
    };
    const home = { col: ci, index: origIndex };
    dragRef.current = d;
    targetRef.current = home;
    setDrag(d);
    setPt({ x: e.clientX, y: e.clientY });
    setTarget(home);
    e.preventDefault();
  };

  useEffect(() => {
    if (!drag) return;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    const move = (e: PointerEvent) => {
      setPt({ x: e.clientX, y: e.clientY });
      let found: DropTarget | null = null;
      colRefs.current.forEach((el, ci) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top - 60 &&
          e.clientY <= r.bottom + 80
        ) {
          const cards = Array.from(el.querySelectorAll('[data-kcard]'));
          let idx = cards.length;
          for (let i = 0; i < cards.length; i++) {
            const cr = cards[i]!.getBoundingClientRect();
            if (e.clientY < cr.top + cr.height / 2) {
              idx = i;
              break;
            }
          }
          found = { col: ci, index: idx };
        }
      });
      if (!found) found = { col: drag.from, index: drag.origIndex };
      targetRef.current = found;
      setTarget(found);
    };
    const up = () => {
      const d = dragRef.current;
      const tg = targetRef.current;
      if (d && tg) {
        setCols((cs) => {
          const next = cs.map((c) => ({ ...c, cards: c.cards.filter((x) => x.id !== d.card.id) }));
          next[tg.col]!.cards.splice(tg.index, 0, d.card);
          onChange?.(next);
          return next;
        });
      }
      dragRef.current = null;
      targetRef.current = null;
      setDrag(null);
      setTarget(null);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [drag, onChange]);

  const renderCard = (card: KanbanCard, ci: number) => (
    <div
      data-kcard
      className="card"
      onPointerDown={(e) => startDrag(e, card, ci)}
      style={{ padding: 13, cursor: 'grab', touchAction: 'none' }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 9, lineHeight: 1.4 }}>
        {card.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Badge tone={card.tone}>{card.tag}</Badge>
        <Avatar name="A Q" hue={250} size={22} />
      </div>
    </div>
  );

  const placeholder = (
    <div
      style={{
        border: '1.6px dashed color-mix(in oklab, var(--accent) 50%, var(--border))',
        background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
        borderRadius: 'var(--r-md)',
        height: 56,
      }}
    />
  );

  const portalTarget = getPortalTarget();

  return (
    <Block
      title="Operations board"
      desc="A lightweight kanban — drag a card to reorder it or move it between columns."
    >
      <Body style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {cols.map((col, ci) => {
          const items = col.cards.filter((c) => !(drag && c.id === drag.card.id));
          const showPh = !!drag && !!target && target.col === ci;
          return (
            <div
              key={col.name}
              ref={(el) => {
                colRefs.current[ci] = el;
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                  padding: '0 2px',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 99, background: col.tone }} />
                <b style={{ fontSize: 12.5 }}>{col.name}</b>
                <span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                  {col.cards.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 64 }}>
                {items.map((card, i) => (
                  <Fragment key={card.id}>
                    {showPh && target!.index === i && placeholder}
                    {renderCard(card, ci)}
                  </Fragment>
                ))}
                {showPh && target!.index >= items.length && placeholder}
                {items.length === 0 && !showPh && (
                  <div
                    style={{
                      border: '1.5px dashed var(--border)',
                      borderRadius: 'var(--r-sm)',
                      padding: '18px 0',
                      textAlign: 'center',
                      fontSize: 12,
                      color: 'var(--text-faint)',
                    }}
                  >
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Body>
      {drag &&
        portalTarget &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              left: pt.x - drag.offX,
              top: pt.y - drag.offY,
              width: drag.w,
              zIndex: 600,
              pointerEvents: 'none',
              transform: 'rotate(2.5deg) scale(1.03)',
              opacity: 0.96,
            }}
          >
            <div
              className="card"
              style={{
                padding: 13,
                boxShadow: 'var(--shadow-lg)',
                borderColor: 'color-mix(in oklab, var(--accent) 40%, var(--border))',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 9, lineHeight: 1.4 }}>
                {drag.card.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Badge tone={drag.card.tone}>{drag.card.tag}</Badge>
                <Avatar name="A Q" hue={250} size={22} />
              </div>
            </div>
          </div>,
          portalTarget,
        )}
    </Block>
  );
}
