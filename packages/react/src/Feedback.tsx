import type { CSSProperties } from 'react';
import { cx } from './cx';

export interface ProgressProps {
  value?: number;
  /** Bar color (defaults to the accent). */
  tone?: string;
  height?: number;
}

export function Progress({ value = 0, tone, height = 6 }: ProgressProps) {
  return (
    <div className="meter" style={{ height }}>
      <i style={{ width: `${Math.min(100, value)}%`, background: tone, transition: 'width .3s' }} />
    </div>
  );
}

export interface SkeletonProps {
  w?: number | string;
  h?: number | string;
  r?: number | string;
  style?: CSSProperties;
}

export function Skeleton({ w = '100%', h = 12, r = 7, style }: SkeletonProps) {
  return <div className="skel" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

export interface SpinnerProps {
  size?: 'lg';
  className?: string;
}

export function Spinner({ size, className }: SpinnerProps) {
  return <span className={cx('ui-spinner', size === 'lg' && 'lg', className)} aria-hidden />;
}
