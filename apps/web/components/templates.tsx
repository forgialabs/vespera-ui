'use client';
import { useState } from 'react';
import { Icon } from '@vespera-ui/icons';
import {
  ApiKeysBlock,
  AreaChart,
  AuditLogBlock,
  Avatar,
  Badge,
  Button,
  Card,
  CardHead,
  Donut,
  KanbanBlock,
  OrdersBlock,
  Segmented,
  StatCard,
  SystemStatusBlock,
  TeamRolesBlock,
  ToastHost,
  type BadgeTone,
} from '@vespera-ui/react';

export function OrdersBlockExample() {
  return <OrdersBlock />;
}
export function KanbanBlockExample() {
  return <KanbanBlock />;
}
export function ApiKeysBlockExample() {
  return (
    <>
      <ApiKeysBlock />
      <ToastHost />
    </>
  );
}
export function AuditLogBlockExample() {
  return <AuditLogBlock />;
}
export function SystemStatusBlockExample() {
  return <SystemStatusBlock />;
}
export function TeamRolesBlockExample() {
  return <TeamRolesBlock />;
}

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

interface Order {
  id: string;
  company: string;
  hue: number;
  item: string;
  state: 'paid' | 'processing' | 'refunded';
  amount: number;
}

const orders: Order[] = [
  { id: 'ORD-4821', company: 'Northwind', hue: 220, item: 'Pro · annual', state: 'paid', amount: 2400 },
  { id: 'ORD-4820', company: 'Halcyon', hue: 150, item: 'Team · monthly', state: 'processing', amount: 320 },
  { id: 'ORD-4819', company: 'Vertex', hue: 280, item: 'Enterprise', state: 'paid', amount: 9800 },
  { id: 'ORD-4818', company: 'Cobalt', hue: 12, item: 'Pro · annual', state: 'refunded', amount: 2400 },
  { id: 'ORD-4817', company: 'Beacon', hue: 95, item: 'Team · annual', state: 'paid', amount: 3120 },
];

const ORDER_TONE: Record<Order['state'], BadgeTone> = {
  paid: 'pos',
  processing: 'info',
  refunded: 'warn',
};

/**
 * A complete admin dashboard composed entirely from `@vespera-ui/react`:
 * a page header with a range switch, KPI stat cards, a revenue area chart,
 * a traffic donut, and a recent-orders table — no bespoke styles.
 */
export function DashboardTemplate() {
  const [range, setRange] = useState('30d');

  return (
    <div style={{ display: 'grid', gap: 18, width: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>
            Overview
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--text-dim)' }}>
            Revenue, traffic and recent activity.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Segmented options={['7d', '30d', '90d']} value={range} onChange={setRange} />
          <Button variant="primary" size="sm" leadingIcon={<Icon.download />}>
            Export
          </Button>
        </div>
      </div>

      {/* KPI stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
        }}
      >
        <StatCard
          icon={<Icon.dollar />}
          label="Revenue"
          value="$48.2k"
          delta="12%"
          deltaDir="up"
          spark={[12, 18, 15, 22, 19, 26, 24, 31]}
        />
        <StatCard
          icon={<Icon.users />}
          label="Active users"
          value="3,914"
          delta="8%"
          deltaDir="up"
          spark={[20, 22, 21, 25, 24, 28, 27, 31]}
          sparkColor="var(--accent-2)"
        />
        <StatCard
          icon={<Icon.cart />}
          label="Orders"
          value="1,284"
          delta="5%"
          deltaDir="up"
          spark={[8, 10, 9, 12, 11, 13, 14, 16]}
          sparkColor="var(--success)"
        />
        <StatCard
          icon={<Icon.pulse />}
          label="Churn"
          value="2.1%"
          delta="0.4%"
          deltaDir="down"
          spark={[5, 4, 5, 3, 4, 3, 3, 2]}
          sparkColor="var(--warning)"
        />
      </div>

      {/* Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: 14,
        }}
      >
        <Card pad>
          <CardHead
            title="Revenue"
            desc="New vs. recurring"
            right={<Badge tone="pos" dot>+12%</Badge>}
          />
          <AreaChart series={revenue} labels={months} dual height={220} />
        </Card>
        <Card pad>
          <CardHead title="Traffic" desc="By source" />
          <div style={{ display: 'grid', placeItems: 'center', paddingTop: 8 }}>
            <Donut data={traffic} />
          </div>
        </Card>
      </div>

      {/* Recent orders */}
      <Card pad>
        <CardHead
          title="Recent orders"
          right={
            <Button variant="subtle" size="sm" trailingIcon={<Icon.chevRight />}>
              View all
            </Button>
          }
        />
        <div style={{ overflowX: 'auto' }}>
          <table className="ui-table" style={{ minWidth: 560 }}>
            <thead>
              <tr>
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
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}