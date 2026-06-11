import type { Meta, StoryObj } from '@storybook/react';
import { Field, Input } from './Field';

const meta = {
  title: 'Forms/Field',
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Field label="Workspace name" hint="This is shown to your team.">
        <Input placeholder="Acme Inc." defaultValue="Vespera" />
      </Field>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Field label="API key" required error="This key is invalid.">
        <Input invalid defaultValue="sk-bad" />
      </Field>
    </div>
  ),
};
