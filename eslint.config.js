import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/storybook-static/**',
      'prototype/**',
      'apps/web/**',
      '**/scripts/**',
      '_preview-server.cjs',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Browser globals for plain-JS sources (e.g. the Svelte portal action).
    // (TS files don't need this — typescript-eslint resolves DOM lib types.)
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Svelte 5 rune macros are compiler keywords, not runtime imports, in
    // `.svelte.js` module-state files (e.g. the shared toast store).
    files: ['**/*.svelte.js'],
    languageOptions: {
      globals: {
        $state: 'readonly',
        $derived: 'readonly',
        $effect: 'readonly',
        $props: 'readonly',
        $bindable: 'readonly',
        $inspect: 'readonly',
      },
    },
  },
);
