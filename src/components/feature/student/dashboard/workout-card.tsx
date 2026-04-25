'use client'

import { getTodayWorkout } from '@/actions/workout-actions'
import { Skeleton } from '@/components/ui/skeleton'
import { Dumbbell, CheckCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { useQuery } from '@tanstack/react-query'

interface WorkoutCardProps {
    userId: string
}

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function WorkoutCard({ userId }: WorkoutCardProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Realtime Sync for Assigned Workouts and Logs
    useRealtimeSync({
        table: 'assigned_workouts',
        queryKey: QUERY_KEYS.workouts.today(userId),
        filter: `student_id=eq.${userId}`
    })

    useRealtimeSync({
        table: 'workout_logs',
        queryKey: QUERY_KEYS.workouts.all(userId),
        filter: `student_id=eq.${userId}`
    })

    const { data: workouts, isLoading: isLoadingWorkout } = useQuery<any[]>({
        queryKey: QUERY_KEYS.workouts.today(userId),
        queryFn: () => getTodayWorkout(userId),
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    // Skeleton Fallback: Only show if truly loading AND no cache available
    if (isLoadingWorkout && (!workouts || (workouts as any[]).length === 0)) {
        return <WorkoutCardSkeleton />
    }

    if (!workouts || (workouts as any[]).length === 0) {
        return (
            <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl py-12 sm:py-16 flex flex-col items-center justify-center text-center space-y-4">
                <Dumbbell className="w-8 h-8 text-zinc-700" />
                <p className="text-zinc-400 text-sm font-black uppercase tracking-tight italic">Dia de Descanso</p>
            </div>
        )
    }

    const currentWorkout = workouts[currentIndex] || workouts[0]
    const status = currentWorkout?.status || 'not_started'
    const logId = currentWorkout?.logId || null

    const nextWorkout = () => {
        setCurrentIndex((prev) => (prev + 1) % workouts.length)
    }

    const prevWorkout = () => {
        setCurrentIndex((prev) => (prev - 1 + workouts.length) % workouts.length)
    }

    const href = status === 'completed' && logId
        ? `/dashboard/student/workout-log/${logId}/review`
        : `/dashboard/student/workout/${currentWorkout.id}`

    return (
        <div className="relative group/carousel">
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
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {status === 'completed' && (
                                        <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                            <CheckCircle className="w-3 h-3" />
                                            Missão Cumprida
                                        </div>
                                    )}
                                    {status === 'in_progress' && (
                                        <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                            Em Andamento
                                        </div>
                                    )}
                                    {status === 'not_started' && (
                                        <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                                            <Sparkles className="w-3 h-3 text-orange-500" />
                                            Pronto para Treinar
                                        </div>
                                    )}
                                </div>
                                {workouts.length > 1 && (
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                        Treino {currentIndex + 1} de {workouts.length}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-3xl font-black text-white italic uppercase leading-none group-hover:text-emerald-500 transition-colors">
                                {currentWorkout.name}
                            </h3>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                {currentWorkout.workout_exercises?.length || 0} Exercícios • {status === 'completed' ? 'Treino concluído' : 'Foco do dia'}
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

            {workouts.length > 1 && (
                <>
                    <button 
                        onClick={(e) => { e.preventDefault(); prevWorkout(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all shadow-2xl z-20 group-hover/carousel:scale-110 active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={(e) => { e.preventDefault(); nextWorkout(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all shadow-2xl z-20 group-hover/carousel:scale-110 active:scale-95"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {workouts.map((_, idx) => (
                            <div 
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${idx === currentIndex ? 'w-8 bg-emerald-500' : 'w-1.5 bg-white/20'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export function WorkoutCardSkeleton() {
    return (
        <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-xl p-6 sm:p-10 rounded-3xl backdrop-blur-sm overflow-hidden relative animate-pulse">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                <Dumbbell className="w-32 h-32" />
            </div>
            <div className="relative space-y-6">
                <div className="space-y-1">
                    <Skeleton className="h-[36px] w-3/4 rounded-xl bg-zinc-800/50" />
                    <Skeleton className="h-[16px] w-48 rounded-md bg-zinc-800/50 mt-1" />
                </div>
                <Skeleton className="h-12 w-40 rounded-xl bg-zinc-800/50" />
            </div>
        </div>
    )
}

WorkoutCard.Skeleton = WorkoutCardSkeleton

