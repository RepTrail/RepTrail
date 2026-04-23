'use client'

import { useQuery } from '@tanstack/react-query'
import { getDietDetails } from '@/actions/diet-actions'
import dynamic from 'next/dynamic'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'

const DietBuilder = dynamic(
    () => import("@/components/feature/trainer/diet-builder").then(mod => ({ default: mod.DietBuilder })),
    { ssr: false }
)

interface StudentDietDetailClientProps {
    dietId: string
    userId: string
    initialData: any
}

export function StudentDietDetailClient({ dietId, userId, initialData }: StudentDietDetailClientProps) {
    // 1. Local-First synchronization
    useRealtimeSync({
        table: 'diets',
        queryKey: QUERY_KEYS.diets.detail(dietId),
        filter: `id=eq.${dietId}`
    })

    useRealtimeSync({
        table: 'meals',
        queryKey: QUERY_KEYS.diets.detail(dietId),
        filter: `diet_id=eq.${dietId}`
    })

    // 2. Data consumption
    const { data: diet } = useQuery({
        queryKey: QUERY_KEYS.diets.detail(dietId),
        queryFn: () => getDietDetails(dietId),
        initialData,
        staleTime: 1000 * 60 * 5
    })

    if (!diet) return null

    return (
        <DietBuilder 
            diet={diet as any} 
            backHref="/dashboard/student/diet" 
            canAssign={false}
            showAssignmentBadge={false}
        />
    )
}
