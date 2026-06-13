import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { DocsSidebar, type SidebarNode } from '@/components/DocsSidebar';
import { DocsTopbar } from '@/components/DocsTopbar';

type Raw = (typeof source.pageTree.children)[number];

function simplify(nodes: Raw[]): SidebarNode[] {
  const out: SidebarNode[] = [];
  for (const n of nodes) {
    if (n.type === 'separator') out.push({ type: 'separator', name: String(n.name ?? '') });
    else if (n.type === 'folder')
      out.push({ type: 'folder', name: String(n.name), children: simplify(n.children) });
    else out.push({ type: 'page', name: String(n.name), url: n.url });
  }
  return out;
}

export default function DocsLayout({ children }: { children: ReactNode }) {
  const tree = simplify(source.pageTree.children);
  const pages = source.getPages().map((p) => ({ title: String(p.data.title), url: p.url }));
  return (
    <div
      className="vsp-root"
      data-theme="dark"
      data-density="comfortable"
      data-corners="round"
      style={{ display: 'grid', gridTemplateColumns: '250px minmax(0, 1fr)', minHeight: '100dvh' }}
    >
      <DocsSidebar tree={tree} />
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <DocsTopbar pages={pages} />
        <main style={{ minWidth: 0, flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
