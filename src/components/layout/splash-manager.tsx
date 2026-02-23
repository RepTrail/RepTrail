'use client'

import { useState, useEffect } from 'react'
import { SplashScreen } from '@/components/feature/shared/splash-screen'

export function SplashManager() {
    const [showSplash, setShowSplash] = useState(false)

    useEffect(() => {
        // We only want to show the splash on the "Cold Boot" (first load of the JS bundle)
        // especially when in standalone mode (PWA)

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        const isPWAUrl = window.location.search.includes('source=pwa')
        const hasSeenSplash = sessionStorage.getItem('reptrail_splash_seen')

        // If it's PWA or first time in session
        if ((isStandalone || isPWAUrl || !hasSeenSplash)) {
            setShowSplash(true)
            sessionStorage.setItem('reptrail_splash_seen', 'true')
        }
    }, [])

    if (!showSplash) return null

    return (
        <SplashScreen onFinish={() => setShowSplash(false)} />
    )
}
