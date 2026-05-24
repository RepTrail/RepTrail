'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerDiets } from '@/actions/diet-actions'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { RegistrySection } from '@/components/store/advanced/registry-section'
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
        <RegistrySection>
            <DietManagementSectionContent
                userId={userId}
                diets={diets}
                mode="trainer"
                betaTesterMode={betaTesterMode}
            />
        </RegistrySection>
    )
}
