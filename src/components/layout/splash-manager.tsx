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

    // 1. Initial state (before useEffect): Render black screen to block "Dashboard leak"
    if (view === 'none') {
        return <div className="fixed inset-0 bg-black z-[9999]" />
    }

    // 2. Splash state: Show animation, keep children hidden to save CPU/lag
    if (view === 'splash') {
        return (
            <>
                <SplashScreen onFinish={() => setView('ready')} />
                <div style={{ display: 'none' }}>{children}</div>
            </>
        )
    }

    // 3. Ready: High-fives all around
    return <>{children}</>
}
