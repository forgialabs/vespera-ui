import type { MDXComponents } from 'mdx/types';
import { Preview } from '@/components/Preview';
import { FrameworkPreview } from '@/components/FrameworkPreview';
import { Callout } from '@/components/Callout';
import { Swatch, SwatchGrid } from '@/components/Swatch';
import { Card, CardGrid } from '@/components/DocCard';
import { ReactApi } from '@/components/ReactApi';
import { Install } from '@/components/Install';
import { MdxLink } from '@/components/MdxLink';

// MDX element + custom-component overrides. Prose styling lives in global.css
// (.vsp-doc-prose). These components are available in every MDX file.
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    a: MdxLink,
    Preview,
    FrameworkPreview,
    Callout,
    Swatch,
    SwatchGrid,
    Card,
    CardGrid,
    ReactApi,
    Install,
    ...components,
  };
}
