'use client'

import { useEffect } from 'react'
import { generateTrainerCode } from '@/actions/code-actions'

export function CodeAutoGenerator({ hasCode }: { hasCode: boolean }) {
    useEffect(() => {
        if (!hasCode) {
            generateTrainerCode()
        }
    }, [hasCode])

    return null
}
