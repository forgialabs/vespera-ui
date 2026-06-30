// Build each framework's Storybook, copy it into the docs site, and regenerate
// manifest/stories.json. Phase 0 builds React only; add frameworks here as phases land.
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });

// Enabled frameworks for the current phase. Add 'svelte','vue' as they ship.
// `build` is the pnpm sub-command that emits <dir>/storybook-static. React uses the
// Storybook CLI directly; Angular goes through the Angular CLI (@storybook/angular builder).
const FRAMEWORKS = [
  {
    id: 'react',
    pkg: '@vespera-ui/react',
    dir: 'packages/react',
    build: 'exec storybook build -o storybook-static',
  },
  {
    id: 'angular',
    pkg: '@vespera-ui/angular',
    dir: 'packages/angular',
    build: 'run build-storybook',
  },
];

const publicSb = join(root, 'apps/web/public/sb');
rmSync(publicSb, { recursive: true, force: true });
mkdirSync(publicSb, { recursive: true });

for (const fw of FRAMEWORKS) {
  console.log(`\n[embeds] building Storybook for ${fw.id}…`);
  run(`pnpm --filter ${fw.pkg} ${fw.build}`);
  const out = join(root, fw.dir, 'storybook-static');
  if (!existsSync(out)) throw new Error(`expected ${out} after build`);
  cpSync(out, join(publicSb, fw.id), { recursive: true });
  console.log(`[embeds] copied ${fw.id} → apps/web/public/sb/${fw.id}`);
}

console.log('\n[embeds] regenerating stories manifest…');
run('node scripts/build-stories-manifest.mjs');
console.log('[embeds] done.');
