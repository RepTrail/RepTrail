'use client'

import { useQuery } from '@tanstack/react-query'
import { getStudentDailyDiet } from '@/actions/diet-actions'
import { Skeleton } from '@/components/ui/skeleton'
import { Utensils } from 'lucide-react'
import { DietAdherence } from '@/components/feature/student/diet-adherence'

interface DietCardProps {
    userId: string
    hasTrainer: boolean
}

export function DietCard({ userId, hasTrainer }: DietCardProps) {
    const { data: diet, isLoading } = useQuery({
        queryKey: ['daily-diet', userId],
        queryFn: () => getStudentDailyDiet(userId),
        staleTime: 1000 * 60 * 30, // 30 min
    })

    if (isLoading) {
        return <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
    }

    if (!diet) {
        return (
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] p-8 text-center space-y-3">
                <Utensils className="w-8 h-8 text-zinc-700 mx-auto" />
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                    {hasTrainer ? 'Seu personal ainda não enviou sua dieta.' : 'Você ainda não criou sua dieta.'}
                </p>
            </div>
        )
    }

    return <DietAdherence diet={diet} hasTrainer={hasTrainer} />
}
