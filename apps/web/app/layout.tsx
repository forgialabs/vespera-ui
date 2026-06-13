import '@vespera-ui/css';
import './global.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Vespera', template: '%s · Vespera' },
  description: 'A deep-space, weightless design system.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Each top-level surface (docs, landing, embed, admin, demo) provides its own
  // .vsp-root so it can theme independently — the admin/playground manage theme
  // live, so they own their root.
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
