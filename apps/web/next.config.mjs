import { fileURLToPath } from 'node:url';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// Hosted at https://forgialabs.github.io/vespera-ui/ — static export under a base path.
const basePath = '/vespera-ui';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  transpilePackages: ['@vespera-ui/react', '@vespera-ui/icons'],
  turbopack: {
    root: fileURLToPath(new URL('../..', import.meta.url)),
  },
};

export default withMDX(config);
