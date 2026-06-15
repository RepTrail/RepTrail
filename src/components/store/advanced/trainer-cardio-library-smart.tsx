'use client'

import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getCardioLibrary } from '@/lib/dal/remote'
import { getTrainerStudents } from '@/lib/dal/remote'
import { useRealtimeSync } from '@/lib/dal'
import { CardioManagementList } from '@/components/store/advanced/cardio-management-list'

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

            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <CardioManagementList
                    userId={userId}
                    cardios={cardios}
                    students={students}
                    mode="trainer"
                />
            </Stack>
        </Stack>
    )
}
