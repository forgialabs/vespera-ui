import { loader } from 'fumadocs-core/source';
import { docs } from '@/.source/server';

// Headless Fumadocs source — gives us the page tree, routing, TOC and search,
// while the entire UI is built with @vespera-ui (dogfooded).
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
