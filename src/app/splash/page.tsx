'use client'

import { SplashScreen } from "@/components/feature/shared/splash-screen"

export default function SplashPage() {
    return (
        <main className="min-h-screen bg-black overflow-hidden relative" suppressHydrationWarning>
            <SplashScreen redirectHref="/" />
        </main>
    )
}
