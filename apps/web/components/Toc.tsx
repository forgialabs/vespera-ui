'use client';
import { useEffect, useState } from 'react';

interface Item {
  id: string;
  text: string;
  depth: number;
}

/** On-this-page nav, built from the rendered article headings (with scrollspy). */
export function Toc() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState('');

  useEffect(() => {
    const heads = Array.from(
      document.querySelectorAll<HTMLElement>('.vsp-doc-prose h2[id], .vsp-doc-prose h3[id]'),
    );
    const list = heads.map((h) => ({
      id: h.id,
      text: h.textContent ?? '',
      depth: h.tagName === 'H2' ? 2 : 3,
    }));
    setItems(list);
    if (!list.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive((e.target as HTMLElement).id);
      },
      { rootMargin: '0px 0px -72% 0px', threshold: 0 },
    );
    heads.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, []);

  if (!items.length) return <div />;

  return (
    <nav aria-label="On this page" style={{ position: 'sticky', top: 80, alignSelf: 'start', fontSize: 12.5 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>
        On this page
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((i) => {
          const on = active === i.id;
          return (
            <li key={i.id} style={{ paddingLeft: (i.depth - 2) * 12 }}>
              <a
                href={`#${i.id}`}
                style={{
                  textDecoration: 'none',
                  color: on ? 'var(--accent)' : 'var(--text-dim)',
                  fontWeight: on ? 600 : 400,
                }}
              >
                {i.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
