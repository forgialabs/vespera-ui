import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Field, Input } from './Field';
import { NumberStepper, InlineEdit, CopyButton, OTPInput } from './FormExtras';

const meta = {
  title: 'Forms/Field',
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Controls: Story = {
  render: () => {
    const [qty, setQty] = useState(3);
    const [name, setName] = useState('Acme Inc.');
    const [otp, setOtp] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
        <NumberStepper value={qty} onChange={setQty} min={0} max={10} />
        <InlineEdit value={name} onSave={setName} />
        <CopyButton text="npm i @vespera-ui/react" label="Copy install" />
        <OTPInput value={otp} onChange={setOtp} length={6} />
      </div>
    );
  },
};

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
