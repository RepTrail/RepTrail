'use client'

import { useQuery } from '@tanstack/react-query'
import { getStudentDailyDiet } from '@/actions/diet-actions'
import { Skeleton } from '@/components/ui/skeleton'
import { Utensils } from 'lucide-react'
import { DietAdherence } from '@/components/feature/student/diet-adherence'

import { QUERY_KEYS } from '@/lib/query-keys'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'

interface DietCardProps {
    userId: string
    hasTrainer: boolean
}

export function DietCard({ userId, hasTrainer }: DietCardProps) {
    // Realtime Sync for Diet and Meal Logs
    useRealtimeSync({
        table: 'assigned_diets',
        queryKey: QUERY_KEYS.diets.today(userId),
        filter: `student_id=eq.${userId}`
    })

    useRealtimeSync({
        table: 'meal_item_logs',
        queryKey: QUERY_KEYS.diets.today(userId), 
        filter: `user_id=eq.${userId}`
    })


    const { data: diet, isLoading } = useQuery({
        queryKey: QUERY_KEYS.diets.today(userId),
        queryFn: () => getStudentDailyDiet(userId),
        enabled: !!userId,
    })

    // Skeleton Fallback: Only if loading AND no cache available
    if (isLoading && !diet) {
        return (
            <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-2xl border-t-zinc-700/10 rounded-3xl p-6 sm:p-6 space-y-8 min-h-[500px] animate-pulse">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Utensils className="w-4 h-4 text-zinc-800" />
                                <Skeleton className="h-5 w-32 bg-zinc-800/50" />
                            </div>
                            <Skeleton className="h-3 w-40 bg-zinc-800/50" />
                        </div>
                        <Skeleton className="h-8 w-12 rounded-lg bg-zinc-800/50" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-full bg-zinc-800/50" />
                </div>

                <div className="grid grid-cols-6 gap-3 p-4 bg-zinc-950/30 border border-zinc-800/50 rounded-3xl">
                    <div className="h-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50 col-span-3 sm:col-span-2" />
                    <div className="h-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50 col-span-3 sm:col-span-2" />
                    <div className="h-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50 col-span-3 sm:col-span-2" />
                    <div className="h-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50 col-span-3 sm:col-span-3" />
                    <div className="h-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50 col-span-6 sm:col-span-3" />
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-zinc-950/20 border border-zinc-900">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-10 h-10 rounded-2xl bg-zinc-800/50" />
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-24 bg-zinc-800/50" />
                                    <Skeleton className="h-2 w-32 bg-zinc-800/50" />
                                </div>
                            </div>
                            <Skeleton className="w-5 h-5 rounded-full bg-zinc-800/50" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (!diet) {
        return (
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-6 sm:p-10 text-center space-y-3">
                <Utensils className="w-8 h-8 text-zinc-700 mx-auto" />
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                    {hasTrainer ? 'Seu personal ainda não enviou sua dieta.' : 'Você ainda não criou sua dieta.'}
                </p>
            </div>
        )
    }

    return <DietAdherence diet={diet} hasTrainer={hasTrainer} />
}
