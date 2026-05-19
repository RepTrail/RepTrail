'use client'

import React, { useState } from 'react'
import { WorkoutPlayer } from '@/components/store/advanced/workout-player'
import { notFound } from 'next/navigation'
import { Dumbbell, Activity, ArrowLeft } from 'lucide-react'
import { MissionCompletedView } from '@/components/store/advanced/student-mission-completed'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getWorkoutDetails } from '@/actions/workout-actions'
import { getActiveWorkoutSession, getWorkoutStatus } from '@/actions/log-actions'
import Link from 'next/link'

// Design System Primitives
import { Surface } from '@/components/store/base/surface'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Badge } from '@/components/store/base/badge'
import { Icon } from '@/components/store/base/icon'
import { Scaffold } from '@/components/store/base/main'
import { Button } from '@/components/store/base/button'
import { BackgroundEffects } from '@/components/store/base/background-effects'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export default function WorkoutPlayerClient({
    userId,
    workoutId,
    isForced = false
}: {
    userId: string,
    workoutId: string,
    isForced?: boolean
}) {
    // ─── DATA FETCHING (LOCAL-FIRST ELITE) ───────────────────────────────────
    const { data: workoutData, isLoading: workoutLoading } = useQuery({
        queryKey: QUERY_KEYS.workouts.detail(workoutId),
        queryFn: () => getWorkoutDetails(workoutId),
        enabled: !!workoutId
    })

    const { data: logsStatus, isLoading: logsLoading } = useQuery({
        queryKey: QUERY_KEYS.workouts.status(userId, workoutId),
        queryFn: () => getWorkoutStatus(userId, workoutId),
        enabled: !!userId
    })

    const { data: activeSession, isLoading: activeLoading } = useQuery({
        queryKey: QUERY_KEYS.workouts.session,
        queryFn: () => getActiveWorkoutSession(),
        enabled: !!userId
    })

    const [isResting, setIsResting] = useState(false)

    if (workoutLoading || logsLoading || activeLoading) {
        return null
    }

    if (!workoutData) return notFound()

    const workout = workoutData
    const exercises = workoutData.workout_exercises || []

    if (exercises.length === 0) {
        return (
            <Box display="flex" align="center" justify="center" minHeight="screen" width="full">
                <BackgroundEffects variant="all" />
                <Stack align="center" justify="center" gap={STORE_TOKENS.SPACING.CONTAINER} position="relative" zIndex={10} padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <Surface variant="glass" padding={5} rounded="full" border="standard">
                        <Box>
                            <Icon icon={Dumbbell} size="lg" color="zinc-700" />
                        </Box>
                    </Surface>
                    <Stack gap={2.5} align="center">
                        <Font variant="h3" weight="black" uppercase italic tracking="tight">Sem exercícios</Font>
                        <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase tracking="widest" align="center" style={{ maxWidth: '300px' }}>
                            Este treino ainda não possui exercícios cadastrados.
                        </Font>
                    </Stack>
                </Stack>
            </Box>
        )
    }

    if (logsStatus?.status === 'completed' && !isForced) {
        return (
            <Box display="flex" align="center" justify="center" minHeight="screen" width="full">
                <BackgroundEffects variant="all" />
                <Box position="relative" zIndex={10} width="full" padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <MissionCompletedView />
                </Box>
            </Box>
        )
    }

    let initialExerciseIndex = 0
    let initialLogId: string | undefined = undefined
    let initialSet = 1
    let initialSetType: 'WARMUP' | 'FEEDER' | 'WORKING' | undefined = undefined
    let initialIsResting = false
    let initialRestEndTime: number | undefined = undefined

    if (activeSession && activeSession.workout_id === workoutId) {
        initialLogId = activeSession.id
        if (activeSession.current_state) {
            const state = activeSession.current_state as any
            initialExerciseIndex = state.exerciseIndex || 0
            initialSet = state.set || 1
            initialSetType = state.type
            initialIsResting = state.isResting || false
            initialRestEndTime = state.restEndTime
        }
    }

    return (
        <Scaffold 
            position={{ base: 'fixed', md: 'relative' }} 
            pin={{ base: 'inset', md: undefined }} 
            style={{ zIndex: 9999 }}
            minHeight="screen"
            display="flex"
            direction="col"
            bg="zinc"
            overflowY="auto"
            paddingLeft={{ base: 0, md: 'sidebar-wide' }}
        >
            {/* Background Effects: Grid & Orbs */}
            <BackgroundEffects variant="all" />

            {/* Header: Full-width sticky bar */}
            {!isResting && (
                <Box position="sticky" top={0} zIndex={50} width="full">
                    <Surface variant="glass" border="standard" padding={STORE_TOKENS.PADDING.CONTAINER} rounded="none">
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            {/* Mobile Top Bar: Badge + Back Button */}
                            <Box display={{ base: 'flex', md: 'none' }} justify="between" fullWidth direction="row" align="center">
                                <Badge 
                                    label="Em progresso" 
                                    variant="glass" 
                                    color="emerald" 
                                    icon={Activity} 
                                    animatePulse
                                />
                                <Link href="/dashboard/student" passHref>
                                    <Button variant="outline-zinc" size="sm" rounded="full">
                                        <ArrowLeft size={14} style={{ marginRight: '6px' }} />
                                        Voltar
                                    </Button>
                                </Link>
                            </Box>

                            <Stack direction="row" align="center" justify="between">
                                <Stack gap={2.5}>
                                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Box width={8} height={8} bg="emerald" rounded="full" style={{ boxShadow: '0 0 10px rgba(16,185,129,0.5)' }} />
                                        <Font variant="h3" weight="black" color="white" uppercase italic tracking="tight" truncate style={{ maxWidth: '60vw' }}>
                                            {workout.name}
                                        </Font>
                                    </Stack>
                                    <Box>
                                        <Font variant="tiny" color="zinc-500" weight="black" uppercase tracking="widest">
                                            Player de Treino • Foco e Intensidade
                                        </Font>
                                    </Box>
                                </Stack>
                                
                                {/* Desktop Badge */}
                                <Box display={{ base: 'none', md: 'block' }}>
                                    <Badge 
                                        label="Em progresso" 
                                        variant="glass" 
                                        color="emerald" 
                                        icon={Activity} 
                                        animatePulse
                                    />
                                </Box>
                            </Stack>
                        </Stack>
                    </Surface>
                </Box>
            )}

            {/* Main Player Content: Vertically Centered */}
            <Box flex1 display="flex" align={{ base: 'start', md: 'center' }} justify="center" padding={0} position="relative" zIndex={10}>
                <WorkoutPlayer
                    userId={userId}
                    workout={workout}
                    exercises={exercises}
                    initialExerciseIndex={initialExerciseIndex}
                    initialLogId={initialLogId}
                    initialSet={initialSet}
                    initialSetType={initialSetType}
                    initialIsResting={initialIsResting}
                    initialRestEndTime={initialRestEndTime}
                    onRestChange={setIsResting}
                />
            </Box>
        </Scaffold>
    )
}

