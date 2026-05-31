'use client'

import { useEffect } from 'react'
import { updateLastSeen } from '@/lib/dal/remote'
import { usePathname } from 'next/navigation'

export function LastSeenTracker() {
    const pathname = usePathname()

    useEffect(() => {
        // Update last seen whenever pathname changes (user is active)
        // We debounce or throttle this if needed, but simple is fine for now
        updateLastSeen()
    }, [pathname])

    return null
}
