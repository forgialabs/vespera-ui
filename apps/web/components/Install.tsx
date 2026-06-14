'use client';
import { useState } from 'react';

const MANAGERS = [
  { key: 'npm', cmd: 'npm install' },
  { key: 'pnpm', cmd: 'pnpm add' },
  { key: 'yarn', cmd: 'yarn add' },
  { key: 'bun', cmd: 'bun add' },
] as const;

const PKGS = '@vespera-ui/css @vespera-ui/react';

function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="vsp-inst-copy"
      aria-label="Copy"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}

/**
 * shadcn-style per-component install block: package-manager tabs for the one
 * install command, plus the import line for the components on this page.
 * Usage in MDX: <Install imports="Button, Tooltip" />
 */
export function Install({ imports }: { imports?: string }) {
  const [pm, setPm] = useState<(typeof MANAGERS)[number]['key']>('pnpm');
  const cmd = `${MANAGERS.find((m) => m.key === pm)!.cmd} ${PKGS}`;
  const importLine = imports
    ? `import '@vespera-ui/css'; // once, at your app root\nimport { ${imports} } from '@vespera-ui/react';`
    : null;

  return (
    <div className="vsp-inst">
      <div className="vsp-inst-tabs">
        {MANAGERS.map((m) => (
          <button key={m.key} type="button" data-on={pm === m.key} onClick={() => setPm(m.key)}>
            {m.key}
          </button>
        ))}
      </div>
      <div className="vsp-inst-cmd">
        <code>{cmd}</code>
        <Copy text={cmd} />
      </div>
      {importLine ? (
        <div className="vsp-inst-import">
          <pre>
            <code>{importLine}</code>
          </pre>
          <Copy text={importLine} />
        </div>
      ) : null}
    </div>
  );
}
