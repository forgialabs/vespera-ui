import Link from 'next/link';
import type { ReactNode } from 'react';

export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 14,
        margin: '1.5rem 0',
      }}
    >
      {children}
    </div>
  );
}

/** A linked card for overview grids. */
export function Card({
  title,
  href,
  children,
}: {
  title: ReactNode;
  href?: string;
  children?: ReactNode;
}) {
  const inner = (
    <>
      <b style={{ fontSize: 14.5, letterSpacing: '-0.01em' }}>{title}</b>
      {children ? (
        <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.55 }}>
          {children}
        </div>
      ) : null}
    </>
  );
  const style = {
    display: 'block',
    padding: '16px 18px',
    background: 'var(--surface-1)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-md)',
    textDecoration: 'none',
    color: 'var(--text)',
  } as const;
  return href ? (
    <Link href={href} style={style}>
      {inner}
    </Link>
  ) : (
    <div style={style}>{inner}</div>
  );
}
