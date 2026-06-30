import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import type { Preview } from '@storybook/react';
import '@vespera-ui/css';

const item = (title: string, items: string[]) => ({
  description: title,
  defaultValue: items[0],
  toolbar: { title, items, dynamicTitle: true },
});

// Accent is applied inline via the `--accent` CSS variable (not a data-* attribute);
// see packages/css/src/tokens.css. Map friendly names → colors.
const ACCENTS: Record<string, string | undefined> = {
  default: undefined,
  violet: '#b16cff',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
};

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  globalTypes: {
    theme: { ...item('Theme', ['dark', 'light']), defaultValue: 'dark' },
    density: { ...item('Density', ['comfortable', 'compact', 'spacious']) },
    corners: { ...item('Corners', ['round', 'soft', 'sharp']) },
    accent: { ...item('Accent', ['default', 'violet', 'emerald', 'amber', 'rose']) },
  },
  decorators: [
    (Story, context) => {
      // Report canvas height to the docs parent so the embedding iframe auto-sizes.
      // Mirrors apps/web EmbedFrame's `vsp:frame-h` protocol. No-op outside an iframe.
      useEffect(() => {
        if (typeof window === 'undefined' || window.parent === window) return;
        const report = () => {
          const h = Math.ceil(document.documentElement.getBoundingClientRect().height);
          window.parent.postMessage({ vsp: 'frame-h', h }, '*');
        };
        report();
        const ro = new ResizeObserver(report);
        ro.observe(document.documentElement);
        return () => ro.disconnect();
      }, []);

      const accentColor = ACCENTS[context.globals.accent ?? 'default'];
      const style: CSSProperties = { padding: 28, minWidth: 320 };
      if (accentColor) (style as Record<string, string>)['--accent'] = accentColor;
      return (
        <div
          className="vsp-root"
          data-theme={context.globals.theme ?? 'dark'}
          data-density={context.globals.density ?? 'comfortable'}
          data-corners={context.globals.corners ?? 'round'}
          style={style}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
