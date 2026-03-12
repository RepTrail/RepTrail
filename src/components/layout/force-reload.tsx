'use client'

import { useEffect } from 'react'

const APP_VERSION = 'v1.0.1' // Change this string to bust cache and force reload
const INACTIVE_TIMEOUT = 1000 * 60 * 15 // 15 minutes of inactivity forces reload

export function ForceReload() {
    useEffect(() => {
        // App Version handling
        const storedVersion = localStorage.getItem('app-version')
        if (storedVersion !== APP_VERSION) {
            localStorage.setItem('app-version', APP_VERSION)
            window.location.reload() // Force a hard reload
        }

        // Visibilitychange handling for iOS PWA freezing
        let lastVisibleTime = Date.now()

        const handleVisibilityChange = () => {
            if (document.hidden) {
                lastVisibleTime = Date.now() // App went to background
            } else {
                // App came to foreground
                const timeAway = Date.now() - lastVisibleTime
                if (timeAway > INACTIVE_TIMEOUT) {
                    window.location.reload() // Force a reload if away for 15+ minutes
                }
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    return null
}
