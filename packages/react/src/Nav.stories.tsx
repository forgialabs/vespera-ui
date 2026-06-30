import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Icon } from '@vespera-ui/icons';
import { Breadcrumb, Pagination, Stepper } from './Nav';
import { NavItem, NavGroup } from './SideNav';

const meta = {
  title: 'Primitives/Nav',
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

export const Sidebar: Story = {
  render: () => {
    const [active, setActive] = useState('overview');
    return (
      <div className="ui-nav" style={{ width: 240 }}>
        <NavItem
          icon={<Icon.grid />}
          label="Overview"
          active={active === 'overview'}
          onClick={() => setActive('overview')}
        />
        <NavItem
          icon={<Icon.chart />}
          label="Analytics"
          badge="3"
          active={active === 'analytics'}
          onClick={() => setActive('analytics')}
        />
        <NavGroup icon={<Icon.layers />} label="Workspace" defaultOpen>
          <NavItem
            label="Members"
            sub
            active={active === 'members'}
            onClick={() => setActive('members')}
          />
          <NavItem
            label="Billing"
            sub
            active={active === 'billing'}
            onClick={() => setActive('billing')}
          />
        </NavGroup>
        <NavItem
          icon={<Icon.settings />}
          label="Settings"
          active={active === 'settings'}
          onClick={() => setActive('settings')}
        />
      </div>
    );
  },
};
