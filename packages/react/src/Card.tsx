import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Apply the standard content padding. */
  pad?: boolean;
}

export function Card({ pad, className, children, ...rest }: CardProps) {
  return (
    <div className={cx('card', pad && 'card-pad', className)} {...rest}>
      {children}
    </div>
  );
}

export interface CardHeadProps {
  title?: ReactNode;
  desc?: ReactNode;
  right?: ReactNode;
}

export function CardHead({ title, desc, right }: CardHeadProps) {
  return (
    <div className="card-head">
      <div style={{ minWidth: 0 }}>
        <h3>{title}</h3>
        {desc && (
          <div className="eyebrow" style={{ marginTop: 3 }}>
            {desc}
          </div>
        )}
      </div>
      {right && (
        <>
          <div className="vsp-top-spacer" />
          {right}
        </>
      )}
    </div>
  );
}
