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
import { getCardioLibrary } from '@/lib/dal/remote'
import { getTrainerStudents } from '@/lib/dal/remote'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { CardioManagementSectionContent } from '@/components/store/sections/cardio-management-section-content'

interface TrainerCardioLibrarySmartProps {
    userId: string
}

/**
 * TrainerCardioLibrarySmart
 * Mirrors StudentCardioManagementSmart (auto-training library path)
 * with trainer assignment avatars on library cards.
 */
export function TrainerCardioLibrarySmart({ userId }: TrainerCardioLibrarySmartProps) {
    const { data: cardios = [] } = useQuery({
        queryKey: QUERY_KEYS.cardio.library(userId),
        queryFn: () => getCardioLibrary(userId),
        staleTime: 1000 * 60 * 5,
    })

    const { data: students = [] } = useQuery({
        queryKey: QUERY_KEYS.trainer.students(userId),
        queryFn: () => getTrainerStudents(userId),
        staleTime: 1000 * 60 * 5,
    })

    useRealtimeSync({
        table: 'cardios',
        queryKey: QUERY_KEYS.cardio.library(userId),
        filter: `trainer_id=eq.${userId}`,
    })

    useRealtimeSync({
        table: 'assigned_cardios',
        queryKey: QUERY_KEYS.cardio.library(userId),
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
            <CardioManagementSectionContent
                userId={userId}
                cardios={cardios}
                students={students}
                mode="trainer"
            />
          </Stack>
        </Stack>
    )
}
