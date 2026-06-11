// Compile every component with the Svelte compiler to verify it's valid.
import { compile } from 'svelte/compiler';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const srcDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const files = readdirSync(srcDir).filter((f) => f.endsWith('.svelte'));

let failed = 0;
for (const f of files) {
  const code = readFileSync(join(srcDir, f), 'utf8');
  try {
    const { warnings } = compile(code, { filename: f, generate: 'client' });
    const note = warnings.length ? ` (${warnings.length} warning(s))` : '';
    console.log(`✓ ${f}${note}`);
  } catch (e) {
    console.error(`✗ ${f}: ${e.message}`);
    failed++;
  }
}

if (failed) {
  console.error(`\n${failed} component(s) failed to compile.`);
  process.exit(1);
}
console.log(`\n${files.length} components compiled cleanly.`);
