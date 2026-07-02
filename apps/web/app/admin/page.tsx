import type { Metadata } from 'next';
import { AdminConsole } from '@/components/AdminConsole';
import { FrameworkShowcase } from '@/components/FrameworkShowcase';

export const metadata: Metadata = {
  title: 'Admin console',
  description: 'A complete admin console — the React island, or its Angular equivalent.',
};

// React = the live AdminConsole island; Angular = the equivalent Storybook showcase.
export default function AdminPage() {
  return (
    <FrameworkShowcase story="showcase--admin">
      <AdminConsole />
    </FrameworkShowcase>
  );
}
