import type { CSSProperties, ReactNode } from 'react';

const stage = (children: ReactNode, style?: CSSProperties) => (
  <div style={{ width: '100%', ...style }}>{children}</div>
);
const root = (children: ReactNode, attrs: Record<string, string> = {}, style?: CSSProperties) => (
  <div className="vsp-root" data-theme="dark" {...attrs} style={style}>
    {children}
  </div>
);

/* Surfaces & background — the surface-1/2/3 elevation stack. */
export function SurfaceStack() {
  const well = (s: string, label: string) => (
    <div
      style={{
        background: `var(--${s})`,
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-sm)',
        padding: '11px 13px',
        marginBottom: 8,
        fontSize: 13,
      }}
    >
      --{s} · {label}
    </div>
  );
  return stage(
    <div style={{ maxWidth: 440 }}>
      <div
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)',
          padding: 16,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 10 }}>--surface-1 · card</div>
        {well('surface-2', 'input / row')}
        {well('surface-3', 'popover / hover')}
      </div>
    </div>,
  );
}

/* Elevation & shadows. */
export function ElevationRow() {
  const card = (label: string, sub: string, shadow?: string) => (
    <div
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        padding: '18px 22px',
        fontSize: 13,
        boxShadow: shadow,
      }}
    >
      {label}
      <br />
      <code style={{ color: 'var(--text-faint)' }}>{sub}</code>
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start', padding: 8 }}>
      {card('Resting card', 'border only')}
      {card('Lifted', '--shadow', 'var(--shadow)')}
      {card('Floating', '--shadow-lg', 'var(--shadow-lg)')}
    </div>
  );
}

/* Spacing & density — 3 density cards side by side. */
export function DensityRow() {
  const card = (d: string) =>
    root(
      <div
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)',
          padding: 'var(--pad)',
        }}
      >
        <div style={{ fontSize: 'var(--fs-base)' }}>{d}</div>
        <div
          style={{
            height: 'var(--ctrl-h)',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)',
            marginTop: 'var(--gap)',
          }}
        />
      </div>,
      { 'data-density': d },
      { flex: 1, minWidth: 150 },
    );
  return (
    <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', width: '100%' }}>
      {card('compact')}
      {card('comfortable')}
      {card('spacious')}
    </div>
  );
}

/* Spacing & density — corner radii. */
export function CornersRow() {
  const card = (c: string) =>
    root(
      <div style={{ textAlign: 'center' }}>
        <div style={{ background: 'var(--accent)', height: 60, borderRadius: 'var(--r-md)' }} />
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 8 }}>{c}</div>
      </div>,
      { 'data-corners': c },
      { flex: 1, minWidth: 120 },
    );
  return (
    <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', width: '100%' }}>
      {card('sharp')}
      {card('soft')}
      {card('round')}
    </div>
  );
}

/* Layout — a 3-column .grid of cards. */
export function GridExample() {
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', width: '100%' }}>
      {['One', 'Two', 'Three'].map((t) => (
        <div key={t} className="card" style={{ padding: 16 }}>
          {t}
        </div>
      ))}
    </div>
  );
}

/* Typography — headings + body. */
export function TypeSample() {
  return stage(
    <div>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>Weightless by design</div>
      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 14 }}>A section heading</div>
      <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-dim)', margin: '6px 0 0', maxWidth: '48ch' }}>
        Body copy sits at <code>--fs-base</code> in <code>--text-dim</code> for comfortable reading,
        with full-strength <span style={{ color: 'var(--text)' }}>--text</span> reserved for emphasis.
      </p>
    </div>,
  );
}

/* Typography — text helpers. */
export function TextHelpers() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <div className="eyebrow">Recent activity</div>
      <div className="mono" style={{ fontSize: 13 }}>
        vsp_live_8f2a39c4e7b1d91c
      </div>
      <div className="tnum" style={{ fontSize: 22, fontWeight: 800 }}>
        $48,200.00
      </div>
    </div>
  );
}
