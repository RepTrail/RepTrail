'use client'

import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerDiets } from '@/lib/dal/remote'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { DietManagementSectionContent } from '@/components/store/sections/diet-management-section-content'

interface TrainerDietLibrarySmartProps {
    userId: string
    betaTesterMode?: boolean
}

/**
 * TrainerDietLibrarySmart
 * Mirrors StudentDietManagementSmart (auto-training library path)
 * with trainer assignment avatars on library cards.
 */
export function TrainerDietLibrarySmart({ userId, betaTesterMode = false }: TrainerDietLibrarySmartProps) {
    const { data: diets = [] } = useQuery({
        queryKey: QUERY_KEYS.diets.library(userId),
        queryFn: () => getTrainerDiets(userId),
        staleTime: 1000 * 60 * 5,
    })

    useRealtimeSync({
        table: 'diets',
        queryKey: QUERY_KEYS.diets.library(userId),
        filter: `trainer_id=eq.${userId}`,
    })

    useRealtimeSync({
        table: 'assigned_diets',
        queryKey: QUERY_KEYS.diets.library(userId),
    })

    return (
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>

            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <DietManagementSectionContent
                    userId={userId}
                    diets={diets}
                    mode="trainer"
                    betaTesterMode={betaTesterMode}
                />
            </Stack>
        </Stack>
    )
}
