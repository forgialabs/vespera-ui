/**
 * @vespera-ui/tokens — the design tokens behind `@vespera-ui/css`, as data.
 *
 * These mirror the CSS custom properties defined on `.vsp-root` in
 * `@vespera-ui/css` (tokens.css). Use them to drive a Tailwind preset
 * (`@vespera-ui/tailwind`), Style Dictionary, Figma sync, or any tool that
 * needs the raw values. `@vespera-ui/css` remains the runtime source of truth;
 * this package is the same values in a portable shape.
 */

export const fonts = {
  sans: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
} as const;

/** Fixed named palette — Accent and Accent-2 are chosen from these. */
export const palette = {
  blue: '#4a7cff',
  cyan: '#16b6c9',
  indigo: '#8b6cff',
  violet: '#b16cff',
  emerald: '#1fb574',
  coral: '#ff7a6b',
  amber: '#f5a524',
  magenta: '#e75cff',
} as const;

/** Default accent (overridable inline via `--accent`). */
export const accent = {
  base: '#4a7cff',
  alt: '#b16cff',
  ink: '#ffffff',
} as const;

/** Corner radii in px, per `data-corners` style (`pill` is constant). */
export const radius = {
  default: { sm: 8, md: 12, lg: 16, pill: 999 },
  round: { sm: 10, md: 14, lg: 20, pill: 999 },
  soft: { sm: 6, md: 9, lg: 12, pill: 999 },
  sharp: { sm: 2, md: 3, lg: 4, pill: 999 },
} as const;

/** Spacing / sizing in px, per `data-density` scale. */
export const density = {
  compact: { pad: 13, gap: 10, rowH: 40, rowPy: 6, ctrlH: 34, fsBase: 13 },
  comfortable: { pad: 22, gap: 18, rowH: 52, rowPy: 11, ctrlH: 40, fsBase: 14 },
  spacious: { pad: 34, gap: 28, rowH: 64, rowPy: 18, ctrlH: 48, fsBase: 15 },
} as const;

export interface ThemeColors {
  bg: string;
  bgGlow: string;
  surface1: string;
  surface2: string;
  surface3: string;
  hover: string;
  border: string;
  borderStrong: string;
  text: string;
  textDim: string;
  textFaint: string;
  gridLine: string;
  success: string;
  danger: string;
  warning: string;
  glass: string;
  shadow: string;
  shadowLg: string;
}

/** Semantic colors per `data-theme`. */
export const themes: { dark: ThemeColors; light: ThemeColors } = {
  dark: {
    bg: '#080b14',
    bgGlow: '#0e1626',
    surface1: '#0e131f',
    surface2: '#141a28',
    surface3: '#1a2233',
    hover: 'rgba(255, 255, 255, 0.04)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(255, 255, 255, 0.14)',
    text: '#e8ecf4',
    textDim: '#97a1b6',
    textFaint: '#5d6479',
    gridLine: 'rgba(255, 255, 255, 0.045)',
    success: '#34d399',
    danger: '#fb7185',
    warning: '#fbbf24',
    glass: 'rgba(14, 19, 31, 0.72)',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 28px rgba(0, 0, 0, 0.35)',
    shadowLg: '0 20px 60px rgba(0, 0, 0, 0.55)',
  },
  light: {
    bg: '#f4f6fb',
    bgGlow: '#e9eef9',
    surface1: '#ffffff',
    surface2: '#ffffff',
    surface3: '#f3f5fa',
    hover: 'rgba(10, 20, 50, 0.035)',
    border: 'rgba(13, 18, 32, 0.09)',
    borderStrong: 'rgba(13, 18, 32, 0.16)',
    text: '#0d1424',
    textDim: '#5a637a',
    textFaint: '#9aa2b5',
    gridLine: 'rgba(13, 18, 32, 0.06)',
    success: '#0ea371',
    danger: '#e5484d',
    warning: '#d98a00',
    glass: 'rgba(255, 255, 255, 0.72)',
    shadow: '0 1px 2px rgba(20, 30, 60, 0.06), 0 8px 24px rgba(20, 30, 60, 0.07)',
    shadowLg: '0 24px 60px rgba(20, 30, 60, 0.14)',
  },
};

/** Every token group in one object (also the default export, and `tokens.json`). */
export const tokens = { fonts, palette, accent, radius, density, themes } as const;

export default tokens;
