import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: 'standing-vole-856.eu-west-1.convex.cloud',
      },
      {
        protocol: 'https',
        hostname: 'grateful-squirrel-881.eu-west-1.convex.cloud',
      },
    ],
  },
};

export default nextConfig;
