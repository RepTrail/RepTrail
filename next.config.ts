import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xubjlkztymdaggikvzsu.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  reactCompiler: true,
  // Cloudflare Pages compatibility - remove standalone for Cloudflare Pages
  // output: 'standalone', // Remove this for Cloudflare Pages
};

export default nextConfig;
