// URL slugs for the component categories (the taxonomy lives in the manifest /
// scripts/build-manifest.mjs). Shared by the per-category Components and Reference
// pages and their overviews.
export const CATEGORY_SLUGS: Record<string, string> = {
  Actions: 'actions',
  'Forms & inputs': 'forms',
  'Date & time': 'dates',
  'Data display': 'data-display',
  Charts: 'charts',
  Navigation: 'navigation',
  'Feedback & status': 'feedback',
  Overlays: 'overlays',
  'Layout & structure': 'layout',
  Blocks: 'blocks',
};

/** One-line description per category, shown on the overview pages. */
export const CATEGORY_BLURB: Record<string, string> = {
  Actions: 'Buttons and icon buttons.',
  'Forms & inputs': 'Fields, selects, toggles, and every text/number control.',
  'Date & time': 'Calendars, date pickers, and the event calendar.',
  'Data display': 'Badges, avatars, stats, timelines, and tags.',
  Charts: 'Area, bar, donut, and sparkline charts.',
  Navigation: 'Tabs, breadcrumbs, pagination, steppers, and nav items.',
  'Feedback & status': 'Alerts, banners, progress, spinners, and empty states.',
  Overlays: 'Dialogs, sheets, popovers, menus, tooltips, and the command palette.',
  'Layout & structure': 'Cards, blocks, dividers, accordions, and trees.',
  Blocks: 'Composed, ready-to-use sections (orders, kanban, API keys…).',
};

export const slugOf = (label: string): string =>
  CATEGORY_SLUGS[label] ?? label.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
