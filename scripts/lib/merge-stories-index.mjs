// Pure merge of per-framework Storybook index.json files into the availability manifest.
// Input: { [framework]: storybookIndexJson }. Output: { title: { exportName: { fw: id|null } } }.
// Svelte/Vue are intentionally excluded from the selector (Storybook renderer can't build
// under pnpm-strict here). See memory: svelte-vue-storybook-vite-conflict.
const FRAMEWORKS = ['react', 'angular'];

function emptyAvailability() {
  return Object.fromEntries(FRAMEWORKS.map((f) => [f, null]));
}

export function mergeStoriesIndex(indexesByFramework) {
  const manifest = {};
  for (const [framework, index] of Object.entries(indexesByFramework)) {
    if (!index || !index.entries) continue;
    for (const entry of Object.values(index.entries)) {
      if (entry.type && entry.type !== 'story') continue; // skip docs/other
      const { title, name, id } = entry;
      if (!title || !name) continue;
      manifest[title] ??= {};
      manifest[title][name] ??= emptyAvailability();
      manifest[title][name][framework] = id;
    }
  }
  return manifest;
}
