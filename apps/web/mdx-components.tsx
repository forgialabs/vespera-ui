import type { MDXComponents } from 'mdx/types';
import { Preview } from '@/components/Preview';

// MDX element + custom-component overrides. Prose styling lives in global.css
// (.vsp-doc-prose). `Preview` lets content embed live, framed demos.
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    Preview,
    ...components,
  };
}
