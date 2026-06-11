import { useState, type ReactNode } from 'react';
import { Icon } from '@vespera-ui/icons';
import { cx } from './cx';

export interface TreeNodeData {
  id?: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  children?: TreeNodeData[];
}

const nodeId = (n: TreeNodeData) => n.id ?? n.label;

interface TreeNodeProps {
  node: TreeNodeData;
  expanded: Set<string>;
  toggle: (id: string) => void;
  selected: string | null;
  select: (id: string) => void;
}

function TreeNode({ node, expanded, toggle, selected, select }: TreeNodeProps) {
  const id = nodeId(node);
  const kids = node.children ?? [];
  const hasKids = kids.length > 0;
  const open = expanded.has(id);
  return (
    <div>
      <div
        className={cx('ui-tree-row', open && 'open', selected === id && 'sel')}
        onClick={() => {
          if (hasKids) toggle(id);
          select(id);
        }}
      >
        {hasKids ? (
          <Icon.chevRight className="tw-chev" />
        ) : (
          <span style={{ width: 16, flexShrink: 0 }} />
        )}
        {node.icon ??
          (hasKids ? <Icon.layers className="tw-icon" /> : <Icon.doc className="tw-icon" />)}
        <span
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {node.label}
        </span>
        {node.badge != null && (
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>
            {node.badge}
          </span>
        )}
      </div>
      {hasKids && open && (
        <div className="ui-tree-children">
          {kids.map((c, i) => (
            <TreeNode
              key={i}
              node={c}
              expanded={expanded}
              toggle={toggle}
              selected={selected}
              select={select}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export interface TreeProps {
  data: TreeNodeData[];
  defaultExpanded?: string[];
}

export function Tree({ data, defaultExpanded = [] }: TreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultExpanded));
  const [selected, setSelected] = useState<string | null>(null);
  const toggle = (id: string) =>
    setExpanded((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  return (
    <div className="ui-tree">
      {data.map((n, i) => (
        <TreeNode
          key={i}
          node={n}
          expanded={expanded}
          toggle={toggle}
          selected={selected}
          select={setSelected}
        />
      ))}
    </div>
  );
}
