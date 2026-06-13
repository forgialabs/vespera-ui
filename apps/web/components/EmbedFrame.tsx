'use client';
import { useEffect, type ReactNode } from 'react';

/**
 * Stage for an isolated demo (rendered inside the /embed/[demo] route, loaded in
 * an iframe by Preview). Reports its height to the parent so the iframe auto-sizes.
 * `minH` reserves room so opened overlays aren't clipped by the frame.
 */
export function EmbedFrame({ minH, children }: { minH: number; children: ReactNode }) {
  useEffect(() => {
    const report = () => {
      const h = Math.ceil(document.documentElement.getBoundingClientRect().height);
      window.parent.postMessage({ vsp: 'frame-h', h }, '*');
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(document.documentElement);
    let n = 0;
    const t = window.setInterval(() => {
      report();
      if (++n > 20) window.clearInterval(t);
    }, 400);
    return () => {
      ro.disconnect();
      window.clearInterval(t);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: minH,
        padding: '28px 24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      {children}
    </div>
  );
}
