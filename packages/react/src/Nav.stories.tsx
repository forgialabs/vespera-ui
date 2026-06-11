import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Breadcrumb, Pagination, Stepper } from './Nav';

const meta = {
  title: 'Primitives/Nav',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Breadcrumbs: Story = {
  render: () => <Breadcrumb items={['Home', 'Projects', 'Vespera']} />,
};

export const Paginate: Story = {
  render: () => {
    const [page, setPage] = useState(2);
    return <Pagination page={page} pages={8} onPage={setPage} />;
  },
};

export const Steps: Story = {
  render: () => <Stepper steps={['Account', 'Profile', 'Billing', 'Done']} current={1} />,
};
