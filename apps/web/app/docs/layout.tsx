import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { DocsSidebar, type SidebarNode } from '@/components/DocsSidebar';

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
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px minmax(0, 1fr)', minHeight: '100dvh' }}>
      <DocsSidebar tree={tree} />
      <main style={{ minWidth: 0 }}>{children}</main>
    </div>
  );
}
