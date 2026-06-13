import Link from 'next/link';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        maxWidth: 720,
        margin: '0 auto',
        padding: '120px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--r-md)',
          margin: '0 auto 24px',
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(140deg, var(--accent), var(--accent-2))',
          color: '#fff',
          fontWeight: 800,
          fontSize: 26,
        }}
      >
        V
      </div>
      <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
        Vespera
      </h1>
      <p style={{ fontSize: 17, color: 'var(--text-dim)', margin: '0 0 28px', lineHeight: 1.6 }}>
        A deep-space, weightless design system — framework-agnostic CSS, themed entirely through CSS
        variables on <code style={{ fontFamily: 'var(--font-mono)' }}>.vsp-root</code>.
      </p>
      <Link href="/docs" className="btn btn-primary">
        Read the docs →
      </Link>
    </main>
  );
}
