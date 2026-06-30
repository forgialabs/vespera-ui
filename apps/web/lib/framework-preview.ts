/** Supported framework wrappers, in selector display order. */
export const FRAMEWORKS = [
  { id: 'react', label: 'React' },
  { id: 'angular', label: 'Angular' },
  { id: 'svelte', label: 'Svelte' },
  { id: 'vue', label: 'Vue' },
] as const;

export type FrameworkId = (typeof FRAMEWORKS)[number]['id'];

/** Per-export, per-framework Storybook story id (or null when that framework lacks it). */
export type StoryAvailability = Record<FrameworkId, string | null>;

/** title → exportName → availability. Generated into manifest/stories.json. */
export type StoriesManifest = Record<string, Record<string, StoryAvailability>>;

export interface ThemeState {
  theme: 'dark' | 'light';
  density: 'comfortable' | 'compact';
  corners: 'round' | 'sharp';
}

const EMPTY: StoryAvailability = { react: null, angular: null, svelte: null, vue: null };

export function frameworkAvailability(
  manifest: StoriesManifest,
  title: string,
  exportName: string,
): StoryAvailability {
  return manifest[title]?.[exportName] ?? { ...EMPTY };
}

export function buildEmbedSrc(
  basePath: string,
  framework: FrameworkId,
  storyId: string,
  theme: ThemeState,
): string {
  const globals = `theme:${theme.theme};density:${theme.density};corners:${theme.corners}`;
  return `${basePath}/sb/${framework}/iframe.html?id=${storyId}&viewMode=story&globals=${globals}`;
}
