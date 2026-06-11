import type { ReactNode } from 'react';
import { cx } from './cx';

export type TabItem = string | { value: string; label: ReactNode; count?: number };

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  right?: ReactNode;
}

export function Tabs({ tabs, value, onChange, right }: TabsProps) {
  return (
    <div className="ui-tabs" style={{ alignItems: 'center' }}>
      {tabs.map((t) => {
        const id = typeof t === 'string' ? t : t.value;
        const label = typeof t === 'string' ? t : t.label;
        const count = typeof t === 'object' ? t.count : undefined;
        return (
          <button
            key={id}
            type="button"
            className={cx('ui-tab', value === id && 'on')}
            onClick={() => onChange(id)}
          >
            {label}
            {count != null && (
              <span className="badge badge-muted" style={{ marginLeft: 7 }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
      {right && (
        <>
          <div style={{ flex: 1 }} />
          {right}
        </>
      )}
    </div>
  );
}
