'use client';
import { useEffect, useMemo, useState } from 'react';
import manifest from '@manifest/stories.json';
import {
  FRAMEWORKS,
  buildEmbedSrc,
  frameworkAvailability,
  type FrameworkId,
  type StoriesManifest,
  type ThemeState,
} from '@/lib/framework-preview';

const STORIES = manifest as StoriesManifest;
const DEFAULT_THEME: ThemeState = { theme: 'dark', density: 'comfortable', corners: 'round' };

interface Props {
  /** Storybook title, e.g. "Primitives/Button". */
  component: string;
  /** Story export name, e.g. "Variants". */
  story: string;
  /** Which framework tab is active initially (default: react). */
  defaultFramework?: FrameworkId;
  /** Source shown under the Code tab (author-provided in Phase 0). */
  code?: string;
}

export function FrameworkPreview({ component, story, defaultFramework = 'react', code }: Props) {
  const availability = useMemo(
    () => frameworkAvailability(STORIES, component, story),
    [component, story],
  );
  const [fw, setFw] = useState<FrameworkId>(defaultFramework);
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const storyId = availability[fw];

  // Auto-size the iframe from the story's height messages.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { vsp?: string; h?: number } | null;
      if (!d || d.vsp !== 'frame-h' || typeof d.h !== 'number') return;
      document.querySelectorAll<HTMLIFrameElement>('iframe.vsp-fw-frame').forEach((f) => {
        if (f.contentWindow === e.source) f.style.height = `${d.h}px`;
      });
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  return (
    <div className="vsp-pv vsp-fw">
      <div className="vsp-fw-bar" role="tablist" aria-label="Framework">
        {FRAMEWORKS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={fw === f.id}
            data-on={fw === f.id}
            disabled={!availability[f.id]}
            onClick={() => setFw(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
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
      {tab === 'code' && code ? (
        <pre className="vsp-pv-code">
          <code>{code}</code>
        </pre>
      ) : storyId ? (
        <iframe
          className="vsp-pv-frame vsp-fw-frame"
          src={buildEmbedSrc(basePath, fw, storyId, DEFAULT_THEME)}
          title={`${component} — ${fw}`}
          loading="lazy"
        />
      ) : (
        <div className="vsp-fw-empty">
          This component is not yet available in {fw}. Try another framework tab.
        </div>
      )}
    </div>
  );
}
