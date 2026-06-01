'use client'

import { useEffect } from 'react'
import { actions } from '@/lib/dal'

export function CodeAutoGenerator({ hasCode }: { hasCode: boolean }) {
    useEffect(() => {
        if (!hasCode) {
            actions.generateTrainerCode()
        }
    }, [hasCode])

    return null
}
