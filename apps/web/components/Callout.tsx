import type { ReactNode } from 'react';

type Tone = 'info' | 'tip' | 'warn' | 'danger';

const TONE: Record<Tone, { color: string; label: string }> = {
  info: { color: 'var(--accent)', label: 'Note' },
  tip: { color: 'var(--success)', label: 'Tip' },
  warn: { color: 'var(--warning)', label: 'Warning' },
  danger: { color: 'var(--danger)', label: 'Caution' },
};

/** A doc callout, themed with Vespera tokens. Replaces Starlight's `:::` asides. */
export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: Tone;
  title?: ReactNode;
  children: ReactNode;
}) {
  const t = TONE[type];
  return (
    <div
      style={{
        margin: '1.25rem 0',
        padding: '12px 16px',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${t.color}`,
        background: `color-mix(in oklab, ${t.color} 7%, transparent)`,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 13.5, color: t.color, marginBottom: 4 }}>
        {title ?? t.label}
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}
