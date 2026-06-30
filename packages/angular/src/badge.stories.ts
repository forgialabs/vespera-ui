import type { Meta, StoryObj } from '@storybook/angular';
import { VspBadge } from './badge.component';

// Mirrors packages/react/src/Badge.stories.tsx (title + story names) so ids match.
const meta: Meta<VspBadge> = {
  title: 'Primitives/Badge',
  component: VspBadge,
};
export default meta;

type Story = StoryObj<VspBadge>;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [VspBadge] },
    template: `<vsp-badge tone="info">Badge</vsp-badge>`,
  }),
};

export const Tones: Story = {
  render: () => ({
    moduleMetadata: { imports: [VspBadge] },
    template: `
      <vsp-badge tone="pos" [dot]="true">Active</vsp-badge>
      <vsp-badge tone="neg">Error</vsp-badge>
      <vsp-badge tone="warn">Warning</vsp-badge>
      <vsp-badge tone="info">Info</vsp-badge>
      <vsp-badge tone="muted">Muted</vsp-badge>
    `,
  }),
};
