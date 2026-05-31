'use client'

import { useEffect } from 'react'
import { generateTrainerCode } from '@/lib/dal/remote'

export function CodeAutoGenerator({ hasCode }: { hasCode: boolean }) {
    useEffect(() => {
        if (!hasCode) {
            generateTrainerCode()
        }
    }, [hasCode])

    return null
}
