import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@vespera-ui/icons';
import { CircularProgress, DescriptionList, Stat, Timeline } from './DataDisplay';

const meta = {
  title: 'Data display',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Stats: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      <div style={{ width: 220 }}>
        <Stat icon={<Icon.dollar />} label="Revenue" value="$48.2k" delta="12%" deltaDir="up" />
      </div>
      <div style={{ width: 220 }}>
        <Stat icon={<Icon.users />} label="Churn" value="2.1%" delta="0.4%" deltaDir="down" />
      </div>
    </div>
  ),
};

export const Timelines: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Timeline
        items={[
          { title: 'Account created', time: '2 days ago', icon: <Icon.user />, tone: 'pos' },
          { title: 'Upgraded to Pro', time: 'Yesterday', icon: <Icon.arrowUp /> },
          { title: 'Invited 3 members', time: '2 hours ago', icon: <Icon.users /> },
        ]}
      />
    </div>
  ),
};

export const Descriptions: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <DescriptionList
        items={[
          ['Plan', 'Pro · annual'],
          ['Seats', '12 of 20'],
          ['Renews', 'Jun 30, 2026'],
        ]}
      />
    </div>
  ),
};

export const Circular: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20 }}>
      <CircularProgress value={72} label="72%" />
      <CircularProgress value={40} size={72} />
    </div>
  ),
};
