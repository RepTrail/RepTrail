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
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  reactCompiler: true,
  serverExternalPackages: ['pdf-parse'],
  cacheLife: {
    page: {
      stale: 3600,
      revalidate: 3600,
      expire: 3600,
    }
  },
  async headers() {
    // Disable strict CSP in development to avoid blocking Next.js Turbopack HMR
    if (process.env.NODE_ENV === 'development') {
      return [];
    }

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://hcaptcha.com https://*.hcaptcha.com https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://connect.facebook.net https://www.facebook.com https://*.asaas.com https://static.hotjar.com https://script.hotjar.com https://t.contentsquare.net blob: 'wasm-unsafe-eval'; script-src-elem 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://connect.facebook.net https://www.facebook.com https://*.asaas.com https://static.hotjar.com https://script.hotjar.com https://t.contentsquare.net blob:; frame-src 'self' https://hcaptcha.com https://*.hcaptcha.com https://www.google.com/recaptcha/ https://www.facebook.com https://*.asaas.com https://vars.hotjar.com https://www.youtube.com https://www.youtube-nocookie.com; connect-src 'self' https://hcaptcha.com https://*.hcaptcha.com https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://api.asaas.com https://sandbox.asaas.com https://www.facebook.com https://*.asaas.com https://*.a.run.app https://*.hotjar.com https://*.hotjar.io wss://*.hotjar.com https://*.contentsquare.net wss://*.contentsquare.net https://*.contentsquare.com wss://*.contentsquare.com; style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com; font-src 'self' data: https://hcaptcha.com https://*.hcaptcha.com; img-src 'self' data: blob: https://*.supabase.co https://hcaptcha.com https://*.hcaptcha.com https://www.google-analytics.com https://*.asaas.com https://placehold.co https://i.pravatar.cc https://www.facebook.com https://*.hotjar.com; worker-src 'self' blob:;`
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://*.asaas.com")'
          }
        ],
      },
    ]
  },
};

export default nextConfig;
