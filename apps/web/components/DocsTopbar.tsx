'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@vespera-ui/icons';
import { CommandPalette, IconButton, useCmdK } from '@vespera-ui/react';

export interface NavPage {
  title: string;
  url: string;
}

export function DocsTopbar({ pages }: { pages: NavPage[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  useCmdK(setOpen);

  // Apply theme to the single .vsp-root.
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.vsp-root');
    if (root) root.dataset.theme = theme;
  }, [theme]);

  const go = (url: string) => {
    router.push(url);
    setOpen(false);
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 22px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--glass)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: 'var(--ctrl-h)',
          padding: '0 10px',
          width: 'min(280px, 40vw)',
          border: '1px solid var(--border)',
          background: 'var(--surface-2)',
          borderRadius: 'var(--r-sm)',
          color: 'var(--text-faint)',
          cursor: 'pointer',
          fontSize: 13,
        }}
      >
        <Icon.search style={{ width: 15, height: 15 }} />
        <span style={{ flex: 1, textAlign: 'left' }}>Search docs…</span>
        <kbd className="ui-kbd">⌘K</kbd>
      </button>
      <div style={{ flex: 1 }} />
      <IconButton
        icon={theme === 'dark' ? <Icon.sun /> : <Icon.moon />}
        label="Toggle theme"
        onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />
      <a
        href="https://github.com/forgialabs/vespera-ui"
        target="_blank"
        rel="noopener"
        aria-label="GitHub"
        style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, color: 'var(--text-dim)' }}
      >
        <Icon.layers style={{ width: 18, height: 18 }} />
      </a>

      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        groups={[
          {
            label: 'Pages',
            items: pages.map((p) => ({ label: p.title, keywords: p.url, onRun: () => go(p.url) })),
          },
        ]}
      />
    </header>
  );
}
