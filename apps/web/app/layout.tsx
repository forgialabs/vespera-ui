import '@vespera-ui/css';
import './global.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Vespera', template: '%s · Vespera' },
  description: 'A deep-space, weightless design system.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* The whole site lives inside a themed .vsp-root — the docs are built
            with Vespera itself. */}
        <div
          className="vsp-root"
          data-theme="dark"
          data-density="comfortable"
          data-corners="round"
          style={{ minHeight: '100dvh' }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
