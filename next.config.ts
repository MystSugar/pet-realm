import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Re-enable TypeScript checking but ignore Prisma generated file errors
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },
};

export default nextConfig;
