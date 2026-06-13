import Link from 'next/link';
import type { AnchorHTMLAttributes } from 'react';

/** MDX `<a>` → next/link for internal links (so basePath + trailing slash are
 * applied); a plain anchor for external/hash links. */
export function MdxLink({ href = '', ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith('/')) return <Link href={href} {...props} />;
  return <a href={href} {...props} />;
}
