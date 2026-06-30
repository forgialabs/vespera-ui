import { describe, it, expect } from 'vitest';
import {
  FRAMEWORKS,
  buildEmbedSrc,
  frameworkAvailability,
  type StoriesManifest,
} from './framework-preview';

const manifest: StoriesManifest = {
  'Primitives/Button': {
    Variants: { react: 'primitives-button--variants', angular: null, svelte: null, vue: null },
  },
};

describe('FRAMEWORKS', () => {
  it('lists the four supported frameworks in display order', () => {
    expect(FRAMEWORKS.map((f) => f.id)).toEqual(['react', 'angular', 'svelte', 'vue']);
  });
});

describe('frameworkAvailability', () => {
  it('reports which frameworks have a story for a title+export', () => {
    const a = frameworkAvailability(manifest, 'Primitives/Button', 'Variants');
    expect(a).toEqual({
      react: 'primitives-button--variants',
      angular: null,
      svelte: null,
      vue: null,
    });
  });

  it('returns all-null when the title or export is unknown', () => {
    expect(frameworkAvailability(manifest, 'Nope/Missing', 'Variants')).toEqual({
      react: null,
      angular: null,
      svelte: null,
      vue: null,
    });
  });
});

describe('buildEmbedSrc', () => {
  it('builds a basePath-aware iframe URL with theme globals', () => {
    const src = buildEmbedSrc('/vespera-ui', 'react', 'primitives-button--variants', {
      theme: 'dark',
      density: 'comfortable',
      corners: 'round',
    });
    expect(src).toBe(
      '/vespera-ui/sb/react/iframe.html?id=primitives-button--variants&viewMode=story&globals=theme:dark;density:comfortable;corners:round',
    );
  });

  it('works with an empty basePath', () => {
    const src = buildEmbedSrc('', 'svelte', 'x--y', {
      theme: 'light',
      density: 'compact',
      corners: 'sharp',
    });
    expect(src).toBe(
      '/sb/svelte/iframe.html?id=x--y&viewMode=story&globals=theme:light;density:compact;corners:sharp',
    );
  });
});
