'use client'

import { useQuery } from '@tanstack/react-query'
import { getCardioDetails } from '@/actions/cardio-actions'
import { CardioBuilder } from '@/components/feature/trainer/cardio-builder'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'

interface StudentCardioDetailClientProps {
    cardioId: string
    userId: string
    initialData: any
}

export function StudentCardioDetailClient({ cardioId, userId, initialData }: StudentCardioDetailClientProps) {
    // 1. Local-First synchronization
    useRealtimeSync({
        table: 'cardios',
        queryKey: QUERY_KEYS.cardio.detail(cardioId),
        filter: `id=eq.${cardioId}`
    })

    // 2. Data consumption
    const { data: cardio } = useQuery({
        queryKey: QUERY_KEYS.cardio.detail(cardioId),
        queryFn: () => getCardioDetails(cardioId),
        initialData,
        staleTime: 1000 * 60 * 5
    })

    if (!cardio) return null

    return (
        <CardioBuilder 
            cardio={cardio as any} 
            backHref="/dashboard/student/cardio" 
            canAssign={false}
        />
    )
}
