'use client'

import React from 'react'
import { Utensils, CheckCircle, Loader2 } from 'lucide-react'
import { useStudentDailyDiet, useQueryClient } from '@/lib/dal'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Separator } from '@/components/store/base/separator'
import { FormCheckbox } from '@/components/store/base/form-checkbox'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StudentDietDailyClientProps {
    userId: string
}

export function StudentDietDailyClient({ userId }: StudentDietDailyClientProps) {
    const { data: diet, isLoading } = useStudentDailyDiet(userId)
    const todayQueryKey = QUERY_KEYS.diets.today(userId)
    const queryClient = useQueryClient()

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

    if (isLoading) {
        return (
            <RegistryMain
                title="MINHA DIETA"
                subtitle="Carregando dieta diária..."
                icon="Utensils"
                showTabs={false}
            >
                <Box display="flex" align="center" justify="center" padding={STORE_TOKENS.PADDING.CONTAINER} height="full">
                    <Icon icon={Loader2} size="md" color={STORE_TOKENS.COLORS.BRAND} animate="spin" />
                </Box>
            </RegistryMain>
        )
    }

    // Default meals structure if diet or meals not found (for demo fallback)
    const meals = diet?.meals || [
        {
            id: 'm1',
            name: 'Café da Manhã',
            time_of_day: '08:00',
            is_checked: false,
            meal_items: [
                { id: 'i1', food_name: 'Ovos Mexidos', quantity: '3 un', approx_measure: '3 ovos grandes', is_checked: false },
                { id: 'i2', food_name: 'Pão Integral', quantity: '2 fatias', approx_measure: '50g', is_checked: false }
            ]
        },
        {
            id: 'm2',
            name: 'Almoço',
            time_of_day: '12:00',
            is_checked: false,
            meal_items: [
                { id: 'i3', food_name: 'Frango Grelhado', quantity: '150g', approx_measure: '1 filé grande (palma da mão)', is_checked: false },
                { id: 'i4', food_name: 'Arroz Branco', quantity: '100g', approx_measure: '4 colheres de sopa cheias', is_checked: false },
                { id: 'i5', food_name: 'Feijão', quantity: '1 concha', approx_measure: '140g', is_checked: false }
            ]
        }
    ]

    // Calculate Progress dynamically
    const allItems = meals.flatMap((m: any) => m.meal_items || m.items || [])
    const totalItems = allItems.length
    const completedItems = allItems.filter((i: any) => i.is_checked).length
    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

    return (
        <RegistryMain
            title="MINHA DIETA"
            subtitle={diet?.name || 'Dieta do Aluno'}
            icon="Utensils"
            showTabs={false}
        >
            <Box fullWidth padding={STORE_TOKENS.PADDING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>

                    {/* Daily Progress Tracker Section */}
                    <Surface
                        variant="glass"
                        padding={STORE_TOKENS.PADDING.CONTAINER}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    >
                        <Stack direction={{ base: 'row', md: 'col' }} align="center" justify="between" gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="heading" weight="black" uppercase italic>
                                    Progresso Diário
                                </Font>
                                <Font variant="description">
                                    Acompanhe a ingestão das refeições prescritas pelo seu treinador.
                                </Font>
                            </Stack>
                            <Stack align="end" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.SUCCESS} weight="black" uppercase tracking="widest">
                                    {progress}% Concluído
                                </Font>
                                <Box 
                                    {...{ width: 128, height: 8 }} 
                                    bg={STORE_TOKENS.COLORS.BACKGROUND} 
                                    bgOpacity={STORE_TOKENS.OPACITY.SHELF} 
                                    rounded={STORE_TOKENS.RADIUS.FULL} 
                                    overflow="hidden"
                                >
                                    <Box bg={STORE_TOKENS.COLORS.SUCCESS} fullHeight rounded={STORE_TOKENS.RADIUS.FULL} style={{ width: `${progress}%` }} />
                                </Box>
                            </Stack>
                        </Stack>
                    </Surface>

                    {/* Meals List */}
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                        {meals.map((meal: any) => {
                            const mealItems = meal.meal_items || meal.items || []
                            return (
                                <Surface
                                    key={meal.id}
                                    variant="tonal-zinc"
                                    padding={STORE_TOKENS.PADDING.CONTAINER}
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                >
                                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>

                                        {/* Meal Header */}
                                        <Stack direction="row" align="center" justify="between" fullWidth>
                                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Icon icon={Utensils} color={STORE_TOKENS.COLORS.BRAND} size="md" />
                                                <Font variant="heading" weight="black" uppercase italic>
                                                    {meal.name}
                                                </Font>
                                            </Stack>
                                            {meal.time_of_day && (
                                                <Surface variant="glass" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                                                    <Font variant="auxiliary" color={STORE_TOKENS.COLORS.BRAND} weight="black" tracking="widest">
                                                        {meal.time_of_day.slice(0, 5)}
                                                    </Font>
                                                </Surface>
                                            )}
                                        </Stack>

                                        <Separator />

                                        {/* Meal Items */}
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                                            {mealItems.map((item: any) => (
                                                <Surface
                                                    key={item.id}
                                                    variant="glass"
                                                    padding={STORE_TOKENS.PADDING.ELEMENT}
                                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                                >
                                                    <Stack direction={{ base: 'row', md: 'col' }} align={{ base: 'center', md: 'start' }} justify="between" gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                                                        <FormCheckbox
                                                            label={item.food_name}
                                                            color={STORE_TOKENS.COLORS.SUCCESS}
                                                            checked={item.is_checked}
                                                            onChange={() => itemMutation.mutate({ itemId: item.id, currentStatus: item.is_checked })}
                                                        />
                                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                            <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                                                                {item.quantity}
                                                            </Font>
                                                            {item.approx_measure && (
                                                                <Surface variant="glass" padding={STORE_TOKENS.PADDING.NONE} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                                                                    <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.BRAND} weight="black" uppercase tracking="wider">
                                                                        Medida: {item.approx_measure}
                                                                    </Font>
                                                                </Surface>
                                                            )}
                                                        </Stack>
                                                    </Stack>
                                                </Surface>
                                            ))}
                                        </Stack>

                                        <Separator />

                                        {/* Action Trigger */}
                                        <Stack justify="end" direction="row" fullWidth>
                                            <Button 
                                                variant={meal.is_checked ? "outline-zinc" : "outline-emerald"} 
                                                size="sm" 
                                                shine={!meal.is_checked}
                                                onClick={() => mealMutation.mutate({ mealId: meal.id, currentStatus: meal.is_checked })}
                                            >
                                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                    <Icon icon={CheckCircle} size="xs" />
                                                    <Font variant="sub-tiny" weight="black" uppercase tracking="wider">
                                                        {meal.is_checked ? "Refeição Concluída" : "Marcar Refeição Completa"}
                                                    </Font>
                                                </Stack>
                                            </Button>
                                        </Stack>

                                    </Stack>
                                </Surface>
                            )
                        })}
                    </Stack>

                </Stack>
            </Box>
        </RegistryMain>
    )
}
