import type { Meta, StoryObj } from '@storybook/angular';
import { VspSystemStatusBlock, VspAuditLogBlock } from './blocks.component';
import { VspOrdersBlock, VspTeamRolesBlock, VspApiKeysBlock } from './blocks2.component';
import { VspKanbanBlock } from './kanban.component';

// Title + story names mirror packages/react/src/Blocks.stories.tsx. Every block ships default
// data, so each renders standalone.
const meta: Meta = { title: 'Blocks' };
export default meta;

const wide = (tag: string) => `<div style="width:100%;max-width:960px">${tag}</div>`;

export const Orders: StoryObj = {
  name: 'Orders',
  render: () => ({
    moduleMetadata: { imports: [VspOrdersBlock] },
    template: wide(`<vsp-orders-block />`),
  }),
};

export const OperationsBoard: StoryObj = {
  name: 'Operations Board',
  render: () => ({
    moduleMetadata: { imports: [VspKanbanBlock] },
    template: wide(`<vsp-kanban-block />`),
  }),
};

export const ApiKeys: StoryObj = {
  name: 'Api Keys',
  render: () => ({
    moduleMetadata: { imports: [VspApiKeysBlock] },
    template: wide(`<vsp-api-keys-block />`),
  }),
};

export const AuditLog: StoryObj = {
  name: 'Audit Log',
  render: () => ({
    moduleMetadata: { imports: [VspAuditLogBlock] },
    template: wide(`<vsp-audit-log-block />`),
  }),
};

export const SystemStatus: StoryObj = {
  name: 'System Status',
  render: () => ({
    moduleMetadata: { imports: [VspSystemStatusBlock] },
    template: wide(`<vsp-system-status-block />`),
  }),
};

export const TeamRoles: StoryObj = {
  name: 'Team Roles',
  render: () => ({
    moduleMetadata: { imports: [VspTeamRolesBlock] },
    template: wide(`<vsp-team-roles-block />`),
  }),
};
