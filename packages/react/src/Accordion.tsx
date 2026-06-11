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
}

export function Accordion({ items, multiple, defaultOpen = [] }: AccordionProps) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen));
  const toggle = (i: number) =>
    setOpen((s) => {
      const n = new Set(multiple ? s : []);
      if (s.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  return (
    <div className="ui-acc">
      {items.map((it, i) => (
        <div key={i} className={cx('ui-acc-item', open.has(i) && 'open')}>
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
