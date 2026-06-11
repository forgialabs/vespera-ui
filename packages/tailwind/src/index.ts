/**
 * @vespera-ui/tailwind — a Tailwind CSS preset for the Vespera design system.
 *
 * Pair it with `@vespera-ui/css` (which sets the CSS variables on `.vsp-root`)
 * and your Tailwind utilities inherit Vespera theming for free:
 *
 *   // tailwind.config.js
 *   import vespera from '@vespera-ui/tailwind';
 *   export default { presets: [vespera], content: [...] };
 *
 *   <div class="vsp-root" data-theme="dark">
 *     <div class="bg-surface-1 text-text border border-border rounded-md">…</div>
 *   </div>
 *
 * Semantic colors (`bg`, `surface-*`, `text*`, `accent`, `border*`, status) map
 * to the live CSS variables, so they react to `data-theme` / `data-density` /
 * `data-corners` / inline `--accent`. The fixed named palette (`blue`, `violet`,
 * …) comes straight from `@vespera-ui/tokens`.
 *
 * Note: because the theme-reactive colors are `var(--x)` values, Tailwind's
 * opacity modifiers (e.g. `bg-accent/50`) don't apply to them — use the named
 * palette colors when you need `/opacity`.
 */
import type { Config } from 'tailwindcss';
import { palette } from '@vespera-ui/tokens';

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // theme-reactive — driven by @vespera-ui/css on .vsp-root
        bg: 'var(--bg)',
        'bg-glow': 'var(--bg-glow)',
        surface: {
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        hover: 'var(--hover)',
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        text: {
          DEFAULT: 'var(--text)',
          dim: 'var(--text-dim)',
          faint: 'var(--text-faint)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          2: 'var(--accent-2)',
          ink: 'var(--accent-ink)',
        },
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        // fixed named palette — static, single-sourced from @vespera-ui/tokens
        ...palette,
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        pill: 'var(--r-pill)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      boxShadow: {
        vesp: 'var(--shadow)',
        'vesp-lg': 'var(--shadow-lg)',
      },
    },
  },
};

export default preset;
