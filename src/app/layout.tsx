import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PWAClient } from "@/components/layout/pwa-client";
import { ForceReload } from "@/components/layout/force-reload";
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
  title: "RepTrail | Plataforma de Treinamento Personalizado",
  description: "Conecte-se com personal trainers profissionais e transforme seu corpo. Treinos periodizados, acompanhamento próximo e resultados garantidos.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark" style={{ colorScheme: 'dark' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950`}
        suppressHydrationWarning
      >
        <NextTopLoader color="#f97316" showSpinner={false} shadow="0 0 10px #f97316,0 0 5px #f97316" zIndex={1600} />
        <QueryProvider>
          <SplashManager>
            {children}
          </SplashManager>
        </QueryProvider>
        <ImpersonationBar />
        <Toaster />
        <PWAClient />
        <ForceReload />
      </body>
    </html>
  );
}
