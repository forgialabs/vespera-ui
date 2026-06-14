import { useState, type ReactNode } from 'react';
import { Icon } from '@vespera-ui/icons';
import { cx } from './cx';

export interface SettingRowProps {
  title?: ReactNode;
  desc?: ReactNode;
  children?: ReactNode;
  last?: boolean;
}

export function SettingRow({ title, desc, children, last }: SettingRowProps) {
  return (
    <div className={cx('ui-setrow', last && 'last')}>
      <div className="ui-setrow-main">
        <div className="ui-setrow-title">{title}</div>
        {desc && <div className="ui-setrow-desc">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

export type VerticalTabItem =
  | string
  | { value: string; label: ReactNode; icon?: ReactNode; badge?: ReactNode };

export interface VerticalTabsProps {
  tabs: VerticalTabItem[];
  value: string;
  onChange: (value: string) => void;
}

export function VerticalTabs({ tabs, value, onChange }: VerticalTabsProps) {
  return (
    <div className="ui-vtabs">
      {tabs.map((t) => {
        const id = typeof t === 'string' ? t : t.value;
        const label = typeof t === 'string' ? t : t.label;
        const icon = typeof t === 'object' ? t.icon : undefined;
        const badge = typeof t === 'object' ? t.badge : undefined;
        return (
          <button
            key={id}
            type="button"
            className={cx('ui-vtab', value === id && 'on')}
            onClick={() => onChange(id)}
          >
            {icon}
            {label}
            {badge != null && <span className="ui-nav-badge">{badge}</span>}
          </button>
        );
      })}
    </div>
  );
}

export interface NavItemProps {
  icon?: ReactNode;
  label?: ReactNode;
  active?: boolean;
  badge?: ReactNode;
  onClick?: () => void;
  /** Set when nested under a `NavGroup`. */
  sub?: boolean;
  /** Render as a link instead of a button (real sidebars are links). */
  href?: string;
  disabled?: boolean;
}

export function NavItem({
  icon,
  label,
  active,
  badge,
  onClick,
  sub,
  href,
  disabled,
}: NavItemProps) {
  const className = cx('ui-nav-item', active && 'on', disabled && 'disabled');
  const inner = (
    <>
      {icon}
      <span style={{ flex: sub ? 'none' : 1 }}>{label}</span>
      {badge != null && <span className="ui-nav-badge">{badge}</span>}
    </>
  );
  if (href && !disabled) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" disabled={disabled} className={className} onClick={onClick}>
      {inner}
    </button>
  );
}

export interface NavGroupProps {
  icon?: ReactNode;
  label?: ReactNode;
  defaultOpen?: boolean;
  children?: ReactNode;
}

export function NavGroup({ icon, label, defaultOpen, children }: NavGroupProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={cx('ui-nav-group', open && 'open')}>
      <button
        type="button"
        className={cx('ui-nav-item', open && 'open')}
        onClick={() => setOpen((o) => !o)}
      >
        {icon}
        <span>{label}</span>
        <Icon.chevRight className="ui-nav-chev" />
      </button>
      <div className="ui-nav-sub">
        <div>
          <div className="ui-nav" style={{ paddingTop: 2 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
