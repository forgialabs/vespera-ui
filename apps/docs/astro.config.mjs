import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Project site hosted at https://forgialabs.github.io/vespera-ui/
export default defineConfig({
  site: 'https://forgialabs.github.io',
  base: '/vespera-ui',
  // Force-bundle postcss/nanoid into the SSR build so Vite resolves
  // postcss's `require('nanoid/non-secure')` via CommonJS interop instead of
  // emitting a broken `default` import (nanoid/non-secure is ESM, named-only).
  vite: {
    ssr: {
      noExternal: ['postcss', 'nanoid'],
    },
  },
  integrations: [
    starlight({
      title: 'Vespera',
      description: 'A deep-space, weightless design system.',
      social: { github: 'https://github.com/forgialabs/vespera-ui' },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Introduction', link: '/' },
            { label: 'Installation', link: '/guides/installation/' },
            { label: 'Quick start', link: '/guides/quick-start/' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Theming', link: '/guides/theming/' },
            { label: 'Components', link: '/guides/components/' },
          ],
        },
      ],
    }),
  ],
});
