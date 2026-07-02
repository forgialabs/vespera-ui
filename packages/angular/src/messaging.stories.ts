import type { Meta, StoryObj } from '@storybook/angular';
import { VspBanner, VspEmptyState } from './structure.component';

// Matches the React "Banner & empty state" section (Feedback/Messaging / Banner & empty).
const meta: Meta = { title: 'Feedback/Messaging' };
export default meta;

export const BannerEmpty: StoryObj = {
  name: 'Banner & empty',
  render: () => ({
    moduleMetadata: { imports: [VspBanner, VspEmptyState] },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:100%;max-width:560px">
        <vsp-banner tone="info" [dismissible]="true"
          >Heads up — scheduled maintenance this weekend.</vsp-banner
        >
        <vsp-empty-state title="No results" desc="Try adjusting your filters or search terms." />
      </div>`,
  }),
};
