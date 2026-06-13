'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@vespera-ui/icons';
import { CommandPalette, IconButton, useCmdK } from '@vespera-ui/react';
import { SidebarNav, type SidebarNode } from './DocsSidebar';

export interface NavPage {
  title: string;
  url: string;
}

export function DocsTopbar({ pages, tree }: { pages: NavPage[]; tree: SidebarNode[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nav, setNav] = useState(false);
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
        className="vsp-docs-menu-btn"
        aria-label="Menu"
        onClick={() => setNav(true)}
        style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          border: '1px solid var(--border)',
          background: 'transparent',
          borderRadius: 'var(--r-sm)',
          color: 'var(--text)',
          cursor: 'pointer',
        }}
      >
        <Icon.layers style={{ width: 18, height: 18 }} />
      </button>
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

      {nav ? (
        <div
          role="presentation"
          onClick={() => setNav(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 60 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 270,
              maxWidth: '82vw',
              height: '100dvh',
              overflowY: 'auto',
              padding: '16px 12px',
              background: 'var(--surface-1)',
              borderRight: '1px solid var(--border)',
            }}
          >
            <SidebarNav tree={tree} onNav={() => setNav(false)} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
