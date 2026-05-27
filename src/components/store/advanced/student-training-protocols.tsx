'use client'

import React, { useState } from 'react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { ProtocolCard } from '@/components/store/intermediary/protocol-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Dumbbell, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTodayWorkout } from '@/actions/workout-actions'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Box } from '@/components/store/base/box'
import { useRouter } from 'next/navigation'

interface StudentTrainingProtocolsProps {
    userId: string
}

/**
 * StudentTrainingProtocols (Smart): Manages training protocol data and carousel logic.
 * Preserves the exact query and realtime behavior of the legacy WorkoutCard.
 */
export function StudentTrainingProtocols({ userId }: StudentTrainingProtocolsProps) {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)

    // Preserve Realtime Sync
    useRealtimeSync({
        table: 'assigned_workouts',
        queryKey: QUERY_KEYS.workouts.today(userId),
        filter: `student_id=eq.${userId}`
    })

    const { data: workouts, isLoading } = useQuery<any[]>({
        queryKey: QUERY_KEYS.workouts.today(userId),
        queryFn: () => getTodayWorkout(userId),
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
    })

    if (isLoading) return <RegistrySection title="TREINO DE HOJE" subtitle="Protocolos de musculação e treinamento de força." icon={Dumbbell}><Box /></RegistrySection>

    if (!workouts || workouts.length === 0) {
        return (
            <RegistrySection title="TREINO DE HOJE" subtitle="Protocolos de musculação e treinamento de força." icon={Dumbbell}>
                <ProtocolCard
                    title="DIA DE DESCANSO"
                    subtitle="Nenhum protocolo de treino para hoje."
                    icon={Dumbbell}
                    status="empty"
                />
            </RegistrySection>
        )
    }

    const currentWorkout = (workouts && workouts.length > 0) ? (workouts[currentIndex] || workouts[0]) : null

    if (!currentWorkout || !currentWorkout.id || !currentWorkout.name) {
        return (
            <RegistrySection title="TREINO DE HOJE" subtitle="Protocolos de musculação e treinamento de força." icon={Dumbbell}>
                <ProtocolCard
                    title="DIA DE DESCANSO"
                    subtitle="Nenhum protocolo de treino para hoje."
                    icon={Dumbbell}
                    status="empty"
                />
            </RegistrySection>
        )
    }

    const status = currentWorkout.status || 'not_started'
    const logId = currentWorkout.logId || null

    const next = () => setCurrentIndex(prev => (prev + 1) % workouts.length)
    const prev = () => setCurrentIndex(prev => (prev - 1 + workouts.length) % workouts.length)

    const handleAction = () => {
        const href = (status === 'completed' && logId)
            ? `/dashboard/student/workout-log/${logId}/review`
            : `/dashboard/student/workout/${currentWorkout?.id || 'new'}`
        router.push(href)
    }

    return (
        <RegistrySection
            title="TREINO DE HOJE"
            subtitle="Protocolos de musculação e treinamento de força."
            icon={Dumbbell}
            rightElement={workouts.length > 1 ? (
                <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Button variant="outline-zinc" isIconOnly size="sm" onClick={prev}>
                        <Icon icon={ChevronLeft} size="xs" />
                    </Button>
                    <Button variant="outline-zinc" isIconOnly size="sm" onClick={next}>
                        <Icon icon={ChevronRight} size="xs" />
                    </Button>
                </Stack>
            ) : undefined}
        >
            <ProtocolCard
                title={currentWorkout.name.toUpperCase()}
                subtitle={`${currentWorkout.workout_exercises?.length || 0} EXERCÍCIOS • ${status === 'completed' ? 'CONCLUÍDO' : 'FOCO DO DIA'}`}
                icon={Dumbbell}
                status={status as any}
                logId={logId}
                userId={userId}
                workoutId={currentWorkout.id}
                onAction={handleAction}
                statusLabel={workouts.length > 1 ? `TREINO ${currentIndex + 1}/${workouts.length}` : undefined}
            />
        </RegistrySection>
    )
}
