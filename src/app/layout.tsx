import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/store/advanced/toaster";
import { SplashManager } from "@/components/store/providers/splash-manager";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transforme sua Consultoria | RepTrail Gestão de Alunos",
  description: "Aumente a retenção dos seus alunos e simplifique sua gestão com o RepTrail. A plataforma mais completa para personal trainers e consultorias de alta performance.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RepTrail",
  },
  icons: {
    icon: '/icon.jpg',
    apple: '/icon.jpg',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

import { QueryProvider } from "@/components/store/providers/query-provider";
import NextTopLoader from 'nextjs-toploader';
import FacebookPixel from "@/lib/meta-pixel";
import { ShineManager } from "@/components/store/providers/shine-manager";
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning {...{ className: "dark", style: { colorScheme: "dark" } }} data-scroll-behavior="smooth">
      <head>
        {/* Hotjar & Contentsquare Tracking Codes */}
        <Script id="hotjar-setup" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:781788,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
        <Script src="https://t.contentsquare.net/uxa/ae89ba1e10417.js" strategy="afterInteractive" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950`}
        suppressHydrationWarning
        data-scroll-behavior="smooth"
      >
        <ShineManager />
        {/* eslint-disable-next-line no-restricted-syntax */}
        <NextTopLoader color="var(--primary-dynamic, #f97316)" showSpinner={false} shadow="0 0 10px var(--primary-dynamic, #f97316), 0 0 5px var(--primary-dynamic, #f97316)" zIndex={1600} />
        <FacebookPixel />
        <QueryProvider>
          <SplashManager>
            {children}
          </SplashManager>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
