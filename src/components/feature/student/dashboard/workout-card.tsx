'use client'

import { useQuery } from '@tanstack/react-query'
import { getTodayWorkout } from '@/actions/workout-actions'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { Dumbbell, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getTodayRangeBrazil } from '@/lib/date-utils'

interface WorkoutCardProps {
    userId: string
}

export function WorkoutCard({ userId }: WorkoutCardProps) {
    const { data: workout, isLoading } = useQuery({
        queryKey: ['today-workout', userId],
        queryFn: () => getTodayWorkout(userId),
        staleTime: 1000 * 30, // 30 seconds
    })

    const { data: statusData, isLoading: isLoadingStatus } = useQuery({
        queryKey: ['workout-status', userId, workout?.id],
        enabled: !!workout,
        queryFn: async () => {
            const supabase = createClient()
            const { start, end } = getTodayRangeBrazil()

            // Check Completed
            const { data: completed } = await supabase
                .from('workout_logs')
                .select('*')
                .eq('workout_id', workout!.id)
                .eq('student_id', userId)
                .eq('status', 'completed')
                .gte('completed_at', start)
                .lte('completed_at', end)
                .order('completed_at', { ascending: false })
                .limit(1)

            if (completed && completed.length > 0) return 'completed'

            // Check In Progress
            const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
            const { data: inProgress } = await supabase
                .from('workout_logs')
                .select('*')
                .eq('workout_id', workout!.id)
                .eq('student_id', userId)
                .eq('status', 'in_progress')
                .gt('started_at', twelveHoursAgo)
                .order('started_at', { ascending: false })
                .limit(1)

            return (inProgress && inProgress.length > 0) ? 'in_progress' : 'not_started'
        }
    })

    if (isLoading || (workout && isLoadingStatus)) {
        return <Skeleton className="h-[280px] w-full rounded-[2.5rem]" />
    }

    if (!workout) {
        return (
            <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[2.5rem] py-16 flex flex-col items-center justify-center text-center space-y-4">
                <Dumbbell className="w-8 h-8 text-zinc-700" />
                <p className="text-zinc-400 text-sm font-black uppercase tracking-tight italic">Dia de Descanso</p>
            </div>
        )
    }

    return (
        <Link href={`/dashboard/student/workout/${workout.id}`}>
            <div className={`group relative p-8 rounded-[2.5rem] backdrop-blur-sm overflow-hidden transition-all duration-500 shadow-xl border cursor-pointer ${statusData === 'completed'
                ? 'bg-emerald-950/20 border-emerald-500/20'
                : statusData === 'in_progress'
                    ? 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40'
                    : 'bg-zinc-900/40 border-zinc-800/50 hover:border-emerald-500/30'
                }`}>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                    <Dumbbell className="w-32 h-32" />
                </div>
                <div className="relative space-y-6">
                    <div className="space-y-1">
                        {statusData === 'completed' && (
                            <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                <CheckCircle className="w-3 h-3" />
                                Missão Cumprida
                            </div>
                        )}
                        {statusData === 'in_progress' && (
                            <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                Em Andamento
                            </div>
                        )}
                        <h3 className="text-3xl font-black text-white italic uppercase leading-none group-hover:text-emerald-500 transition-colors">
                            {workout.name}
                        </h3>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                            {workout.exercises?.length || 0} Exercícios • {statusData === 'completed' ? 'Treino concluído' : 'Foco do dia'}
                        </p>
                    </div>

                    <Button className={`h-12 px-8 rounded-xl font-black uppercase italic tracking-wide transition-transform shadow-lg ${statusData === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'
                        : statusData === 'in_progress'
                            ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
                        }`}>
                        {statusData === 'completed' ? 'Revisar Treino' : statusData === 'in_progress' ? 'Continuar Treino' : 'Iniciar Treino'}
                    </Button>
                </div>
            </div>
        </Link>
    )
}
