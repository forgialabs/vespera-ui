// Build the copy-in registry from @vespera-ui/react source.
//
// For every component source file we record its local (relative) dependencies
// and external npm dependencies, compute the transitive local closure, copy the
// raw source into ./registry/, and write ./registry.json. The CLI reads this to
// copy a component plus everything it needs into a user's project.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const cliDir = join(here, '..');
const srcDir = join(cliDir, '..', 'react', 'src');
const outDir = join(cliDir, 'registry');

const isStory = (f) => f.endsWith('.stories.tsx');
const isSource = (f) =>
  (f.endsWith('.tsx') || f.endsWith('.ts')) && !isStory(f) && f !== 'index.ts';

const files = readdirSync(srcDir).filter(isSource);

/** Resolve a relative specifier like './Foo' to its source filename. */
function resolveLocal(spec) {
  const base = spec.replace(/^\.\//, '');
  for (const ext of ['.tsx', '.ts']) {
    if (files.includes(base + ext)) return base + ext;
  }
  return null;
}

const IMPORT_RE = /(?:import|export)\s+(?:type\s+)?[^'"]*?from\s+['"]([^'"]+)['"]/g;

const meta = {}; // file -> { local: Set, npm: Set, exports: [] }
for (const file of files) {
  const code = readFileSync(join(srcDir, file), 'utf8');
  const local = new Set();
  const npm = new Set();
  let m;
  while ((m = IMPORT_RE.exec(code))) {
    const spec = m[1];
    if (spec.startsWith('.')) {
      const f = resolveLocal(spec);
      if (f) local.add(f);
    } else {
      npm.add(spec);
    }
  }
  const exports = [];
  const exportRe = /export\s+(?:function|const|class)\s+([A-Z][A-Za-z0-9]*)/g;
  let e;
  while ((e = exportRe.exec(code))) exports.push(e[1]);
  meta[file] = { local, npm, exports: [...new Set(exports)] };
}

/** Transitive local closure for a file (including itself). */
function closure(file, seen = new Set()) {
  if (seen.has(file)) return seen;
  seen.add(file);
  for (const dep of meta[file].local) closure(dep, seen);
  return seen;
}

const slug = (file) =>
  basename(file)
    .replace(/\.(tsx|ts)$/, '')
    .toLowerCase();

// Helper-only files (no exported components) aren't offered directly.
const components = files.filter((f) => meta[f].exports.length > 0);

const registry = {};
for (const file of components) {
  const localFiles = [...closure(file)];
  const npm = new Set();
  for (const f of localFiles) for (const d of meta[f].npm) npm.add(d);
  registry[slug(file)] = {
    name: slug(file),
    exports: meta[file].exports,
    files: localFiles.sort(),
    npmDependencies: [...npm].filter((d) => d !== 'react' && d !== 'react-dom').sort(),
  };
}

// Copy every source file that any component needs into ./registry/.
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const allFiles = new Set();
for (const entry of Object.values(registry)) for (const f of entry.files) allFiles.add(f);
for (const f of allFiles) copyFileSync(join(srcDir, f), join(outDir, f));

writeFileSync(
  join(cliDir, 'registry.json'),
  JSON.stringify({ components: registry }, null, 2) + '\n',
);

console.log(
  `Registry: ${Object.keys(registry).length} components, ${allFiles.size} source files copied.`,
);
