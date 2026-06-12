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
          label: 'Explore',
          items: [
            { label: 'Components', link: '/guides/components/' },
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
          label: 'Reference',
          items: [
            { label: 'React components API', link: '/reference/react/' },
            { label: 'Changelog', link: '/guides/changelog/' },
          ],
        },
      ],
    }),
  ],
});
