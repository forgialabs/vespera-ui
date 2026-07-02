import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';
import { Tree } from './Tree';

const meta = {
  title: 'Layout/Structure',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AccordionTree: Story = {
  name: 'Accordion & tree',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        width: '100%',
        maxWidth: 720,
      }}
    >
      <Accordion
        items={[
          { title: 'What is Vespera?', body: 'A deep-space, weightless design system.' },
          { title: 'Is it themeable?', body: 'Yes — set data-attributes on .vsp-root.' },
        ]}
        defaultOpen={[0]}
      />
      <Tree
        data={[
          {
            label: 'src',
            children: [{ label: 'components' }, { label: 'index.ts', badge: 'ts' }],
          },
          { label: 'package.json' },
        ]}
      />
    </div>
  ),
};
