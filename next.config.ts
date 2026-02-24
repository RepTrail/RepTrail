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
  serverExternalPackages: ['pdf-parse'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.com https://checkout.stripe.com https://b.stripecdn.com https://m.stripe.network https://hcaptcha.com https://*.hcaptcha.com blob: 'wasm-unsafe-eval'; script-src-elem 'self' 'unsafe-inline' https://js.stripe.com https://m.stripe.com https://checkout.stripe.com https://b.stripecdn.com https://m.stripe.network https://hcaptcha.com https://*.hcaptcha.com blob:; frame-src 'self' https://js.stripe.com https://m.stripe.com https://checkout.stripe.com https://hcaptcha.com https://*.hcaptcha.com https://m.stripe.network; connect-src 'self' https://api.stripe.com https://m.stripe.com https://checkout.stripe.com https://hcaptcha.com https://*.hcaptcha.com https://*.supabase.co https://m.stripe.network; style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com https://m.stripe.network; font-src 'self' data: https://hcaptcha.com https://*.hcaptcha.com; img-src 'self' data: blob: https://*.supabase.co https://*.stripe.com https://hcaptcha.com https://*.hcaptcha.com; worker-src 'self' blob:;`
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
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(self "https://js.stripe.com" "https://checkout.stripe.com")'
          }
        ],
      },
    ]
  },
};

export default nextConfig;
