import 'zone.js';
import type { Preview } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';

const item = (title: string, items: string[]) => ({
  description: title,
  defaultValue: items[0],
  toolbar: { title, items, dynamicTitle: true },
});

const preview: Preview = {
  // Full-bleed so the .vsp-root wrapper paints the themed background edge-to-edge
  // in the docs embed iframe (mirrors the React Storybook setup).
  parameters: { layout: 'fullscreen' },
  globalTypes: {
    theme: { ...item('Theme', ['dark', 'light']), defaultValue: 'dark' },
    density: { ...item('Density', ['comfortable', 'compact', 'spacious']) },
    corners: { ...item('Corners', ['round', 'soft', 'sharp']) },
  },
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div class="vsp-root" [attr.data-theme]="vspTheme" [attr.data-density]="vspDensity" [attr.data-corners]="vspCorners" style="min-height:100vh;box-sizing:border-box;padding:28px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center">${story}</div>`,
      ({ globals }) => ({
        vspTheme: globals['theme'] ?? 'dark',
        vspDensity: globals['density'] ?? 'comfortable',
        vspCorners: globals['corners'] ?? 'round',
      }),
    ),
  ],
};

export default preview;
