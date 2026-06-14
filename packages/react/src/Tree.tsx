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
  /** Controlled expanded node ids. Omit for uncontrolled. */
  expanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  /** Controlled selected node id. Omit for uncontrolled. */
  selected?: string | null;
  onSelect?: (id: string) => void;
}

export function Tree({
  data,
  defaultExpanded = [],
  expanded,
  onExpandedChange,
  selected,
  onSelect,
}: TreeProps) {
  const expControlled = expanded !== undefined;
  const selControlled = selected !== undefined;
  const [expInternal, setExpInternal] = useState<Set<string>>(() => new Set(defaultExpanded));
  const [selInternal, setSelInternal] = useState<string | null>(null);
  const expandedSet = expControlled ? new Set(expanded) : expInternal;
  const selectedId = selControlled ? selected : selInternal;
  const toggle = (id: string) => {
    const n = new Set(expandedSet);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    if (!expControlled) setExpInternal(n);
    onExpandedChange?.([...n]);
  };
  const select = (id: string) => {
    if (!selControlled) setSelInternal(id);
    onSelect?.(id);
  };
  return (
    <div className="ui-tree">
      {data.map((n, i) => (
        <TreeNode
          key={i}
          node={n}
          expanded={expandedSet}
          toggle={toggle}
          selected={selectedId}
          select={select}
        />
      ))}
    </div>
  );
}
