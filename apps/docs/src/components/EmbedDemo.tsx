import { DEMOS } from './registry';

/**
 * Renders a registry demo by name. A single statically-imported React island
 * (so Astro can hydrate it) that does the name → component switch at runtime —
 * the dynamic indexing happens inside React, not in the Astro template.
 */
export default function EmbedDemo({ name }: { name: string }) {
  const entry = DEMOS[name];
  if (!entry) return null;
  const Comp = entry.Comp;
  return <Comp />;
}
