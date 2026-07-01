// Read each framework's built Storybook index.json and write manifest/stories.json.
// Run AFTER `storybook build` per framework. Frameworks with no build are simply absent.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeStoriesIndex } from './lib/merge-stories-index.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Where each framework's `storybook build` emits its static site + index.json.
const SB_DIRS = {
  react: 'packages/react/storybook-static',
  angular: 'packages/angular/storybook-static',
  // Svelte/Vue are excluded from the selector — see memory: svelte-vue-storybook-vite-conflict.
};

const indexes = {};
for (const [framework, dir] of Object.entries(SB_DIRS)) {
  const indexPath = join(root, dir, 'index.json');
  if (existsSync(indexPath)) {
    indexes[framework] = JSON.parse(readFileSync(indexPath, 'utf8'));
    console.log(`[stories-manifest] read ${framework}: ${indexPath}`);
  } else {
    console.log(`[stories-manifest] skip ${framework}: no build at ${indexPath}`);
  }
}

if (Object.keys(indexes).length === 0) {
  console.log(
    '[stories-manifest] no Storybook builds found — leaving manifest/stories.json untouched',
  );
  process.exit(0);
}

const manifest = mergeStoriesIndex(indexes);
const outDir = join(root, 'manifest');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'stories.json');
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`[stories-manifest] wrote ${outPath} (${Object.keys(manifest).length} titles)`);
