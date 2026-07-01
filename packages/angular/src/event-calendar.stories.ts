import type { Meta, StoryObj } from '@storybook/angular';
import { VspEventCalendar } from './event-calendar.component';

// Title + story name mirror packages/react/src/EventCalendar.stories.tsx.
const meta: Meta = { title: 'Date/EventCalendar' };
export default meta;

export const Default: StoryObj = {
  name: 'Default',
  render: () => ({
    moduleMetadata: { imports: [VspEventCalendar] },
    template: `<div style="width:100%"><vsp-event-calendar /></div>`,
  }),
};
