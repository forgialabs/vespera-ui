import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Icon } from '@vespera-ui/icons';
import { Button } from './Button';
import { Dialog } from './Dialog';
import { DropdownMenu } from './Anchored';
import { ToastHost, toast } from './Toast';
import { CommandPalette } from './CommandPalette';

const meta: Meta = { title: 'Overlays' };
export default meta;
type Story = StoryObj;

export const DialogExample: Story = {
  name: 'Dialog',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open dialog
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          tone="neg"
          icon={<Icon.shield />}
          title="Delete workspace?"
          desc="This permanently removes the workspace and all its data."
          footer={
            <>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </>
          }
        />
      </>
    );
  },
};

export const Dropdown: Story = {
  render: () => (
    <DropdownMenu
      trigger={<Button trailingIcon={<Icon.chevDown />}>Menu</Button>}
      items={[
        { heading: true, label: 'Account' },
        { label: 'Profile', icon: <Icon.user /> },
        { label: 'Settings', icon: <Icon.settings />, kbd: '⌘,' },
        { sep: true },
        { label: 'Log out', icon: <Icon.logout />, danger: true },
      ]}
    />
  ),
};

export const Toasts: Story = {
  render: () => (
    <>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          onClick={() => toast({ tone: 'pos', title: 'Saved', body: 'Your changes are live.' })}
        >
          Success
        </Button>
        <Button
          onClick={() => toast({ tone: 'neg', title: 'Failed', body: 'Something went wrong.' })}
        >
          Error
        </Button>
      </div>
      <ToastHost />
    </>
  ),
};

export const Command: Story = {
  name: 'Command palette',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button leadingIcon={<Icon.search />} onClick={() => setOpen(true)}>
          Open ⌘K
        </Button>
        <CommandPalette
          open={open}
          onClose={() => setOpen(false)}
          groups={[
            {
              label: 'Actions',
              items: [
                { label: 'New project', icon: <Icon.plus />, meta: '⌘N' },
                { label: 'Search docs', icon: <Icon.doc />, keywords: 'help find' },
              ],
            },
            {
              label: 'Navigation',
              items: [
                { label: 'Go to dashboard', icon: <Icon.grid /> },
                { label: 'Settings', icon: <Icon.settings /> },
              ],
            },
          ]}
        />
      </>
    );
  },
};
