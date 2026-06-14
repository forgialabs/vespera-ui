import { Fragment, type ReactNode } from 'react';
import { Icon } from '@vespera-ui/icons';
import { cx } from './cx';

export interface CircularProgressProps {
  value?: number;
  size?: number;
  thickness?: number;
  color?: string;
  label?: ReactNode;
}

export function CircularProgress({
  value = 0,
  size = 76,
  thickness = 7,
  color = 'var(--accent)',
  label,
}: CircularProgressProps) {
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - Math.min(100, value) / 100)}
          style={{ transition: 'stroke-dashoffset .5s cubic-bezier(.3,.7,.3,1)' }}
        />
      </svg>
      <div
        className="tnum"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          fontWeight: 800,
          fontSize: size * 0.24,
        }}
      >
        {label ?? `${Math.round(value)}%`}
      </div>
    </div>
  );
}

export interface StatProps {
  icon?: ReactNode;
  label?: ReactNode;
  value?: ReactNode;
  delta?: ReactNode;
  deltaDir?: 'up' | 'down';
  /** Accent color for the icon tile. */
  tone?: string;
}

export function Stat({
  icon,
  label,
  value,
  delta,
  deltaDir = 'up',
  tone = 'var(--accent)',
}: StatProps) {
  const Arrow = deltaDir === 'up' ? Icon.arrowUp : Icon.arrowDown;
  return (
    <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
      {icon && (
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--r-sm)',
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            background: `color-mix(in oklab, ${tone} 14%, transparent)`,
            color: tone,
          }}
        >
          {icon}
        </span>
      )}
      <div style={{ minWidth: 0 }}>
        <div className="eyebrow">{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 3 }}>
          <span className="tnum" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>
            {value}
          </span>
          {delta != null && (
            <span
              className={cx('badge', deltaDir === 'up' ? 'badge-pos' : 'badge-neg')}
              style={{ padding: '1px 6px' }}
            >
              <Arrow style={{ width: 10, height: 10 }} />
              {delta}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export type TimelineTone = 'pos' | 'neg' | 'warn' | 'info';

export interface TimelineItem {
  title: ReactNode;
  time?: ReactNode;
  body?: ReactNode;
  icon?: ReactNode;
  tone?: TimelineTone;
  /** Highlight this entry as the current one. */
  active?: boolean;
}

const tlTone: Record<TimelineTone, string> = {
  pos: 'var(--success)',
  neg: 'var(--danger)',
  warn: 'var(--warning)',
  info: 'var(--accent)',
};

export interface TimelineProps {
  items: TimelineItem[];
  /** Lay the entries out left-to-right instead of top-to-bottom. */
  orientation?: 'vertical' | 'horizontal';
}

export function Timeline({ items, orientation = 'vertical' }: TimelineProps) {
  return (
    <div className={cx('ui-tl', orientation === 'horizontal' && 'horizontal')}>
      {items.map((it, i) => {
        const c = it.tone ? tlTone[it.tone] : undefined;
        return (
          <div key={i} className={cx('ui-tl-item', it.active && 'active')}>
            <span
              className="ui-tl-dot"
              style={
                c
                  ? {
                      background: `color-mix(in oklab, ${c} 14%, transparent)`,
                      color: c,
                      borderColor: `color-mix(in oklab, ${c} 30%, transparent)`,
                    }
                  : undefined
              }
            >
              {it.icon ?? <Icon.clock />}
            </span>
            <div className="ui-tl-body">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, fontSize: 13.5 }}>{it.title}</span>
                {it.time && (
                  <span className="eyebrow" style={{ marginLeft: 'auto' }}>
                    {it.time}
                  </span>
                )}
              </div>
              {it.body && (
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 3 }}>
                  {it.body}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export interface DescriptionListProps {
  items: [ReactNode, ReactNode][];
}

export function DescriptionList({ items }: DescriptionListProps) {
  return (
    <dl className="ui-dl">
      {items.map(([k, v], i) => {
        const last = i === items.length - 1 ? 'last' : '';
        return (
          <Fragment key={i}>
            <dt className={last}>{k}</dt>
            <dd className={last}>{v}</dd>
          </Fragment>
        );
      })}
    </dl>
  );
}
