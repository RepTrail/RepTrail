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
        return <DietCardSkeleton />
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

export function DietCardSkeleton() {
    return <DietAdherence.Skeleton />
}

DietCard.Skeleton = DietCardSkeleton

