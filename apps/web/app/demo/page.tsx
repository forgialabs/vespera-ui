import './demo.css';
import type { Metadata } from 'next';
import { Playground } from '@/components/Playground';
import { FrameworkShowcase } from '@/components/FrameworkShowcase';

export const metadata: Metadata = {
  title: 'Interactive playground',
  description: 'Every Vespera component on one page — click, toggle, and theme it live.',
};

// React = the live Playground island (owns its own .vsp-root + theme controls);
// Angular = the equivalent Storybook showcase embedded in a frame.
export default function DemoPage() {
  return (
    <FrameworkShowcase story="showcase--playground">
      <Playground />
    </FrameworkShowcase>
  );
}
