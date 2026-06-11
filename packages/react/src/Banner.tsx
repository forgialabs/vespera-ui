import type { ReactNode } from 'react';
import { Icon, type IconComponent } from '@vespera-ui/icons';
import { cx } from './cx';

export type BannerTone = 'info' | 'warn' | 'accent';

const bannerIcon: Record<BannerTone, IconComponent> = {
  info: Icon.sparkle,
  warn: Icon.bell,
  accent: Icon.bolt,
};

export interface BannerProps {
  tone?: BannerTone;
  icon?: ReactNode;
  children?: ReactNode;
  onDismiss?: () => void;
  action?: ReactNode;
}

export function Banner({ tone = 'info', icon, children, onDismiss, action }: BannerProps) {
  const Fallback = bannerIcon[tone];
  return (
    <div className={cx('ui-banner', tone)}>
      {icon ?? <Fallback />}
      <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{children}</div>
      {action}
      {onDismiss && (
        <button type="button" className="ui-banner-x" onClick={onDismiss} aria-label="Dismiss">
          <Icon.x style={{ width: 15, height: 15 }} />
        </button>
      )}
    </div>
  );
}

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: ReactNode;
  desc?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({ icon, title, desc, action, compact }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        padding: compact ? '32px 20px' : '56px 24px',
      }}
    >
      <div style={{ maxWidth: 340 }}>
        <span
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 18px',
            background: 'color-mix(in oklab, var(--accent) 12%, transparent)',
            color: 'var(--accent)',
            border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)',
          }}
        >
          {icon ?? <Icon.inbox style={{ width: 26, height: 26 }} />}
        </span>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
        {desc && (
          <p
            style={{ margin: '7px 0 0', color: 'var(--text-dim)', fontSize: 13.5, lineHeight: 1.6 }}
          >
            {desc}
          </p>
        )}
        {action && (
          <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'center' }}>
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
