'use client';
import { Icon } from '@vespera-ui/icons';
import { AreaChart, Badge, Button, Card, CardHead, Donut, StatCard } from '@vespera-ui/react';

const revenue = [[12, 18, 15, 22, 19, 26, 24, 31, 28, 35, 33, 42]];
const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const traffic = [
  { label: 'Direct', value: 42, color: 'var(--accent)' },
  { label: 'Referral', value: 28, color: 'var(--accent-2)' },
  { label: 'Organic', value: 19, color: 'var(--success)' },
  { label: 'Social', value: 11, color: 'var(--warning)' },
];

/** A live mini-dashboard built from real @vespera-ui/react components — the
 *  landing's "this is what it looks like" showcase. */
export function LandingShowcase() {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
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
          label="Active"
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
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
        <Card>
          <CardHead
            title="Revenue"
            desc="Last 12 months"
            right={
              <Badge tone="pos" dot>
                +18%
              </Badge>
            }
          />
          <div className="card-pad">
            <AreaChart series={revenue} labels={months} height={140} />
          </div>
        </Card>
        <Card>
          <CardHead title="Traffic" />
          <div className="card-pad" style={{ display: 'grid', placeItems: 'center' }}>
            <Donut data={traffic} size={132} />
          </div>
        </Card>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="primary" size="sm" leadingIcon={<Icon.check />}>
          Save
        </Button>
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Badge tone="pos" dot>
          Active
        </Badge>
        <Badge tone="warn" dot>
          Trial
        </Badge>
        <Badge tone="info" dot>
          Beta
        </Badge>
        <span className="mono" style={{ fontSize: 12, color: 'var(--text-faint)', marginLeft: 'auto' }}>
          @vespera-ui/react
        </span>
      </div>
    </div>
  );
}
