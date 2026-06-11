import { useState, type ReactNode } from 'react';
import { Icon } from '@vespera-ui/icons';
import {
  ApiKeysBlock,
  AuditLogBlock,
  Avatar,
  IconButton,
  KanbanBlock,
  NavItem,
  OrdersBlock,
  SystemStatusBlock,
  TeamRolesBlock,
  ToastHost,
} from '@vespera-ui/react';
import { DashboardTemplate } from './templates';

interface View {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: string;
  render: () => ReactNode;
}

/**
 * A complete, navigable admin console — sidebar nav + top bar + switchable
 * views — composed entirely from `@vespera-ui/react`. This is the published
 * components, not a browser-compiled prototype.
 */
export function AdminConsole() {
  const [active, setActive] = useState('overview');

  const VIEWS: View[] = [
    { id: 'overview', label: 'Overview', icon: <Icon.grid />, render: () => <DashboardTemplate /> },
    { id: 'orders', label: 'Orders', icon: <Icon.cart />, badge: '6', render: () => <OrdersBlock /> },
    { id: 'board', label: 'Board', icon: <Icon.layers />, render: () => <KanbanBlock /> },
    { id: 'team', label: 'Team', icon: <Icon.users />, render: () => <TeamRolesBlock /> },
    { id: 'keys', label: 'API keys', icon: <Icon.bolt />, render: () => <ApiKeysBlock /> },
    { id: 'audit', label: 'Audit log', icon: <Icon.clock />, render: () => <AuditLogBlock /> },
    { id: 'system', label: 'System', icon: <Icon.pulse />, render: () => <SystemStatusBlock /> },
  ];
  const view = VIEWS.find((v) => v.id === active) ?? VIEWS[0]!;

  return (
    <div style={{ display: 'flex', minHeight: '100dvh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 232,
          flexShrink: 0,
          borderRight: '1px solid var(--border)',
          padding: '18px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          background: 'var(--surface-1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '4px 8px 16px',
          }}
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
          <b style={{ fontSize: 15, letterSpacing: '-.01em' }}>Vespera</b>
        </div>
        {VIEWS.map((v) => (
          <NavItem
            key={v.id}
            icon={v.icon}
            label={v.label}
            badge={v.badge}
            active={v.id === active}
            onClick={() => setActive(v.id)}
          />
        ))}
        <div style={{ flex: 1 }} />
        <NavItem icon={<Icon.settings />} label="Settings" />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 8px 2px',
            borderTop: '1px solid var(--border)',
            marginTop: 8,
          }}
        >
          <Avatar name="Avery Quinn" hue={250} size={30} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>Avery Quinn</div>
            <div className="eyebrow">Owner</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 24px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-.01em' }}>
            {view.label}
          </h1>
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative', width: 'min(260px, 32vw)' }}>
            <Icon.search
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 15,
                height: 15,
                color: 'var(--text-faint)',
              }}
            />
            <input className="ui-input" placeholder="Search…" style={{ paddingLeft: 32 }} />
          </div>
          <IconButton icon={<Icon.bell />} label="Notifications" />
        </header>
        <div style={{ padding: 24, flex: 1, overflow: 'auto' }}>{view.render()}</div>
      </main>

      <ToastHost />
    </div>
  );
}
