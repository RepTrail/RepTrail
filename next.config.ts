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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.com https://checkout.stripe.com https://b.stripecdn.com https://m.stripe.network https://hcaptcha.com https://*.hcaptcha.com https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://connect.facebook.net https://www.facebook.com https://*.asaas.com blob: 'wasm-unsafe-eval'; script-src-elem 'self' 'unsafe-inline' https://js.stripe.com https://m.stripe.com https://checkout.stripe.com https://b.stripecdn.com https://m.stripe.network https://hcaptcha.com https://*.hcaptcha.com https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://connect.facebook.net https://www.facebook.com https://*.asaas.com blob:; frame-src 'self' https://js.stripe.com https://m.stripe.com https://checkout.stripe.com https://hcaptcha.com https://*.hcaptcha.com https://m.stripe.network https://www.google.com/recaptcha/ https://www.facebook.com https://*.asaas.com; connect-src 'self' https://api.stripe.com https://m.stripe.com https://checkout.stripe.com https://hcaptcha.com https://*.hcaptcha.com https://*.supabase.co https://m.stripe.network https://www.google-analytics.com https://*.google-analytics.com https://api.asaas.com https://sandbox.asaas.com https://www.facebook.com https://*.asaas.com; style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com https://m.stripe.network; font-src 'self' data: https://hcaptcha.com https://*.hcaptcha.com; img-src 'self' data: blob: https://*.supabase.co https://*.stripe.com https://hcaptcha.com https://*.hcaptcha.com https://www.google-analytics.com https://*.asaas.com https://placehold.co https://i.pravatar.cc https://www.facebook.com; worker-src 'self' blob:;`
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
            value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com" "https://checkout.stripe.com" "https://*.asaas.com")'
          }
        ],
      },
    ]
  },
};

export default nextConfig;
