import { Fragment, type ReactNode } from 'react';
import { Icon } from '@vespera-ui/icons';
import { cx } from './cx';

export interface BreadcrumbProps {
  items: ReactNode[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5 }}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={i}>
            {i > 0 && (
              <Icon.chevRight style={{ width: 13, height: 13, color: 'var(--text-faint)' }} />
            )}
            <span
              style={{
                color: last ? 'var(--text)' : 'var(--text-dim)',
                fontWeight: last ? 600 : 500,
              }}
            >
              {it}
            </span>
          </Fragment>
        );
      })}
    </nav>
  );
}

export interface PaginationProps {
  page: number;
  pages: number;
  onPage: (page: number) => void;
}

export function Pagination({ page, pages, onPage }: PaginationProps) {
  const nums: (number | '…')[] = [];
  for (let i = 0; i < pages; i++) {
    if (i === 0 || i === pages - 1 || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        disabled={page === 0}
        onClick={() => onPage(page - 1)}
        aria-label="Previous page"
      >
        <Icon.chevLeft style={{ width: 14, height: 14 }} />
      </button>
      {nums.map((n, i) =>
        n === '…' ? (
          <span
            key={`gap-${i}`}
            className="mono"
            style={{ padding: '0 6px', color: 'var(--text-faint)' }}
          >
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            className={cx('btn', 'btn-sm', n === page ? 'btn-primary' : 'btn-subtle')}
            style={{ minWidth: 32, padding: 0 }}
            onClick={() => onPage(n)}
          >
            {n + 1}
          </button>
        ),
      )}
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        disabled={page >= pages - 1}
        onClick={() => onPage(page + 1)}
        aria-label="Next page"
      >
        <Icon.chevRight style={{ width: 14, height: 14 }} />
      </button>
    </div>
  );
}

export interface StepperProps {
  steps: ReactNode[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="ui-steps">
      {steps.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && <div className={cx('ui-step-bar', i <= current && 'done')} />}
          <div
            className={cx(
              'ui-step',
              i < current && 'done',
              i === current && 'active',
              i > current && 'pending',
            )}
          >
            <span className="ui-step-dot">
              {i < current ? <Icon.check style={{ width: 14, height: 14 }} /> : i + 1}
            </span>
            <span className="ui-step-label">{s}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
