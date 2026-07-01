import type { Meta, StoryObj } from '@storybook/angular';
import { VspDatePicker, VspDateRangePicker } from './date-picker.component';

// Title + story names mirror packages/react/src/DatePicker.stories.tsx.
const meta: Meta = { title: 'Date/DatePicker' };
export default meta;

export const SingleDate: StoryObj = {
  name: 'Single Date',
  render: () => ({
    moduleMetadata: { imports: [VspDatePicker] },
    template: `<vsp-date-picker placeholder="Pick a date" />`,
  }),
};

export const Range: StoryObj = {
  name: 'Range',
  render: () => ({
    moduleMetadata: { imports: [VspDateRangePicker] },
    template: `<vsp-date-range-picker placeholder="Pick a range" />`,
  }),
};
