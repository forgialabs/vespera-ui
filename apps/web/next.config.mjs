import { fileURLToPath } from 'node:url';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Transpile the workspace React packages (they ship ESM/CJS source).
  transpilePackages: ['@vespera-ui/react', '@vespera-ui/icons'],
  // Pin the workspace root (a stray lockfile above the repo confuses inference).
  turbopack: {
    root: fileURLToPath(new URL('../..', import.meta.url)),
  },
};

export default withMDX(config);
