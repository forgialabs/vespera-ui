import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeStoriesIndex } from './merge-stories-index.mjs';

// Shape mirrors Storybook 8 `storybook-static/index.json`.
const reactIndex = {
  v: 5,
  entries: {
    'primitives-button--variants': {
      id: 'primitives-button--variants',
      title: 'Primitives/Button',
      name: 'Variants',
      type: 'story',
    },
    'primitives-button--loading': {
      id: 'primitives-button--loading',
      title: 'Primitives/Button',
      name: 'Loading',
      type: 'story',
    },
    'docs-page--docs': { id: 'docs-page--docs', title: 'Docs/Page', name: 'Docs', type: 'docs' },
  },
};

test('merges one framework index keyed by title → export → framework', () => {
  const manifest = mergeStoriesIndex({ react: reactIndex });
  assert.deepEqual(manifest['Primitives/Button'].Variants, {
    react: 'primitives-button--variants',
    angular: null,
    svelte: null,
    vue: null,
  });
  assert.equal(manifest['Primitives/Button'].Loading.react, 'primitives-button--loading');
});

test('ignores non-story entries (docs)', () => {
  const manifest = mergeStoriesIndex({ react: reactIndex });
  assert.equal(manifest['Docs/Page'], undefined);
});

test('overlays a second framework into the same title/export', () => {
  const svelteIndex = {
    entries: {
      'primitives-button--variants': {
        id: 'primitives-button--variants',
        title: 'Primitives/Button',
        name: 'Variants',
        type: 'story',
      },
    },
  };
  const manifest = mergeStoriesIndex({ react: reactIndex, svelte: svelteIndex });
  assert.equal(manifest['Primitives/Button'].Variants.svelte, 'primitives-button--variants');
  assert.equal(manifest['Primitives/Button'].Variants.angular, null);
});
