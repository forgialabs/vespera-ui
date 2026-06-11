import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox, RadioGroup, Switch, Slider } from './Toggle';

const meta = {
  title: 'Primitives/Toggle',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkboxes: Story = {
  render: () => {
    const [a, setA] = useState(true);
    const [b, setB] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Checkbox checked={a} onChange={setA} label="Email notifications" sub="Weekly digest" />
        <Checkbox checked={b} onChange={setB} label="Marketing emails" />
        <Checkbox checked disabled label="Locked option" />
      </div>
    );
  },
};

export const Radios: Story = {
  render: () => {
    const [plan, setPlan] = useState('pro');
    return (
      <RadioGroup
        value={plan}
        onChange={setPlan}
        options={[
          { value: 'free', label: 'Free' },
          { value: 'pro', label: 'Pro' },
          { value: 'team', label: 'Team' },
        ]}
      />
    );
  },
};

export const Switches: Story = {
  render: () => {
    const [on, setOn] = useState(true);
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Switch checked={on} onChange={setOn} />
        <Switch checked={!on} onChange={(v) => setOn(!v)} size="sm" />
        <Switch checked disabled />
      </div>
    );
  },
};

export const Sliders: Story = {
  render: () => {
    const [v, setV] = useState(40);
    return (
      <div style={{ width: 280 }}>
        <Slider value={v} onChange={setV} />
      </div>
    );
  },
};
