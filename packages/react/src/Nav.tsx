import { Fragment, isValidElement, type ReactNode } from 'react';
import { Icon } from '@vespera-ui/icons';
import { cx } from './cx';

export interface BreadcrumbItemObj {
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
}
export type BreadcrumbItem = ReactNode | BreadcrumbItemObj;

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Collapse the middle into an ellipsis when there are more than this many. */
  maxItems?: number;
}

const isObjItem = (it: BreadcrumbItem): it is BreadcrumbItemObj =>
  !!it && typeof it === 'object' && !isValidElement(it) && 'label' in it;

const ELLIPSIS = Symbol('ellipsis');

export function Breadcrumb({ items, maxItems }: BreadcrumbProps) {
  const display: (BreadcrumbItem | typeof ELLIPSIS)[] =
    maxItems && items.length > maxItems
      ? [items[0], ELLIPSIS, ...items.slice(items.length - (maxItems - 1))]
      : items;

  return (
    <nav
      aria-label="Breadcrumb"
      style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5 }}
    >
      {display.map((it, i) => {
        const last = i === display.length - 1;
        const sep = i > 0 && (
          <Icon.chevRight style={{ width: 13, height: 13, color: 'var(--text-faint)' }} />
        );
        if (it === ELLIPSIS) {
          return (
            <Fragment key={i}>
              {sep}
              <span style={{ color: 'var(--text-faint)' }}>…</span>
            </Fragment>
          );
        }
        const color = last ? 'var(--text)' : 'var(--text-dim)';
        const weight = last ? 600 : 500;
        let content: ReactNode;
        if (isObjItem(it)) {
          const inner = (
            <>
              {it.icon}
              {it.label}
            </>
          );
          content =
            it.href && !last ? (
              <a
                href={it.href}
                style={{
                  color,
                  fontWeight: weight,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                {inner}
              </a>
            ) : (
              <span
                style={{
                  color,
                  fontWeight: weight,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                {inner}
              </span>
            );
        } else {
          content = <span style={{ color, fontWeight: weight }}>{it}</span>;
        }
        return (
          <Fragment key={i}>
            {sep}
            {content}
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

export type StepStatus = 'done' | 'active' | 'pending' | 'error';
export interface StepItemObj {
  label: ReactNode;
  status?: StepStatus;
}
export type StepperItem = ReactNode | StepItemObj;

export interface StepperProps {
  steps: StepperItem[];
  current: number;
  /** Make steps clickable (e.g. to jump back). */
  onStepClick?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

const isStepObj = (s: StepperItem): s is StepItemObj =>
  !!s && typeof s === 'object' && !isValidElement(s) && 'label' in s;

export function Stepper({ steps, current, onStepClick, orientation = 'horizontal' }: StepperProps) {
  return (
    <div className={cx('ui-steps', orientation === 'vertical' && 'vertical')}>
      {steps.map((s, i) => {
        const label = isStepObj(s) ? s.label : s;
        const status: StepStatus =
          isStepObj(s) && s.status
            ? s.status
            : i < current
              ? 'done'
              : i === current
                ? 'active'
                : 'pending';
        const dot =
          status === 'done' ? (
            <Icon.check style={{ width: 14, height: 14 }} />
          ) : status === 'error' ? (
            '!'
          ) : (
            i + 1
          );
        const Tag = onStepClick ? 'button' : 'div';
        return (
          <Fragment key={i}>
            {i > 0 && <div className={cx('ui-step-bar', i <= current && 'done')} />}
            <Tag
              {...(onStepClick ? { type: 'button' as const, onClick: () => onStepClick(i) } : {})}
              className={cx('ui-step', status, onStepClick && 'clickable')}
            >
              <span className="ui-step-dot">{dot}</span>
              <span className="ui-step-label">{label}</span>
            </Tag>
          </Fragment>
        );
      })}
    </div>
  );
}
