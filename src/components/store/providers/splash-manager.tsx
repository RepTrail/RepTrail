'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import { useState, useEffect } from 'react'
import { SplashScreen } from '@/components/store/advanced/splash-screen'
import { usePathname } from 'next/navigation'
import { Box } from '@/components/store/base/box'

interface SplashManagerProps {
    children: React.ReactNode
}

export function SplashManager({ children }: SplashManagerProps) {
    const [view, setView] = useState<'none' | 'splash' | 'ready'>('none')
    const pathname = usePathname()

    const getSplashColor = (): 'emerald' | 'amber' | 'red' | 'orange' => {
        if (pathname.includes('/admin')) return 'red'
        if (pathname.includes('/affiliate')) return 'amber'
        if (pathname.includes('/personal')) return 'emerald'
        if (pathname.includes('/student')) return 'orange'
        return 'emerald' // Default
    }

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
                <Box position="fixed" inset={0} bg={STORE_TOKENS.COLORS.BLACK} pointerEvents="none" style={{ zIndex: 9999 }} />
                <Box opacity={STORE_TOKENS.OPACITY.NONE}>{children}</Box>
            </>
        );
    }

    // 2. Splash state: Show animation.
    // Optimization: In standalone (PWA) mode, we DON'T render children behind the splash 
    // to prevent heavy background loading (like videos) which cause iOS crashes.
    if (view === 'splash') {
        const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
        return (
            <>
                <SplashScreen
                    color={getSplashColor()}
                    onFinish={() => setView('ready')}
                />
                {!isStandalone && children}
            </>
        )
    }

    // 3. Ready: Full content
    return <>{children}</>
}
