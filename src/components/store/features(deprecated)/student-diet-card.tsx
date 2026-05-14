'use client';
import { useQuery } from '@tanstack/react-query'
import { getStudentDailyDiet } from '@/actions/diet-actions'
import { Utensils } from 'lucide-react'
import { DietAdherence } from './student-diet-adherence'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Stack } from '@/components/store/base/stack'

import { STORE_TOKENS } from "../constants/tokens";

interface DietCardProps {
    userId: string
    hasTrainer: boolean
}

export function DietCard({ userId, hasTrainer }: DietCardProps) {
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

    if (isLoading && !diet) {
        return null
    }

    if (!diet) {
        return (
            <Box 
                bg="zinc" 
                bgOpacity={30} 
                border 
                borderColor="zinc" 
                rounded="system" 
                padding={{ base: 5, md: 10 }}
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center" textAlign="center">
                    <Utensils className="w-8 h-8 text-zinc-700" />
                    <Font variant="sub-tiny" weight="bold" color="zinc-500" uppercase tracking="widest">
                        {hasTrainer ? 'Seu personal ainda não enviou sua dieta.' : 'Você ainda não criou sua dieta.'}
                    </Font>
                </Stack>
            </Box>
        );
    }

    return <DietAdherence diet={diet} hasTrainer={hasTrainer} />
}





