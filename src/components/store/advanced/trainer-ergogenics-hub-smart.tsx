'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { LayoutDashboard } from 'lucide-react'

import React from 'react'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerErgogenicStudents } from '@/lib/dal/remote'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { TrainerErgogenicsHubSectionContent } from '@/components/store/sections/trainer-ergogenics-hub-section-content'

interface TrainerErgogenicsHubSmartProps {
    userId: string
}

/**
 * TrainerErgogenicsHubSmart
 * Lists students with ergogenic protocols enabled (trainer hub).
 */
export function TrainerErgogenicsHubSmart({ userId }: TrainerErgogenicsHubSmartProps) {
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
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={LayoutDashboard} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Section"}</Font>
                    </Inline>
                    
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
            <TrainerErgogenicsHubSectionContent students={students} />
          </Stack>
        </Stack>
    )
}
