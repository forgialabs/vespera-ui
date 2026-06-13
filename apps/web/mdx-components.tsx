import type { MDXComponents } from 'mdx/types';
import { Preview } from '@/components/Preview';
import { Callout } from '@/components/Callout';
import { Swatch, SwatchGrid } from '@/components/Swatch';
import { Card, CardGrid } from '@/components/DocCard';
import { ReactApi } from '@/components/ReactApi';

// MDX element + custom-component overrides. Prose styling lives in global.css
// (.vsp-doc-prose). These components are available in every MDX file.
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    Preview,
    Callout,
    Swatch,
    SwatchGrid,
    Card,
    CardGrid,
    ReactApi,
    ...components,
  };
}
