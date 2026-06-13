import Link from 'next/link';
import { LandingShowcase } from '@/components/LandingShowcase';

const features = [
  {
    title: 'Framework-agnostic',
    body: 'The whole look lives in CSS variables on .vsp-root. Use it in React, Vue, Svelte, Angular — or plain HTML.',
  },
  {
    title: 'Themed by tokens',
    body: 'Swap theme, accent, density, and corners with data-attributes. No rebuild, no recompile.',
  },
  {
    title: 'Modular',
    body: 'Ship the whole bundle, or import just the tokens / base / shell / components you need.',
  },
  {
    title: 'AI-consumable',
    body: 'A machine-readable manifest of every component + props, so coding agents author it correctly.',
  },
];

export default function Home() {
  return (
    <main
      className="vsp-root"
      data-theme="dark"
      data-density="comfortable"
      data-corners="round"
      style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}
    >
      {/* the weightless deep-space backdrop */}
      <div className="vsp-bg" aria-hidden="true">
        <b />
        <b />
        <b />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1120,
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '22px 0',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 'var(--r-sm)',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(140deg, var(--accent), var(--accent-2))',
                color: '#fff',
                fontWeight: 800,
              }}
            >
              V
            </span>
            <b style={{ fontSize: 16, letterSpacing: '-0.01em' }}>Vespera</b>
          </span>
          <div style={{ flex: 1 }} />
          <Link href="/docs" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: 14 }}>
            Docs
          </Link>
          <Link
            href="/docs/components/overview"
            style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: 14 }}
          >
            Components
          </Link>
          <Link href="/demo" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: 14 }}>
            Playground
          </Link>
          <a
            href="https://github.com/forgialabs/vespera-ui"
            target="_blank"
            rel="noopener"
            style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: 14 }}
          >
            GitHub
          </a>
        </nav>

        {/* hero */}
        <section style={{ textAlign: 'center', padding: '60px 0 44px' }}>
          <span
            className="badge badge-info"
            style={{ display: 'inline-flex', marginBottom: 22, gap: 7 }}
          >
            <i />
            Open source · Apache-2.0 · React · Vue · Svelte · Angular
          </span>
          <h1
            style={{
              fontSize: 'clamp(40px, 7vw, 68px)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.05,
              margin: '0 0 18px',
            }}
          >
            A weightless,
            <br />
            <span
              style={{
                background: 'linear-gradient(120deg, var(--accent), var(--accent-2))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              deep-space
            </span>{' '}
            design system
          </h1>
          <p
            style={{
              fontSize: 18,
              color: 'var(--text-dim)',
              maxWidth: 600,
              margin: '0 auto 28px',
              lineHeight: 1.6,
            }}
          >
            Framework-agnostic CSS themed entirely through variables on <code>.vsp-root</code>. This
            whole site — the nav, search, and every demo below — is built with Vespera itself.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/docs" className="btn btn-primary">
              Get started →
            </Link>
            <Link href="/demo" className="btn btn-outline">
              Live playground
            </Link>
          </div>
        </section>

        {/* live showcase — floating over the glow */}
        <section style={{ paddingBottom: 80 }}>
          <div
            className="card"
            style={{
              padding: 18,
              boxShadow: 'var(--shadow-lg)',
              borderColor: 'color-mix(in oklab, var(--accent) 22%, var(--border))',
            }}
          >
            <LandingShowcase />
          </div>
        </section>

        {/* why */}
        <section style={{ paddingBottom: 72 }}>
          <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 8 }}>
            Why Vespera
          </div>
          <h2
            style={{
              textAlign: 'center',
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '0 0 32px',
            }}
          >
            One system, every framework
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            {features.map((f) => (
              <div key={f.title} className="card" style={{ padding: '20px 22px' }}>
                <b style={{ fontSize: 15, letterSpacing: '-0.01em' }}>{f.title}</b>
                <p style={{ fontSize: 13.5, color: 'var(--text-dim)', margin: '8px 0 0', lineHeight: 1.6 }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* see it in action */}
        <section style={{ paddingBottom: 96 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <Link
              href="/demo"
              className="card"
              style={{ padding: '22px 24px', textDecoration: 'none', color: 'var(--text)', display: 'block' }}
            >
              <b style={{ fontSize: 16 }}>Interactive playground →</b>
              <p style={{ fontSize: 13.5, color: 'var(--text-dim)', margin: '8px 0 0', lineHeight: 1.6 }}>
                Every component on one page — click, toggle, and theme it live.
              </p>
            </Link>
            <Link
              href="/admin"
              className="card"
              style={{ padding: '22px 24px', textDecoration: 'none', color: 'var(--text)', display: 'block' }}
            >
              <b style={{ fontSize: 16 }}>Admin console →</b>
              <p style={{ fontSize: 13.5, color: 'var(--text-dim)', margin: '8px 0 0', lineHeight: 1.6 }}>
                A full, navigable dashboard with a live theme customizer — all @vespera-ui/react.
              </p>
            </Link>
          </div>
        </section>

        {/* footer */}
        <footer
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '24px 0 40px',
            borderTop: '1px solid var(--border)',
            color: 'var(--text-faint)',
            fontSize: 13,
            flexWrap: 'wrap',
          }}
        >
          <span>Vespera · Apache-2.0</span>
          <div style={{ flex: 1 }} />
          <Link href="/docs" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
            Docs
          </Link>
          <Link href="/docs/reference/react" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>
            API
          </Link>
          <a
            href="https://github.com/forgialabs/vespera-ui"
            target="_blank"
            rel="noopener"
            style={{ color: 'var(--text-dim)', textDecoration: 'none' }}
          >
            GitHub
          </a>
        </footer>
      </div>
    </main>
  );
}
