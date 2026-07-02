import type { Meta, StoryObj } from '@storybook/angular';
import { VspCheckbox, VspSwitch } from './toggle.component';
import { VspSlider, VspRadioGroup } from './forms.component';

// Title + story names mirror packages/react/src/Toggle.stories.tsx.
const meta: Meta = { title: 'Primitives/Toggle' };
export default meta;

export const Checkboxes: StoryObj = {
  name: 'Checkboxes',
  render: () => ({
    moduleMetadata: { imports: [VspCheckbox] },
    template: `
      <div style="display:flex;flex-direction:column;gap:10px">
        <vsp-checkbox [checked]="true" label="Email notifications" sub="Activity updates" />
        <vsp-checkbox label="SMS alerts" />
        <vsp-checkbox [indeterminate]="true" label="Partial selection" />
      </div>`,
  }),
};

export const Switches: StoryObj = {
  name: 'Switches',
  render: () => ({
    moduleMetadata: { imports: [VspSwitch] },
    template: `<vsp-switch [checked]="true" /> <vsp-switch /> <vsp-switch [checked]="true" size="sm" />`,
  }),
};

export const Sliders: StoryObj = {
  name: 'Sliders',
  render: () => ({
    moduleMetadata: { imports: [VspSlider] },
    template: `<div style="width:280px"><vsp-slider [value]="40" /></div>`,
  }),
};

export const Radios: StoryObj = {
  name: 'Radios',
  render: () => ({
    moduleMetadata: { imports: [VspRadioGroup] },
    props: {
      opts: [
        { value: 'a', label: 'Comfortable' },
        { value: 'b', label: 'Compact' },
      ],
    },
    template: `<vsp-radio-group [options]="opts" value="a" />`,
  }),
};
