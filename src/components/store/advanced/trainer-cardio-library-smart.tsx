'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getCardioLibrary } from '@/actions/cardio-actions'
import { getTrainerStudents } from '@/actions/trainer-actions'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { RegistrySection } from '@/components/store/advanced/registry-section'
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
        <RegistrySection>
            <CardioManagementSectionContent
                userId={userId}
                cardios={cardios}
                students={students}
                mode="trainer"
            />
        </RegistrySection>
    )
}
