import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  args: { tone: 'info', title: 'Heads up', children: 'Your trial ends in 3 days.' },
  argTypes: { tone: { control: 'select', options: ['info', 'pos', 'warn', 'neg'] } },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 360 }}>
      <Alert tone="info" title="Heads up">
        Your trial ends in 3 days.
      </Alert>
      <Alert tone="pos" title="Saved">
        Your changes are live.
      </Alert>
      <Alert tone="warn" title="Usage high">
        You&apos;re near your API limit.
      </Alert>
      <Alert tone="neg" title="Failed">
        Something went wrong.
      </Alert>
    </div>
  ),
};
