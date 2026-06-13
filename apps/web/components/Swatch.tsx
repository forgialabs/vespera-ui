import type { ReactNode } from 'react';

export function Swatch({
  name,
  value,
  note,
  outline = false,
}: {
  name: string;
  value?: string;
  note?: ReactNode;
  outline?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div
        style={{
          height: 56,
          borderRadius: 'var(--r-sm)',
          border: outline ? '2px solid var(--border)' : '1px solid var(--border)',
          background: outline ? 'var(--surface-1)' : `var(--${name})`,
          borderColor: outline ? `var(--${name})` : undefined,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', lineHeight: 1.3 }}>
        <code style={{ fontSize: '0.78rem' }}>--{name}</code>
        {value ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            {value}
          </span>
        ) : null}
        {note ? <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{note}</span> : null}
      </div>
    </div>
  );
}

export function SwatchGrid({ children, min = 150 }: { children: ReactNode; min?: number }) {
  return (
    <div
      className="vsp-root"
      data-theme="dark"
      data-density="comfortable"
      data-corners="round"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
        gap: '1rem',
        padding: '1.5rem',
        border: '1px solid var(--border)',
        borderRadius: 12,
        margin: '1.25rem 0 1.75rem',
      }}
    >
      {children}
    </div>
  );
}
