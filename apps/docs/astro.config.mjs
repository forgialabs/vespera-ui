import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

// Project site hosted at https://forgialabs.github.io/vespera-ui/
export default defineConfig({
  site: 'https://forgialabs.github.io',
  base: '/vespera-ui',
  vite: {
    // Force-bundle postcss/nanoid into the SSR build so Vite resolves
    // postcss's `require('nanoid/non-secure')` via CommonJS interop instead of
    // emitting a broken `default` import (nanoid/non-secure is ESM, named-only).
    ssr: {
      noExternal: ['postcss', 'nanoid'],
    },
    resolve: {
      alias: {
        '@manifest': fileURLToPath(new URL('../../manifest', import.meta.url)),
      },
    },
  },
  integrations: [
    react(),
    starlight({
      title: 'Vespera',
      description: 'A deep-space, weightless design system.',
      logo: { src: './src/assets/vespera-mark.svg' },
      customCss: ['./src/styles/vespera.css'],
      social: { github: 'https://github.com/forgialabs/vespera-ui' },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Introduction', link: '/' },
            { label: 'Installation', link: '/guides/installation/' },
            { label: 'Quick start', link: '/guides/quick-start/' },
            { label: 'Concepts', link: '/guides/concepts/' },
          ],
        },
        {
          label: 'Foundations',
          items: [
            { label: 'Color', link: '/foundations/color/' },
            { label: 'Surfaces & background', link: '/foundations/surfaces/' },
            { label: 'Elevation & shadows', link: '/foundations/elevation/' },
            { label: 'Spacing & density', link: '/foundations/spacing/' },
            { label: 'Layout & grids', link: '/foundations/layout/' },
            { label: 'Typography', link: '/foundations/typography/' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Theming', link: '/guides/theming/' },
            { label: 'Frameworks', link: '/guides/frameworks/' },
            { label: 'Accessibility', link: '/guides/accessibility/' },
            { label: 'Recipes', link: '/guides/recipes/' },
            { label: 'CLI', link: '/guides/cli/' },
          ],
        },
        {
          label: 'Components',
          items: [
            { label: 'Overview', link: '/components/overview/' },
            { label: 'Actions', link: '/components/actions/' },
            { label: 'Forms & inputs', link: '/components/forms/' },
            { label: 'Date & time', link: '/components/dates/' },
            { label: 'Data display', link: '/components/data-display/' },
            { label: 'Charts', link: '/components/charts/' },
            { label: 'Navigation', link: '/components/navigation/' },
            { label: 'Feedback & status', link: '/components/feedback/' },
            { label: 'Overlays', link: '/components/overlays/' },
            { label: 'Layout & structure', link: '/components/layout/' },
          ],
        },
        {
          label: 'Explore',
          items: [
            { label: 'Examples & templates', link: '/examples/' },
            {
              label: 'Interactive playground',
              link: '/demo',
              attrs: { target: '_blank', rel: 'noopener' },
              badge: { text: '↗', variant: 'note' },
            },
            {
              label: 'Admin console',
              link: '/admin',
              attrs: { target: '_blank', rel: 'noopener' },
              badge: { text: '↗', variant: 'note' },
            },
          ],
        },
        {
          label: 'API reference',
          items: [
            { label: 'Overview', link: '/reference/react/' },
            { label: 'Actions', link: '/reference/actions/' },
            { label: 'Forms & inputs', link: '/reference/forms/' },
            { label: 'Date & time', link: '/reference/dates/' },
            { label: 'Data display', link: '/reference/data-display/' },
            { label: 'Charts', link: '/reference/charts/' },
            { label: 'Navigation', link: '/reference/navigation/' },
            { label: 'Feedback & status', link: '/reference/feedback/' },
            { label: 'Overlays', link: '/reference/overlays/' },
            { label: 'Layout & structure', link: '/reference/layout/' },
            { label: 'Blocks', link: '/reference/blocks/' },
          ],
        },
        {
          label: 'More',
          items: [{ label: 'Changelog', link: '/guides/changelog/' }],
        },
      ],
    }),
  ],
});
