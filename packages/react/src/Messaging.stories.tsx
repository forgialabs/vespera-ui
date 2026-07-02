import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@vespera-ui/icons';
import { Banner, EmptyState } from './Banner';
import { Card } from './Card';
import { Button } from './Button';

const meta = {
  title: 'Feedback/Messaging',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BannerEmpty: Story = {
  name: 'Banner & empty',
  render: () => (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 460 }}>
      <Banner tone="accent" action={<Button size="sm">Upgrade</Button>} onDismiss={() => {}}>
        You&apos;re on the free plan — upgrade for more.
      </Banner>
      <Card>
        <EmptyState
          icon={<Icon.inbox />}
          title="No messages"
          desc="When you get messages, they'll show up here."
          action={<Button variant="primary">Compose</Button>}
          compact
        />
      </Card>
    </div>
  ),
};
