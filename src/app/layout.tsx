import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PWAClient } from "@/components/layout/pwa-client";
import { SplashManager } from "@/components/layout/splash-manager";
import { ImpersonationBar } from "@/components/feature/admin/impersonation-bar";

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
  userScalable: false,
};

import { QueryProvider } from "@/components/providers/query-provider";
import NextTopLoader from 'nextjs-toploader';
import FacebookPixel from "@/lib/meta-pixel";
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark" style={{ colorScheme: 'dark' }} data-scroll-behavior="smooth">
      <head>
        {/* Contentsquare (Hotjar) Tracking Code */}
        <Script src="https://t.contentsquare.net/uxa/ae89ba1e10417.js" strategy="afterInteractive" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950`}
        suppressHydrationWarning
        data-scroll-behavior="smooth"
      >
        <ImpersonationBar />
        <NextTopLoader color="#f97316" showSpinner={false} shadow="0 0 10px #f97316,0 0 5px #f97316" zIndex={1600} />
        <FacebookPixel />
        <QueryProvider>
          <SplashManager>
            {children}
          </SplashManager>
        </QueryProvider>
        <Toaster />
        <PWAClient />
      </body>
    </html>
  );
}
