// Emit dist/tokens.json from the built module, so the TS source stays the
// single source of truth and non-JS tooling (Style Dictionary, Figma, etc.)
// can consume the same values.
import { writeFileSync } from 'node:fs';
import tokens from '../dist/index.js';

const out = new URL('../dist/tokens.json', import.meta.url);
writeFileSync(out, JSON.stringify(tokens, null, 2) + '\n');
console.log('Wrote dist/tokens.json');
