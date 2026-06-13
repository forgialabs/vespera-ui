import { notFound } from 'next/navigation';
import { DEMOS } from '@/components/registry';
import { EmbedFrame } from '@/components/EmbedFrame';

export function generateStaticParams() {
  return Object.keys(DEMOS).map((demo) => ({ demo }));
}

export default async function EmbedPage(props: { params: Promise<{ demo: string }> }) {
  const { demo } = await props.params;
  const entry = DEMOS[demo];
  if (!entry) notFound();
  const Comp = entry.Comp;
  return (
    <EmbedFrame minH={entry.minH}>
      <Comp />
    </EmbedFrame>
  );
}
