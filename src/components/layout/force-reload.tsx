'use client'

import { useEffect } from 'react'

const APP_VERSION = 'v1.0.1' // Change this string to bust cache and force reload

export function ForceReload() {
    useEffect(() => {
        const storedVersion = localStorage.getItem('app-version')
        if (storedVersion !== APP_VERSION) {
            localStorage.setItem('app-version', APP_VERSION)
            window.location.reload() // Force a hard reload
        }
    }, [])

    return null
}
