'use client'

import { use } from 'react'
import { WorkoutPlayer } from '@/components/feature/player/workout-player'
import { notFound } from 'next/navigation'
import { Dumbbell, Loader2 } from 'lucide-react'
import { MissionCompletedView } from '@/components/feature/student/mission-completed'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getWorkoutDetails } from '@/actions/workout-actions'
import { getActiveWorkoutSession, getWorkoutStatus } from '@/actions/log-actions'

export default function WorkoutPlayerClient({ 
    userId, 
    workoutId 
}: { 
    userId: string, 
    workoutId: string 
}) {
    // ─── DATA FETCHING (LOCAL-FIRST ELITE) ───────────────────────────────────
    // These use the hydrated cache from the server (0ms execution)
    
    // 1. Fetch Workout & Exercises
    const { data: workoutData, isLoading: workoutLoading } = useQuery({
        queryKey: QUERY_KEYS.workouts.detail(workoutId),
        queryFn: () => getWorkoutDetails(workoutId),
        enabled: !!workoutId
    })

    // 2. Check logs (Today's completion and Active session)
    const { data: logsStatus, isLoading: logsLoading } = useQuery({
        queryKey: QUERY_KEYS.workouts.status(userId, workoutId),
        queryFn: () => getWorkoutStatus(userId, workoutId),
        enabled: !!userId
    })

    const { data: activeSession, isLoading: activeLoading } = useQuery({
        queryKey: QUERY_KEYS.student.activeSession(userId),
        queryFn: () => getActiveWorkoutSession(),
        enabled: !!userId
    })

    // 🚨 ELITE: If data is cached, this resolves in 0ms. 
    // If not, we show a Skeleton instead of a center spinner.
    if (workoutLoading || logsLoading || activeLoading) {
        return <PlayerSkeleton />
    }

    if (!workoutData) return notFound()

    const workout = workoutData
    const exercises = workoutData.workout_exercises || []

    if (exercises.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-4">
                <div className="p-6 bg-zinc-900 rounded-full border border-zinc-800">
                    <Dumbbell className="h-10 w-10 text-zinc-700" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white uppercase italic">Sem exercícios</h3>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-[300px]">
                        Este treino ainda não possui exercícios cadastrados.
                    </p>
                </div>
            </div>
        )
    }

    // 3. Handle Already Completed Today
    if (logsStatus?.status === 'completed') {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
                <MissionCompletedView />
            </div>
        )
    }

    // 4. Resume Logic (Calculated Client-side)
    let initialExerciseIndex = 0
    let initialLogId: string | undefined = undefined
    let initialSet = 1
    let initialSetType: 'WARMUP' | 'FEEDER' | 'WORKING' | undefined = undefined
    let initialIsResting = false
    let initialRestEndTime: number | undefined = undefined

    // Resume from active session if it matches this workout
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
        <div className="min-h-screen bg-zinc-950 flex flex-col">
            <div className="bg-black/40 backdrop-blur-xl border-b border-zinc-800/50 p-4 sm:p-6 flex items-center justify-between sticky top-0 z-50">
                <div className="space-y-1 sm:space-y-5">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <h1 className="text-xl font-black text-white uppercase italic tracking-tight truncate max-w-[60vw]">{workout.name}</h1>
                    </div>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-none">
                        Player de Treino • Foco e Intensidade
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 rounded-xl border border-zinc-800/50 flex-shrink-0 ml-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">Em progresso</span>
                </div>
            </div>

            <div className="flex-1 p-4 md:p-8 flex flex-col">
                <div className="max-w-xl mx-auto w-full flex-1">
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
                    />
                </div>
            </div>
        </div>
    )
}

function PlayerSkeleton() {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col animate-pulse">
            <div className="h-20 bg-zinc-900/50 border-b border-zinc-800/50 p-6 flex justify-between items-center" />
            <div className="flex-1 p-8 space-y-8 max-w-xl mx-auto w-full">
                <div className="h-8 bg-zinc-900/50 rounded-xl w-48" />
                <div className="h-64 bg-zinc-900/50 rounded-[2.5rem]" />
                <div className="h-24 bg-zinc-900/50 rounded-3xl" />
                <div className="h-20 bg-zinc-900/50 rounded-3xl" />
            </div>
        </div>
    )
}
