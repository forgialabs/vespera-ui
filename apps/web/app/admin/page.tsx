import type { Metadata } from 'next';
import { AdminConsole } from '@/components/AdminConsole';

export const metadata: Metadata = {
  title: 'Admin console',
  description: 'A complete admin console built entirely from @vespera-ui/react.',
};

// AdminConsole owns its own .vsp-root (it manages theme/density/corners/accent live).
export default function AdminPage() {
  return <AdminConsole />;
}
