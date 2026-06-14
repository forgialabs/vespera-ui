'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type CSSProperties } from 'react';

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

/** Does this folder (recursively) contain the currently-active page? */
function containsActive(node: SidebarNode, pathname: string): boolean {
  if (node.type !== 'folder') return false;
  const here = norm(pathname);
  const walk = (n: SidebarNode): boolean =>
    n.type === 'page' ? norm(n.url) === here : n.type === 'folder' ? n.children.some(walk) : false;
  return node.children.some(walk);
}

/** A collapsible group. Auto-opens (and keeps open) the section you're in. */
function Folder({ node, pathname, onNav }: { node: SidebarNode & { type: 'folder' }; pathname: string; onNav?: () => void }) {
  const active = containsActive(node, pathname);
  const [open, setOpen] = useState(active);
  const show = open || active;
  return (
    <div>
      <button
        type="button"
        className="vsp-nav-group"
        aria-expanded={show}
        data-active={active}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{node.name}</span>
        <span className="vsp-nav-chevron" data-open={show} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24">
            <path
              d={show ? 'M6 9l6 6 6-6' : 'M9 6l6 6-6 6'}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {show ? (
        <div className="vsp-nav-children">
          {node.children.map((c, i) => (
            <Node key={i} node={c} pathname={pathname} onNav={onNav} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Node({ node, pathname, onNav }: { node: SidebarNode; pathname: string; onNav?: () => void }) {
  if (node.type === 'separator') return <div style={groupLabel}>{node.name}</div>;
  if (node.type === 'folder') return <Folder node={node} pathname={pathname} onNav={onNav} />;
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
