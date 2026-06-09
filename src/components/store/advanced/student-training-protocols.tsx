'use client'

import React, { useState } from 'react'
import { Inline } from '@/components/store/base/layout'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { ProtocolCard } from '@/components/store/intermediary/protocol-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Dumbbell, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTodayWorkout } from '@/lib/dal/remote'
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

    if (isLoading) return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Dumbbell} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"TREINO DE HOJE"}</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Protocolos de musculação e treinamento de força."}</Font>
                    </Stack>
                </Stack>
            </Stack>
            <Box />
        </Stack>
    )

    if (!workouts || workouts.length === 0) {
        return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Dumbbell} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"TREINO DE HOJE"}</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Protocolos de musculação e treinamento de força."}</Font>
                    </Stack>
                </Stack>
            </Stack>
            <ProtocolCard
                title="DIA DE DESCANSO"
                subtitle="Nenhum protocolo de treino para hoje."
                icon={Dumbbell}
                status="empty"
            />
        </Stack>
        )
    }

    const currentWorkout = (workouts && workouts.length > 0) ? (workouts[currentIndex] || workouts[0]) : null

    if (!currentWorkout || !currentWorkout.id || !currentWorkout.name) {
        return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Dumbbell} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"TREINO DE HOJE"}</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Protocolos de musculação e treinamento de força."}</Font>
                    </Stack>
                </Stack>
            </Stack>
            <ProtocolCard
                title="DIA DE DESCANSO"
                subtitle="Nenhum protocolo de treino para hoje."
                icon={Dumbbell}
                status="empty"
            />
        </Stack>
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
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Dumbbell} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"TREINO DE HOJE"}</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Protocolos de musculação e treinamento de força."}</Font>
                    </Stack>
                    {workouts.length > 1 ? (
                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Button variant="outline-zinc" isIconOnly size="sm" onClick={prev}>
                                <Icon icon={ChevronLeft} size="xs" />
                            </Button>
                            <Button variant="outline-zinc" isIconOnly size="sm" onClick={next}>
                                <Icon icon={ChevronRight} size="xs" />
                            </Button>
                        </Stack>
                    ) : undefined}
                </Stack>
            </Stack>
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
        </Stack>
    )
}
