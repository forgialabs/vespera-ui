import { readFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, '..');

interface Entry {
  name: string;
  exports: string[];
  files: string[];
  npmDependencies: string[];
}
const registry: { components: Record<string, Entry> } = JSON.parse(
  readFileSync(join(pkgRoot, 'registry.json'), 'utf8'),
);

// ── tiny ANSI helpers (no deps) ───────────────────────────────────────────────
const c = {
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
};

const DEFAULT_DIR = 'src/components/vespera';

function parseFlags(args: string[]) {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i]!;
    if (a === '--force' || a === '-f') flags.force = true;
    else if (a === '--dir' || a === '-d') {
      const v = args[++i];
      if (v !== undefined) flags.dir = v;
    } else positional.push(a);
  }
  return { positional, flags };
}

function help() {
  console.log(`
${c.bold('vespera')} — copy Vespera components into your project.

${c.bold('Usage')}
  npx vespera <command> [options]

${c.bold('Commands')}
  ${c.cyan('add')} <component...>   Copy components (and their dependencies) into your project
  ${c.cyan('list')}                 List available components
  ${c.cyan('init')}                 Print setup steps for @vespera-ui/css

${c.bold('Options')}
  ${c.cyan('-d, --dir')} <path>     Target directory (default: ${DEFAULT_DIR})
  ${c.cyan('-f, --force')}          Overwrite files that already exist

${c.bold('Examples')}
  npx vespera add button field
  npx vespera add dialog --dir src/ui
  npx vespera list
`);
}

function list() {
  const names = Object.keys(registry.components).sort();
  console.log(`\n${c.bold('Available components')} ${c.dim(`(${names.length})`)}\n`);
  for (const name of names) {
    const e = registry.components[name]!;
    console.log(`  ${c.cyan(name.padEnd(16))} ${c.dim(e.exports.join(', '))}`);
  }
  console.log(`\n${c.dim('Add one with:')} npx vespera add ${c.cyan('<name>')}\n`);
}

function init() {
  console.log(`
${c.bold('Set up Vespera')}

  ${c.dim('1.')} Install the stylesheet (and icons, if you use them):
     ${c.cyan('npm install @vespera-ui/css @vespera-ui/icons')}

  ${c.dim('2.')} Import the CSS once, at your app entry:
     ${c.cyan("import '@vespera-ui/css';")}

  ${c.dim('3.')} Wrap your app in a themed root:
     ${c.cyan('<div className="vsp-root" data-theme="dark">…</div>')}

  ${c.dim('4.')} Copy in components as you need them:
     ${c.cyan('npx vespera add button card field')}
`);
}

function add(names: string[], flags: Record<string, string | boolean>) {
  if (names.length === 0) {
    console.log(c.red('Specify at least one component, e.g. ') + c.cyan('npx vespera add button'));
    process.exit(1);
  }
  const dir = typeof flags.dir === 'string' ? flags.dir : DEFAULT_DIR;
  const force = flags.force === true;
  const targetDir = resolve(process.cwd(), dir);

  const files = new Set<string>();
  const npm = new Set<string>();
  const unknown: string[] = [];
  for (const raw of names) {
    const key = raw.toLowerCase();
    const entry = registry.components[key];
    if (!entry) {
      unknown.push(raw);
      continue;
    }
    entry.files.forEach((f) => files.add(f));
    entry.npmDependencies.forEach((d) => npm.add(d));
  }
  if (unknown.length) {
    console.log(c.red(`Unknown component(s): ${unknown.join(', ')}`));
    console.log(c.dim('Run ') + c.cyan('npx vespera list') + c.dim(' to see what is available.'));
    process.exit(1);
  }

  mkdirSync(targetDir, { recursive: true });
  let written = 0;
  let skipped = 0;
  for (const f of [...files].sort()) {
    const dest = join(targetDir, f);
    if (existsSync(dest) && !force) {
      console.log(`  ${c.yellow('skip')}  ${f} ${c.dim('(exists — use --force)')}`);
      skipped++;
      continue;
    }
    copyFileSync(join(pkgRoot, 'registry', f), dest);
    console.log(`  ${c.green('add')}   ${join(dir, f)}`);
    written++;
  }

  console.log(
    `\n${c.green('✓')} ${written} file(s) written${skipped ? `, ${skipped} skipped` : ''} to ${c.bold(dir)}`,
  );

  const deps = ['@vespera-ui/css', ...npm];
  console.log(`\n${c.dim('Make sure these are installed:')}`);
  console.log(`  ${c.cyan(`npm install ${deps.join(' ')}`)}`);
  console.log(
    `\n${c.dim('Then import the CSS once and wrap your app in ')}${c.cyan('.vsp-root')}${c.dim('.')}\n`,
  );
}

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const { positional, flags } = parseFlags(rest);
  switch (cmd) {
    case 'add':
      return add(positional, flags);
    case 'list':
    case 'ls':
      return list();
    case 'init':
      return init();
    case undefined:
    case '-h':
    case '--help':
    case 'help':
      return help();
    default:
      console.log(c.red(`Unknown command: ${cmd}`));
      help();
      process.exit(1);
  }
}

main();
