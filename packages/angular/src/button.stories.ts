import type { Meta, StoryObj } from '@storybook/angular';
import { VspButton } from './button.component';

// Title + story names mirror the React package (packages/react/src/Button.stories.tsx)
// so the Storybook story ids match across frameworks — that's what lets the docs'
// FrameworkPreview resolve the same component in each framework's Storybook.
const meta: Meta<VspButton> = {
  title: 'Primitives/Button',
  component: VspButton,
};
export default meta;

type Story = StoryObj<VspButton>;

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: [VspButton] },
    template: `
      <vsp-button variant="primary">Primary</vsp-button>
      <vsp-button variant="ghost">Ghost</vsp-button>
      <vsp-button variant="outline">Outline</vsp-button>
      <vsp-button variant="subtle">Subtle</vsp-button>
      <vsp-button variant="danger">Danger</vsp-button>
    `,
  }),
};
