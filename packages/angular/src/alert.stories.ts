import type { Meta, StoryObj } from '@storybook/angular';
import { VspAlert } from './alert.component';

// Mirrors packages/react/src/Alert.stories.tsx (title + story names) so ids match.
const meta: Meta<VspAlert> = {
  title: 'Feedback/Alert',
  component: VspAlert,
};
export default meta;

type Story = StoryObj<VspAlert>;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [VspAlert] },
    template: `<vsp-alert tone="info" title="Heads up">This is an informational alert.</vsp-alert>`,
  }),
};

export const Tones: Story = {
  render: () => ({
    moduleMetadata: { imports: [VspAlert] },
    template: `
      <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:520px">
        <vsp-alert tone="info" title="Info">Informational message.</vsp-alert>
        <vsp-alert tone="pos" title="Success">Everything worked.</vsp-alert>
        <vsp-alert tone="warn" title="Warning">Be careful here.</vsp-alert>
        <vsp-alert tone="neg" title="Error">Something went wrong.</vsp-alert>
      </div>
    `,
  }),
};
