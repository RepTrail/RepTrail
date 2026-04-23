'use client'

import { getTodayWorkout } from '@/actions/workout-actions'
import { getWorkoutStatus } from '@/actions/log-actions'
import { Skeleton } from '@/components/ui/skeleton'
import { Dumbbell, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { useQuery } from '@tanstack/react-query'

interface WorkoutCardProps {
    userId: string
}

export function WorkoutCard({ userId }: WorkoutCardProps) {
    // Realtime Sync for Assigned Workouts and Logs
    useRealtimeSync({
        table: 'assigned_workouts',
        queryKey: QUERY_KEYS.workouts.today(userId),
        filter: `student_id=eq.${userId}`
    })

    useRealtimeSync({
        table: 'workout_logs',
        queryKey: QUERY_KEYS.workouts.status(userId),
        filter: `student_id=eq.${userId}`
    })

    const { data: workout, isLoading: isLoadingWorkout } = useQuery({
        queryKey: QUERY_KEYS.workouts.today(userId),
        queryFn: () => getTodayWorkout(userId),
        enabled: !!userId,
    })

    const { data: statusData, isLoading: isLoadingStatus } = useQuery({
        queryKey: QUERY_KEYS.workouts.status(userId, workout?.id),
        enabled: !!userId && !!workout,
        queryFn: () => getWorkoutStatus(userId, workout!.id),
        staleTime: 1000 * 15, // 15s stale time for status ensures optimistic data sticks
        refetchOnMount: false, // Don't refetch on mount if data is in cache
    })

    // Skeleton Fallback: Only show if truly loading AND no cache available
    if ((isLoadingWorkout || (workout && isLoadingStatus)) && !workout) {
        return (
            <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-xl p-6 sm:p-10 rounded-3xl backdrop-blur-sm overflow-hidden h-[280px] relative animate-pulse">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                    <Dumbbell className="w-32 h-32" />
                </div>
                <div className="relative space-y-8">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-3/4 rounded-xl bg-zinc-800/50" />
                        <Skeleton className="h-3 w-48 rounded-md bg-zinc-800/50" />
                    </div>
                    <Skeleton className="h-12 w-40 rounded-xl bg-zinc-800/50" />
                </div>
            </div>
        )
    }

    if (!workout) {
        return (
            <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl py-12 sm:py-16 flex flex-col items-center justify-center text-center space-y-4">
                <Dumbbell className="w-8 h-8 text-zinc-700" />
                <p className="text-zinc-400 text-sm font-black uppercase tracking-tight italic">Dia de Descanso</p>
            </div>
        )
    }

    // Sync status: Prioritize statusData, but fallback to optimistic decor on workout object
    const status = statusData?.status || (workout as any)?.status || 'not_started'
    const logId = statusData?.logId

    const href = status === 'completed' && logId
        ? `/dashboard/student/workout-log/${logId}/review`
        : `/dashboard/student/workout/${workout.id}`

    return (
        <Link href={href}>
            <div className={`group relative p-6 sm:p-10 rounded-3xl backdrop-blur-sm overflow-hidden transition-all duration-500 shadow-xl border cursor-pointer ${status === 'completed'
                ? 'bg-emerald-950/20 border-emerald-500/20'
                : status === 'in_progress'
                    ? 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40'
                    : 'bg-zinc-900/40 border-zinc-800/50 hover:border-emerald-500/30'
                }`}>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                    <Dumbbell className="w-32 h-32" />
                </div>
                <div className="relative space-y-6">
                    <div className="space-y-1">
                        {status === 'completed' && (
                            <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                <CheckCircle className="w-3 h-3" />
                                Missão Cumprida
                            </div>
                        )}
                        {status === 'in_progress' && (
                            <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                Em Andamento
                            </div>
                        )}
                        <h3 className="text-3xl font-black text-white italic uppercase leading-none group-hover:text-emerald-500 transition-colors">
                            {workout.name}
                        </h3>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                            {workout.workout_exercises?.length || 0} Exercícios • {status === 'completed' ? 'Treino concluído' : 'Foco do dia'}
                        </p>
                    </div>

                    <Button className={`h-12 px-8 rounded-xl font-black uppercase italic tracking-wide transition-transform shadow-lg ${status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'
                        : status === 'in_progress'
                            ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
                        }`}>
                        {status === 'completed' ? 'Revisar Treino' : status === 'in_progress' ? 'Continuar Treino' : 'Iniciar Treino'}
                    </Button>
                </div>
            </div>
        </Link>
    )
}
