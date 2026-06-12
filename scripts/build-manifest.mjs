// Generate a machine-readable component manifest from the React package's TypeScript
// source, for AI tools and documentation. Run with: pnpm manifest
import { readdirSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { withCustomConfig } from 'react-docgen-typescript';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'packages/react/src');

const files = readdirSync(srcDir)
  .filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))
  .map((f) => join(srcDir, f));

const parser = withCustomConfig(join(root, 'packages/react/tsconfig.json'), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // Keep only props declared in our own source (drop inherited DOM/HTML attributes).
  propFilter: (prop) => !prop.parent || !/node_modules/.test(prop.parent.fileName),
});

const pkg = JSON.parse(readFileSync(join(root, 'packages/react/package.json'), 'utf8'));

// Component taxonomy — the single source of truth for how components are grouped
// in the docs (and surfaced here for AI tools). Order is meaningful. Anything not
// listed falls into "Other" so the manifest never silently drops a component.
const CATEGORIES = [
  ['Actions', ['Button', 'IconButton']],
  [
    'Forms & inputs',
    [
      'Field',
      'Input',
      'InputAffix',
      'Textarea',
      'NativeSelect',
      'Select',
      'Combobox',
      'MultiSelect',
      'TokenInput',
      'Checkbox',
      'Radio',
      'RadioGroup',
      'Switch',
      'Slider',
      'NumberStepper',
      'InlineEdit',
      'OTPInput',
      'CopyButton',
      'FileDropzone',
      'SettingRow',
    ],
  ],
  ['Date & time', ['Calendar', 'DatePicker', 'DateRangePicker', 'EventCalendar']],
  [
    'Data display',
    [
      'Badge',
      'Tag',
      'Kbd',
      'Avatar',
      'AvatarGroup',
      'Stat',
      'StatCard',
      'Timeline',
      'DescriptionList',
    ],
  ],
  ['Charts', ['AreaChart', 'BarChart', 'Donut', 'Sparkline']],
  [
    'Navigation',
    [
      'Tabs',
      'VerticalTabs',
      'Segmented',
      'Breadcrumb',
      'Pagination',
      'Stepper',
      'NavGroup',
      'NavItem',
    ],
  ],
  [
    'Feedback & status',
    ['Alert', 'Banner', 'Progress', 'CircularProgress', 'Spinner', 'Skeleton', 'EmptyState'],
  ],
  [
    'Overlays',
    ['Dialog', 'Sheet', 'Popover', 'DropdownMenu', 'Anchored', 'Tooltip', 'CommandPalette'],
  ],
  ['Layout & structure', ['Card', 'CardHead', 'Block', 'Divider', 'Accordion', 'Tree']],
  [
    'Blocks',
    [
      'OrdersBlock',
      'KanbanBlock',
      'ApiKeysBlock',
      'AuditLogBlock',
      'SystemStatusBlock',
      'TeamRolesBlock',
    ],
  ],
];
const CATEGORY_OF = new Map();
for (const [label, names] of CATEGORIES) for (const n of names) CATEGORY_OF.set(n, label);

const components = parser
  .parse(files)
  .filter((d) => d.displayName && /^[A-Z]/.test(d.displayName))
  .map((d) => ({
    name: d.displayName,
    category: CATEGORY_OF.get(d.displayName) ?? 'Other',
    description: d.description || undefined,
    props: Object.values(d.props ?? {})
      .map((p) => {
        const values = Array.isArray(p.type?.value)
          ? p.type.value
              .map((v) => (typeof v.value === 'string' ? v.value.replace(/^"|"$/g, '') : v.value))
              .filter((v) => v !== undefined && v !== 'undefined')
          : undefined;
        return {
          name: p.name,
          type: p.type?.name,
          values: values && values.length ? values : undefined,
          required: p.required,
          defaultValue: p.defaultValue?.value ?? undefined,
          description: p.description || undefined,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

// Category order for consumers (only categories that actually have members),
// with any unmapped components surfaced last under "Other".
const present = new Set(components.map((c) => c.category));
const categories = [
  ...CATEGORIES.map(([label]) => label).filter((label) => present.has(label)),
  ...(present.has('Other') ? ['Other'] : []),
];

const manifest = {
  $schema: 'https://forgialabs.github.io/vespera-ui/manifest.schema.json',
  package: pkg.name,
  version: pkg.version,
  framework: 'react',
  note: 'Auto-generated from packages/react/src by scripts/build-manifest.mjs. Components render inside a themed `.vsp-root` element and consume @vespera-ui/css classes. Icon props accept any ReactNode (use @vespera-ui/icons).',
  categories,
  components,
};

mkdirSync(join(root, 'manifest'), { recursive: true });
writeFileSync(join(root, 'manifest/react.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote manifest/react.json — ${components.length} components`);
