import type { Meta, StoryObj } from '@storybook/react';
import { EventCalendar } from './EventCalendar';
import { ToastHost } from './Toast';

const meta = {
  title: 'Date/EventCalendar',
  component: EventCalendar,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EventCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 'min(860px, 88vw)' }}>
      <EventCalendar />
      <ToastHost />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div style={{ width: 'min(860px, 88vw)' }}>
      <EventCalendar initialEvents={[]} />
      <ToastHost />
    </div>
  ),
};
