import { useState, type ReactNode } from 'react';
import { Icon } from '@vespera-ui/icons';
import { cx } from './cx';

export interface AccordionItem {
  title: ReactNode;
  body: ReactNode;
  icon?: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow multiple panels open at once. */
  multiple?: boolean;
  defaultOpen?: number[];
  /** Controlled open indices. Omit for uncontrolled (the default). */
  open?: number[];
  /** Notified with the next set of open indices whenever a panel toggles. */
  onOpenChange?: (open: number[]) => void;
}

export function Accordion({
  items,
  multiple,
  defaultOpen = [],
  open,
  onOpenChange,
}: AccordionProps) {
  const controlled = open !== undefined;
  const [internal, setInternal] = useState<Set<number>>(() => new Set(defaultOpen));
  const openSet = controlled ? new Set(open) : internal;
  const toggle = (i: number) => {
    const n = new Set(multiple ? openSet : []);
    if (openSet.has(i)) n.delete(i);
    else n.add(i);
    if (!controlled) setInternal(n);
    onOpenChange?.([...n]);
  };
  return (
    <div className="ui-acc">
      {items.map((it, i) => (
        <div key={i} className={cx('ui-acc-item', openSet.has(i) && 'open')}>
          <button type="button" className="ui-acc-head" onClick={() => toggle(i)}>
            {it.icon}
            {it.title}
            <Icon.chevRight className="chev" style={{ width: 17, height: 17 }} />
          </button>
          <div className="ui-acc-bodywrap">
            <div>
              <div className="ui-acc-body">{it.body}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
