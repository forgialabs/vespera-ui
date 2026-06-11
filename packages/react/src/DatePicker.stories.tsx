import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker, DateRangePicker, type DateRange } from './DatePicker';
import { Field } from './Field';

const meta = {
  title: 'Date/DatePicker',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ width: 280 }}>
        <Field label="Date">
          <DatePicker value={date} onChange={setDate} />
        </Field>
      </div>
    );
  },
};

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({ start: null, end: null });
    return (
      <div style={{ width: 300 }}>
        <Field label="Period">
          <DateRangePicker value={range} onChange={setRange} />
        </Field>
      </div>
    );
  },
};
