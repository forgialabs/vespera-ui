'use client';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * Page-level React/Angular switch for the full-page showcases (/demo, /admin).
 * React renders the live React island (passed as children); Angular embeds the
 * matching Angular Storybook showcase in an auto-sizing iframe.
 */
export function FrameworkShowcase({ story, children }: { story: string; children: ReactNode }) {
  const [fw, setFw] = useState<'react' | 'angular'>('react');
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { vsp?: string; h?: number } | null;
      if (!d || d.vsp !== 'frame-h' || typeof d.h !== 'number') return;
      const h = Math.max(d.h, 480);
      document.querySelectorAll<HTMLIFrameElement>('iframe.vsp-showcase-frame').forEach((f) => {
        if (f.contentWindow === e.source) f.style.height = `${h}px`;
      });
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  return (
    <div className="vsp-showcase">
      <div className="vsp-root vsp-showcase-topbar" data-theme="dark">
        <span className="vsp-showcase-label">Rendered with</span>
        <div className="vsp-showcase-tabs" role="tablist" aria-label="Framework">
          <button
            type="button"
            role="tab"
            aria-selected={fw === 'react'}
            data-on={fw === 'react'}
            onClick={() => setFw('react')}
          >
            React
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={fw === 'angular'}
            data-on={fw === 'angular'}
            onClick={() => setFw('angular')}
          >
            Angular
          </button>
        </div>
      </div>
      {fw === 'react' ? (
        children
      ) : (
        <iframe
          className="vsp-showcase-frame"
          src={`${basePath}/sb/angular/iframe.html?id=${story}&viewMode=story&globals=theme:dark;density:comfortable;corners:round`}
          title={`${story} — angular`}
          loading="lazy"
        />
      )}
    </div>
  );
}
