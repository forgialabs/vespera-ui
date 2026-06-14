import type { CSSProperties } from 'react';
import { cx } from './cx';

export interface ProgressProps {
  value?: number;
  /** Bar color (defaults to the accent). */
  tone?: string;
  height?: number;
  /** Upper bound for `value` (default 100). */
  max?: number;
  /** Unknown-duration loading — animates continuously, ignores `value`. */
  indeterminate?: boolean;
  /** Accessible label for the progress bar. */
  label?: string;
}

export function Progress({
  value = 0,
  tone,
  height = 6,
  max = 100,
  indeterminate,
  label,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={cx('meter', indeterminate && 'indeterminate')}
      style={{ height }}
      role="progressbar"
      aria-label={label}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : max}
      aria-valuenow={indeterminate ? undefined : value}
    >
      <i
        style={
          indeterminate
            ? { background: tone }
            : { width: `${pct}%`, background: tone, transition: 'width .3s' }
        }
      />
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
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label — makes the spinner a live status region for screen readers. */
  label?: string;
  className?: string;
}

export function Spinner({ size = 'md', label, className }: SpinnerProps) {
  return (
    <span
      className={cx('ui-spinner', size === 'sm' && 'sm', size === 'lg' && 'lg', className)}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
