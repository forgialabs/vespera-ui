import type { Meta, StoryObj } from '@storybook/angular';
import { VspAccordion } from './structure.component';
import { VspTree } from './tree.component';

// Matches the React "Accordion & tree" section (Layout/Structure / Accordion & tree).
const meta: Meta = { title: 'Layout/Structure' };
export default meta;

export const AccordionTree: StoryObj = {
  name: 'Accordion & tree',
  render: () => ({
    moduleMetadata: { imports: [VspAccordion, VspTree] },
    props: {
      items: [
        { title: 'What is Vespera?', body: 'A deep-space design system driven by CSS tokens.' },
        { title: 'Is it themeable?', body: 'Yes — set data-attributes on .vsp-root.' },
      ],
      tree: [
        { id: 'src', label: 'src', children: [{ label: 'components' }, { label: 'index.ts' }] },
        { label: 'package.json' },
      ],
    },
    template: `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;width:100%;max-width:720px">
        <vsp-accordion [items]="items" [defaultOpen]="[0]" />
        <vsp-tree [data]="tree" [defaultExpanded]="['src']" />
      </div>`,
  }),
};
