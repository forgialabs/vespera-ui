import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Transpile the workspace React packages (they ship ESM/CJS source).
  transpilePackages: ['@vespera-ui/react', '@vespera-ui/icons'],
};

export default withMDX(config);
