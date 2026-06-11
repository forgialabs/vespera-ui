import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '@vespera-ui/icons';
import { cx } from './cx';

export type BadgeTone = 'pos' | 'neg' | 'warn' | 'info' | 'muted';

export interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  children?: ReactNode;
  className?: string;
}

export function Badge({ tone = 'muted', dot, children, className }: BadgeProps) {
  return (
    <span className={cx('badge', `badge-${tone}`, className)}>
      {dot && <i />}
      {children}
    </span>
  );
}

export interface TagProps {
  children?: ReactNode;
  onRemove?: () => void;
}

export function Tag({ children, onRemove }: TagProps) {
  return (
    <span className="ui-tag">
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label="Remove">
          <Icon.x style={{ width: 11, height: 11 }} />
        </button>
      )}
    </span>
  );
}

export interface KbdProps {
  children?: ReactNode;
}

export function Kbd({ children }: KbdProps) {
  return <kbd className="ui-kbd">{children}</kbd>;
}

export interface DividerProps {
  vertical?: boolean;
  style?: CSSProperties;
}

export function Divider({ vertical, style }: DividerProps) {
  return <hr className={cx('ui-divider', vertical && 'v')} style={style} />;
}
