'use client';
import { useEffect, useState, type ReactNode } from 'react';

interface PreviewProps {
  /** Registry demo key → rendered in an isolated iframe (overlays stay in-frame). */
  demo?: string;
  /** Source shown under the Code tab. */
  code?: string;
  /** Inline static content (when not using a registry demo). */
  children?: ReactNode;
}

/**
 * shadcn-style Preview / Code tabs. Interactive demos run in an isolated iframe
 * (their overlays portal to the frame's own `.vsp-root` and stay inside it);
 * static content renders inline. The iframe auto-sizes via postMessage.
 */
export function Preview({ demo, code, children }: PreviewProps) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');

  useEffect(() => {
    if (!demo) return;
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { vsp?: string; h?: number } | null;
      if (!d || d.vsp !== 'frame-h' || typeof d.h !== 'number') return;
      document.querySelectorAll<HTMLIFrameElement>('iframe.vsp-pv-frame').forEach((f) => {
        if (f.contentWindow === e.source) f.style.height = `${d.h}px`;
      });
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [demo]);

  return (
    <div className="vsp-pv">
      <div className="vsp-pv-tabs">
        <button type="button" data-on={tab === 'preview'} onClick={() => setTab('preview')}>
          Preview
        </button>
        {code ? (
          <button type="button" data-on={tab === 'code'} onClick={() => setTab('code')}>
            Code
          </button>
        ) : null}
      </div>
      {tab === 'preview' ? (
        demo ? (
          <iframe className="vsp-pv-frame" src={`/embed/${demo}`} title={`${demo} demo`} loading="lazy" />
        ) : (
          <div className="vsp-pv-stage">{children}</div>
        )
      ) : (
        <pre className="vsp-pv-code">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
