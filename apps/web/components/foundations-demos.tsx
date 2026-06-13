'use client';
import { Card, CardHead, Badge } from '@vespera-ui/react';

const well = (surface: string, label: string) => (
  <div
    style={{
      background: `var(--${surface})`,
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-sm)',
      padding: '12px 14px',
      fontSize: 13,
    }}
  >
    <code style={{ color: 'var(--text-dim)' }}>--{surface}</code> — {label}
  </div>
);

/**
 * The "weightless deep-space" backdrop: the animated `.vsp-bg` orbs floating behind
 * content, plus the surface-elevation scale stacked on the radial-gradient `--bg`.
 */
export function BackgroundDemo() {
  return (
    <>
      <div className="vsp-bg" aria-hidden="true">
        <b></b>
        <b></b>
        <b></b>
      </div>
      <div style={{ position: 'relative', width: '100%' }}>
        <Card>
          <CardHead
            title="A card, lifted off deep space"
            desc="The card sits on --surface-1; the radial glow + floating orbs behind it create depth without a heavy shadow."
            right={
              <Badge tone="info" dot>
                live
              </Badge>
            }
          />
          <div className="card-pad" style={{ display: 'grid', gap: 10 }}>
            {well('surface-2', 'a raised well inside the card (inputs, rows)')}
            {well('surface-3', 'the next step up (popovers, hover states)')}
          </div>
        </Card>
      </div>
    </>
  );
}