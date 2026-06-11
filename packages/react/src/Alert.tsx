import type { ReactNode } from 'react';
import { Icon, type IconComponent } from '@vespera-ui/icons';
import { cx } from './cx';

export type AlertTone = 'info' | 'pos' | 'warn' | 'neg';

const toneIcon: Record<AlertTone, IconComponent> = {
  info: Icon.sparkle,
  pos: Icon.checkCircle,
  warn: Icon.bell,
  neg: Icon.x,
};

export interface AlertProps {
  tone?: AlertTone;
  /** Override the default tone icon. */
  icon?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
}

export function Alert({ tone = 'info', icon, title, children, action }: AlertProps) {
  const Fallback = toneIcon[tone];
  return (
    <div className={cx('ui-alert', tone)}>
      {icon ?? <Fallback />}
      <div style={{ flex: 1 }}>
        {title && <div className="ui-alert-title">{title}</div>}
        {children && <div className="ui-alert-body">{children}</div>}
      </div>
      {action}
    </div>
  );
}
