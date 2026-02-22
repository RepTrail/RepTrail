import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PWAClient } from "@/components/layout/pwa-client";

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
    icon: '/favicon.ico',
    apple: '/icon.jpg',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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
        {children}
        <Toaster />
        <PWAClient />
      </body>
    </html>
  );
}
