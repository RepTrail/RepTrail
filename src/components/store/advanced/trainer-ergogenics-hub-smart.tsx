'use client'

import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerErgogenicStudents } from '@/lib/dal/remote'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { TrainerErgogenicsHubSectionContent } from '@/components/store/sections/trainer-ergogenics-hub-section-content'

interface TrainerErgogenicsHubSmartProps {
    userId: string
    hasErgogenics?: boolean
}

/**
 * TrainerErgogenicsHubSmart
 * Lists students with ergogenic protocols enabled (trainer hub).
 */
export function TrainerErgogenicsHubSmart({ userId, hasErgogenics }: TrainerErgogenicsHubSmartProps) {
    const { data: students = [] } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.hub(userId),
        queryFn: () => getTrainerErgogenicStudents(userId),
        staleTime: 1000 * 60 * 5,
    })

    useRealtimeSync({
        table: 'trainer_students',
        queryKey: QUERY_KEYS.ergogenics.hub(userId),
        filter: `trainer_id=eq.${userId}`,
    })

    useRealtimeSync({
        table: 'pending_student_links',
        queryKey: QUERY_KEYS.ergogenics.hub(userId),
        filter: `trainer_id=eq.${userId}`,
    })

    return (
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>

            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <TrainerErgogenicsHubSectionContent students={students} hasErgogenics={hasErgogenics} />
            </Stack>
        </Stack>
    )
}
