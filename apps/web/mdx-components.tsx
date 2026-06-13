import type { MDXComponents } from 'mdx/types';

// MDX element overrides. The prose styling lives in global.css (.vsp-doc-prose);
// richer overrides (callouts, Preview, tabs) get added as the migration proceeds.
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return { ...components };
}
