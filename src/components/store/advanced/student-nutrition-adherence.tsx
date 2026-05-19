'use client'

import React, { useMemo } from 'react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { DietAdherenceCard } from '@/components/store/advanced/diet-adherence-card'
import { Utensils } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentDailyDiet } from '@/actions/diet-actions'
import { toggleMealItem, toggleMealGroup } from '@/actions/tracking-actions'
import { Box } from '@/components/store/base/box'

interface StudentNutritionAdherenceProps {
    userId: string
}

/**
 * StudentNutritionAdherence (Smart): Manages diet adherence and macros.
 * Now supports granular item tracking and dynamic progress.
 */
export function StudentNutritionAdherence({ userId }: StudentNutritionAdherenceProps) {
    const queryClient = useQueryClient()

    const { data: diet, isLoading } = useQuery({
        queryKey: QUERY_KEYS.diets.today(userId),
        queryFn: () => getStudentDailyDiet(userId),
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
    })

    const mealMutation = useMutation({
        mutationFn: ({ mealId, currentStatus }: { mealId: string, currentStatus: boolean }) => 
            toggleMealGroup(mealId, !currentStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.diets.today(userId) })
        }
    })

    const itemMutation = useMutation({
        mutationFn: ({ itemId, currentStatus }: { itemId: string, currentStatus: boolean }) => 
            toggleMealItem(itemId, !currentStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.diets.today(userId) })
        }
    })

    const stats = useMemo(() => {
        if (!diet || !diet.meals) return null

        const allItems = diet.meals.flatMap((m: any) => m.meal_items || [])
        const totalItems = allItems.length
        const completedItems = allItems.filter((i: any) => i.is_checked).length
        
        // Macros calculation
        const totals = diet.meals.reduce((acc: any, meal: any) => {
            const items = meal.meal_items || []
            return {
                p: acc.p + items.reduce((s: any, i: any) => s + (i.is_substituted ? (i.substituted_protein || 0) : (i.protein || 0)), 0),
                c: acc.c + items.reduce((s: any, i: any) => s + (i.is_substituted ? (i.substituted_carbs || 0) : (i.carbs || 0)), 0),
                g: acc.g + items.reduce((s: any, i: any) => s + (i.is_substituted ? (i.substituted_fat || 0) : (i.fat || 0)), 0),
                f: acc.f + items.reduce((s: any, i: any) => s + (i.is_substituted ? (i.substituted_fiber || 0) : (i.fiber || 0)), 0),
            }
        }, { p: 0, c: 0, g: 0, f: 0 })

        const calories = (totals.p * 4) + (totals.c * 4) + (totals.g * 9)

        return {
            totalItems: totalItems, // Dynamic progress per item
            completedItems: completedItems,
            percentage: totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
            macros: {
                calories,
                protein: totals.p,
                carbs: totals.c,
                fat: totals.g,
                fiber: totals.f
            }
        }
    }, [diet])

    if (isLoading) return <RegistrySection title="DIETA DE HOJE" icon={Utensils}><Box className="animate-pulse h-64 bg-zinc-900/50 rounded-3xl" /></RegistrySection>

    if (!diet || !stats) {
        return (
            <RegistrySection title="DIETA DE HOJE" icon={Utensils}>
                <DietAdherenceCard
                    completedItems={0}
                    totalItems={0}
                    percentage={0}
                    macros={{ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }}
                    meals={[]}
                    status="empty"
                />
            </RegistrySection>
        )
    }

    return (
        <RegistrySection
            title="DIETA DE HOJE"
            subtitle="Acompanhamento nutricional e macros."
            icon={Utensils}
        >
            <DietAdherenceCard
                completedItems={stats.completedItems}
                totalItems={stats.totalItems}
                percentage={stats.percentage}
                macros={stats.macros}
                meals={diet.meals}
                onToggleMeal={(mealId, currentStatus) => mealMutation.mutate({ mealId, currentStatus })}
                onToggleItem={(itemId, currentStatus) => itemMutation.mutate({ itemId, currentStatus })}
                status="active"
            />
        </RegistrySection>
    )
}
