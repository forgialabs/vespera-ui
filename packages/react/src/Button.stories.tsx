import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@vespera-ui/icons';
import { Button, IconButton } from './Button';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  args: { children: 'Button', variant: 'primary' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'ghost', 'subtle', 'outline', 'danger'],
    },
    size: { control: 'inline-radio', options: [undefined, 'sm'] },
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { leadingIcon: <Icon.plus />, children: 'Create' },
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving…' },
};

export const IconOnly: Story = {
  render: () => <IconButton icon={<Icon.bell />} label="Notifications" dot />,
};
