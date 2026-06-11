import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ApiKeysBlock,
  AuditLogBlock,
  KanbanBlock,
  OrdersBlock,
  SystemStatusBlock,
  TeamRolesBlock,
} from './Blocks';
import { ToastHost } from './Toast';

const meta = {
  title: 'Blocks',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const frame = (node: ReactNode) => <div style={{ width: 'min(840px, 86vw)' }}>{node}</div>;

export const Orders: Story = {
  render: () => frame(<OrdersBlock />),
};

export const OperationsBoard: Story = {
  render: () => frame(<KanbanBlock />),
};

export const ApiKeys: Story = {
  render: () =>
    frame(
      <>
        <ApiKeysBlock />
        <ToastHost />
      </>,
    ),
};

export const AuditLog: Story = {
  render: () => frame(<AuditLogBlock />),
};

export const SystemStatus: Story = {
  render: () => frame(<SystemStatusBlock />),
};

export const TeamRoles: Story = {
  render: () => frame(<TeamRolesBlock />),
};
