import './demo.css';
import type { Metadata } from 'next';
import { Playground } from '@/components/Playground';

export const metadata: Metadata = {
  title: 'Interactive playground',
  description: 'Every Vespera component on one page — click, toggle, and theme it live.',
};

// Playground owns its own .vsp-root (it manages theme/accent/density/corners live).
export default function DemoPage() {
  return <Playground />;
}
