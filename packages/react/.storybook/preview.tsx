import type { Preview } from '@storybook/react';
import '@vespera-ui/css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  globalTypes: {
    theme: {
      description: 'Vespera theme',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: ['dark', 'light'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <div
        className="vsp-root"
        data-theme={context.globals.theme ?? 'dark'}
        data-density="comfortable"
        data-corners="round"
        style={{ padding: 28, minWidth: 320 }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
