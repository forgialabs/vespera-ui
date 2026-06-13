import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page(props: Props) {
  const { slug } = await props.params;
  const page = source.getPage(slug);
  if (!page) notFound();
  const MDX = page.data.body;
  return (
    <article
      className="vsp-doc-prose"
      style={{ maxWidth: 820, margin: '0 auto', padding: '52px 36px 120px' }}
    >
      <h1>{page.data.title}</h1>
      {page.data.description ? (
        <p style={{ fontSize: 16, color: 'var(--text-dim)', marginTop: 0 }}>
          {page.data.description}
        </p>
      ) : null}
      <MDX components={getMDXComponents()} />
    </article>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const page = source.getPage(slug);
  if (!page) return {};
  return { title: page.data.title, description: page.data.description };
}
