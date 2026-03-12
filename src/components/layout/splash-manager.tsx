'use client'

import { useState, useEffect } from 'react'
import { SplashScreen } from '@/components/feature/shared/splash-screen'

interface SplashManagerProps {
    children: React.ReactNode
}

export function SplashManager({ children }: SplashManagerProps) {
    const [view, setView] = useState<'none' | 'splash' | 'ready'>('none')

    useEffect(() => {
        // Detect environment and session status
        const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
        const isPWAUrl = typeof window !== 'undefined' && window.location.search.includes('source=pwa')
        const hasSeenSplash = typeof window !== 'undefined' && sessionStorage.getItem('reptrail_splash_seen')

        // If it's PWA or first time in session
        if (isStandalone || isPWAUrl || !hasSeenSplash) {
            setView('splash')
            sessionStorage.setItem('reptrail_splash_seen', 'true')
        } else {
            setView('ready')
        }
    }, [])

    // 1. Initial state: Render black screen, but with pointer-events-none just in case of hydration lag
    if (view === 'none') {
        return (
            <>
                <div className="fixed inset-0 bg-black z-[9999] pointer-events-none" />
                <div className="opacity-0">{children}</div>
            </>
        )
    }

    // 2. Splash state: Show animation.
    // Optimization: In standalone (PWA) mode, we DON'T render children behind the splash 
    // to prevent heavy background loading (like videos) which cause iOS crashes.
    if (view === 'splash') {
        const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
        return (
            <>
                <SplashScreen onFinish={() => setView('ready')} />
                {!isStandalone && children}
            </>
        )
    }

    // 3. Ready: Full content
    return <>{children}</>
}
