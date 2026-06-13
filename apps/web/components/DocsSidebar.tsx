'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CSSProperties } from 'react';

export type SidebarNode =
  | { type: 'page'; name: string; url: string }
  | { type: 'folder'; name: string; children: SidebarNode[] }
  | { type: 'separator'; name: string };

const groupLabel: CSSProperties = {
  padding: '16px 10px 6px',
  fontFamily: 'var(--font-mono)',
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--text-faint)',
  fontWeight: 500,
};

const norm = (s: string) => s.replace(/\/+$/, '') || '/';

function Node({ node, pathname, onNav }: { node: SidebarNode; pathname: string; onNav?: () => void }) {
  if (node.type === 'separator') return <div style={groupLabel}>{node.name}</div>;
  if (node.type === 'folder')
    return (
      <div>
        <div style={groupLabel}>{node.name}</div>
        {node.children.map((c, i) => (
          <Node key={i} node={c} pathname={pathname} onNav={onNav} />
        ))}
      </div>
    );
  // usePathname() strips basePath but (with trailingSlash) keeps a trailing
  // slash, while node.url has none — normalize both before comparing.
  const active = norm(pathname) === norm(node.url);
  return (
    <Link className="vsp-nav-link" href={node.url} data-active={active} onClick={onNav}>
      {node.name}
    </Link>
  );
}

/** The brand + nav list, shared by the desktop sidebar and the mobile drawer. */
export function SidebarNav({ tree, onNav }: { tree: SidebarNode[]; onNav?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <Link
        href="/"
        onClick={onNav}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '4px 8px 16px',
          textDecoration: 'none',
          color: 'var(--text)',
        }}
      >
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 'var(--r-sm)',
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(140deg, var(--accent), var(--accent-2))',
            color: '#fff',
            fontWeight: 800,
          }}
        >
          V
        </span>
        <b style={{ fontSize: 15, letterSpacing: '-0.01em' }}>Vespera</b>
      </Link>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tree.map((n, i) => (
          <Node key={i} node={n} pathname={pathname} onNav={onNav} />
        ))}
      </nav>
    </>
  );
}

/** Desktop sidebar (hidden under 1024px — the mobile drawer lives in the top bar). */
export function DocsSidebar({ tree }: { tree: SidebarNode[] }) {
  return (
    <aside
      className="vsp-docs-aside"
      style={{
        borderRight: '1px solid var(--border)',
        padding: '16px 12px',
        background: 'color-mix(in oklab, var(--surface-1) 92%, var(--bg))',
        position: 'sticky',
        top: 0,
        alignSelf: 'start',
        height: '100dvh',
        overflowY: 'auto',
      }}
    >
      <SidebarNav tree={tree} />
    </aside>
  );
}
