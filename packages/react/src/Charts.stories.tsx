import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@vespera-ui/icons';
import { AreaChart, BarChart, Donut, Sparkline, StatCard } from './Charts';

const revenue = [12, 18, 15, 22, 19, 26, 24, 31, 28, 35, 33, 42];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const meta = {
  title: 'Charts',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sparklines: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Sparkline data={revenue} />
      <Sparkline data={[...revenue].reverse()} color="var(--success)" />
      <Sparkline data={[5, 4, 6, 3, 5, 2, 4, 2]} color="var(--danger)" />
    </div>
  ),
};

export const Area: Story = {
  render: () => (
    <div style={{ width: 'min(620px, 86vw)' }}>
      <AreaChart series={[revenue, revenue.map((v) => v * 0.6)]} labels={months} dual />
    </div>
  ),
};

export const Bars: Story = {
  render: () => (
    <div style={{ width: 'min(620px, 86vw)' }}>
      <BarChart data={revenue} labels={months} />
    </div>
  ),
};

export const DonutChart: Story = {
  render: () => (
    <Donut
      data={[
        { label: 'Direct', value: 42, color: 'var(--accent)' },
        { label: 'Referral', value: 28, color: 'var(--accent-2)' },
        { label: 'Organic', value: 19, color: 'var(--success)' },
        { label: 'Social', value: 11, color: 'var(--warning)' },
      ]}
    />
  ),
};

export const Stat: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <StatCard
        icon={<Icon.dollar />}
        label="Revenue"
        value="$48.2k"
        delta="12%"
        deltaDir="up"
        spark={revenue}
      />
    </div>
  ),
};
