import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  args: { children: 'Active', tone: 'pos', dot: true },
  argTypes: {
    tone: { control: 'select', options: ['pos', 'neg', 'warn', 'info', 'muted'] },
    dot: { control: 'boolean' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge tone="pos" dot>
        Active
      </Badge>
      <Badge tone="neg" dot>
        Failed
      </Badge>
      <Badge tone="warn" dot>
        Pending
      </Badge>
      <Badge tone="info" dot>
        Beta
      </Badge>
      <Badge tone="muted">Draft</Badge>
    </div>
  ),
};
