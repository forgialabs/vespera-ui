import type { Meta, StoryObj } from '@storybook/angular';
import { VspSelect } from './select.component';

// Title + story name mirror packages/react/src/Select.stories.tsx so ids resolve across frameworks.
const meta: Meta = { title: 'Forms/Select' };
export default meta;

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Grape', 'Kiwi', 'Mango', 'Pear'];

export const ThemedSelect: StoryObj = {
  name: 'Select (auto-search ≥8)',
  render: () => ({
    moduleMetadata: { imports: [VspSelect] },
    props: { fruits: FRUITS },
    template: `<div style="width:320px"><vsp-select [options]="fruits" value="Banana" /></div>`,
  }),
};
