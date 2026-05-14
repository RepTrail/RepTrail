'use client'

import { SplashScreen } from "@/components/store/advanced/splash-screen"

export default function SplashPage() {
    return (
        <main className="min-h-screen bg-black overflow-hidden relative" suppressHydrationWarning>
            <SplashScreen redirectHref="/" />
        </main>
    )
}
