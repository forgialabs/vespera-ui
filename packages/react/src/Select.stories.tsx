import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select, Combobox, MultiSelect, TokenInput, type SelectValue } from './Select';

const meta: Meta = { title: 'Forms/Select' };
export default meta;
type Story = StoryObj;

const fruits = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
  'Honeydew',
  'Kiwi',
];

export const ThemedSelect: Story = {
  name: 'Select (auto-search ≥8)',
  render: () => {
    const [v, setV] = useState<SelectValue>('Banana');
    return (
      <div style={{ width: 280 }}>
        <Select options={fruits} value={v} onChange={setV} />
      </div>
    );
  },
};

export const ComboboxExample: Story = {
  name: 'Combobox',
  render: () => {
    const [v, setV] = useState<SelectValue | null>(null);
    return (
      <div style={{ width: 280 }}>
        <Combobox options={fruits} value={v} onChange={setV} clearable placeholder="Pick a fruit" />
      </div>
    );
  },
};

export const MultiSelectExample: Story = {
  name: 'MultiSelect',
  render: () => {
    const [v, setV] = useState<SelectValue[]>(['Apple', 'Cherry']);
    return (
      <div style={{ width: 280 }}>
        <MultiSelect options={fruits} value={v} onChange={setV} max={4} />
      </div>
    );
  },
};

export const TokenInputExample: Story = {
  name: 'TokenInput',
  render: () => {
    const [v, setV] = useState<string[]>(['design', 'frontend']);
    return (
      <div style={{ width: 280 }}>
        <TokenInput value={v} onChange={setV} />
      </div>
    );
  },
};
