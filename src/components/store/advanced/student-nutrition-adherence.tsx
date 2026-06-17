'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import React, { useMemo } from 'react'
import { DietAdherenceCard } from '@/components/store/advanced/diet-adherence-card'
import { Utensils } from 'lucide-react'
import { useQueryClient } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useStudentDailyDiet } from '@/lib/dal'
import { useOptimisticMutation } from '@/lib/dal'
import { ENTITIES } from '@/lib/outbox-db'
import { Box } from '@/components/store/base/box'
import { PremiumLockOverlay } from '@/components/store/intermediary/premium-lock-overlay'

interface StudentNutritionAdherenceProps {
    userId: string
    locked?: boolean
}

/**
 * StudentNutritionAdherence (Smart): Manages diet adherence and macros.
 * fully local-first offline-ready. Granular item tracking and dynamic sychronous progress.
 */
export function StudentNutritionAdherence({ userId, locked = false }: StudentNutritionAdherenceProps) {
    const queryClient = useQueryClient()
    const todayQueryKey = QUERY_KEYS.diets.today(userId)

    const { data: diet, isLoading } = useStudentDailyDiet(userId)

    const mealMutation = useOptimisticMutation({
        actionName: 'toggle-meal-group',
        queryKey: todayQueryKey,
        entity: ENTITIES.MEAL,
        onMutate: (variables: any) => {
            queryClient.setQueryData(todayQueryKey, (old: any) => {
                if (!old || !old.meals) return old
                return {
                    ...old,
                    meals: old.meals.map((m: any) => {
                        if (m.id === variables.mealId) {
                            const newStatus = !variables.currentStatus
                            return {
                                ...m,
                                is_checked: newStatus,
                                meal_items: (m.meal_items || []).map((i: any) => ({ ...i, is_checked: newStatus }))
                            }
                        }
                        return m
                    })
                }
            })
        }
    })

    const itemMutation = useOptimisticMutation({
        actionName: 'toggle-meal-item',
        queryKey: todayQueryKey,
        entity: ENTITIES.MEAL_ITEM,
        onMutate: (variables: any) => {
            queryClient.setQueryData(todayQueryKey, (old: any) => {
                if (!old || !old.meals) return old
                return {
                    ...old,
                    meals: old.meals.map((m: any) => {
                        const items = m.meal_items || []
                        const hasItem = items.some((i: any) => i.id === variables.itemId)
                        if (hasItem) {
                            const newItems = items.map((i: any) => {
                                if (i.id === variables.itemId) {
                                    return { ...i, is_checked: !variables.currentStatus }
                                }
                                return i
                            })
                            const allChecked = newItems.every((i: any) => i.is_checked)
                            return {
                                ...m,
                                is_checked: allChecked,
                                meal_items: newItems
                            }
                        }
                        return m
                    })
                }
            })
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

    if (isLoading) return <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={Utensils} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"DIETA DE HOJE"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Acompanhamento nutricional e macros."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <PremiumLockOverlay variant="area" locked={locked} title="Módulo de Dietas" description="O plano atual do seu personal trainer não inclui o módulo de dietas.">
                    {!locked && <Box />}
                </PremiumLockOverlay>
            </Stack>
        </Stack>

    if (!diet || !stats) {
        return (
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={Utensils} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"DIETA DE HOJE"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Acompanhamento nutricional e macros."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <PremiumLockOverlay variant="area" locked={locked} title="Módulo de Dietas" description="O plano atual do seu personal trainer não inclui o módulo de dietas.">
                    {!locked && (
                        <DietAdherenceCard
                            completedItems={0}
                            totalItems={0}
                            percentage={0}
                            macros={{ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }}
                            meals={[]}
                            status="empty"
                        />
                    )}
                </PremiumLockOverlay>
              </Stack>
        </Stack>
        )
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={Utensils} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"DIETA DE HOJE"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Acompanhamento nutricional e macros."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <PremiumLockOverlay variant="area" locked={locked} title="Módulo de Dietas" description="O plano atual do seu personal trainer não inclui o módulo de dietas.">
                    {!locked && (
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
                    )}
                </PremiumLockOverlay>
          </Stack>
        </Stack>
    )
}
