'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@/lib/dal'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import {
    getDietDetails,
    estimateAllDietMacros
} from '@/lib/dal/remote'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import { Inline } from '@/components/store/base/layout'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Loader2, ArrowLeft, Utensils } from 'lucide-react'
import Link from 'next/link'
import { EmptyState } from '@/components/store/intermediary/empty-state'

import { DietBuilderHeader } from './diet-builder-header'
import { DietBuilderMealCard } from './diet-builder-meal-card'
import { DietBuilderNewMeal } from './diet-builder-new-meal'

interface DietBuilderSmartProps {
    diet: any
    students?: any[]
    backHref?: string
    canAssign?: boolean
    showAssignmentBadge?: boolean
    hideHeader?: boolean
    contextLabel?: string
    icon?: string
    contextColor?: string
}

export function DietBuilderSmart({
    diet: initialDiet,
    students = [],
    backHref = '/dashboard/trainer/diets',
    canAssign = true,
    showAssignmentBadge = true,
    hideHeader = false,
    contextLabel,
    icon,
    contextColor
}: DietBuilderSmartProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const queryKey = QUERY_KEYS.diets.detail(initialDiet.id)

    const { data: dietData } = useQuery({
        queryKey,
        queryFn: () => getDietDetails(initialDiet.id),
        initialData: initialDiet
    })

    const diet = dietData as { id: string; name: string; meals: any[]; assignments?: any[] }
    const meals = diet.meals || []

    // Meta editing state
    const [isEditingMeta, setIsEditingMeta] = useState(false)
    const [editName, setEditName] = useState(diet.name)
    const [isEstimatingAll, setIsEstimatingAll] = useState(false)

    // Drag state
    const [draggedMealId, setDraggedMealId] = useState<string | null>(null)
    const [draggedItemId, setDraggedItemId] = useState<{ mealId: string; itemId: string } | null>(null)

    useEffect(() => {
        if (!isEditingMeta && diet) {
            setEditName(diet.name)
        }
    }, [diet?.name, isEditingMeta])

    // ── MUTATIONS ─────────────────────────────────────────────────────────────

    const { mutate: mutateMeta } = useOptimisticMutation({
        actionName: 'update-diet-meta',
        entity: ENTITIES.DIET,
        entityId: diet.id,
        queryKey,
        mutationFn: async (variables: { id: string; name: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({ ...old, name: variables.name }))
            return { previous }
        },
        onSuccess: () => setIsEditingMeta(false)
    })

    const { mutate: addMealMutate } = useOptimisticMutation({
        actionName: 'add-meal',
        entity: ENTITIES.DIET,
        entityId: diet.id,
        queryKey,
        mutationFn: async (variables: { dietId: string; name: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({
                ...old,
                meals: [...(old?.meals || []), {
                    id: `temp-${Date.now()}`,
                    diet_id: diet.id,
                    name: variables.name,
                    time_of_day: '08:00',
                    order_index: (old?.meals?.length || 0),
                    notes: '',
                    meal_items: []
                }]
            }))
            return { previous }
        }
    })

    const { mutate: addItemMutate } = useOptimisticMutation({
        actionName: 'add-meal-item',
        entity: ENTITIES.MEAL,
        entityId: 'new',
        queryKey,
        mutationFn: async (variables: { mealId: string; dietId: string; foodId: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({
                ...old,
                meals: (old?.meals || []).map((m: any) =>
                    m.id === variables.mealId
                        ? {
                            ...m, meal_items: [...(m.meal_items || []), {
                                id: `temp-item-${Date.now()}`,
                                food_name: 'Novo Alimento',
                                quantity: '100g',
                                protein: 0, carbs: 0, fat: 0, fiber: 0
                            }]
                        }
                        : m
                )
            }))
            return { previous }
        }
    })

    const { mutate: removeMealMutate } = useOptimisticMutation({
        actionName: 'remove-meal',
        entity: ENTITIES.MEAL,
        entityId: 'remove',
        queryKey,
        mutationFn: async (variables: { id: string; dietId: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({
                ...old,
                meals: (old?.meals || []).filter((m: any) => m.id !== variables.id)
            }))
            return { previous }
        }
    })

    const { mutate: removeItemMutate } = useOptimisticMutation({
        actionName: 'remove-meal-item',
        entity: ENTITIES.MEAL_ITEM,
        entityId: 'remove',
        queryKey,
        mutationFn: async (variables: { id: string; dietId: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({
                ...old,
                meals: (old?.meals || []).map((m: any) => ({
                    ...m,
                    meal_items: (m.meal_items || []).filter((i: any) => i.id !== variables.id)
                }))
            }))
            return { previous }
        }
    })

    const { mutate: reorderMealsMutate } = useOptimisticMutation({
        actionName: 'update-meals-order',
        entity: ENTITIES.MEAL,
        entityId: diet.id,
        queryKey,
        mutationFn: async (variables: { orderedIds: string[]; dietId: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => {
                const ms = [...(old?.meals || [])]
                const sorted = variables.orderedIds.map(id => ms.find(m => m.id === id)).filter(Boolean)
                return { ...old, meals: sorted }
            })
            return { previous }
        }
    })

    const { mutate: reorderItemsMutate } = useOptimisticMutation({
        actionName: 'update-meal-items-order',
        entity: ENTITIES.MEAL_ITEM,
        entityId: 'reorder',
        queryKey,
        mutationFn: async (variables: { mealId: string; orderedIds: string[] }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({
                ...old,
                meals: (old?.meals || []).map((m: any) => {
                    if (m.id !== variables.mealId) return m
                    const items = [...(m.meal_items || [])]
                    const sorted = variables.orderedIds.map(id => items.find(i => i.id === id)).filter(Boolean)
                    return { ...m, meal_items: sorted }
                })
            }))
            return { previous }
        }
    })

    // ── HANDLERS ──────────────────────────────────────────────────────────────

    const handleMealDragStart = (e: React.DragEvent, id: string) => {
        setDraggedMealId(id)
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
    }

    const handleMealDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault()
        if (!draggedMealId || draggedMealId === targetId) return
        const draggedIndex = meals.findIndex(m => m.id === draggedMealId)
        const targetIndex = meals.findIndex(m => m.id === targetId)
        if (draggedIndex === -1 || targetIndex === -1) return
        const newMeals = [...meals]
        const [removed] = newMeals.splice(draggedIndex, 1)
        newMeals.splice(targetIndex, 0, removed)
        queryClient.setQueryData(queryKey, (old: any) => ({ ...old, meals: newMeals }))
    }

    const handleMealDragEnd = () => {
        if (!draggedMealId) return
        setDraggedMealId(null)
        reorderMealsMutate({ orderedIds: meals.map(m => m.id), dietId: diet.id })
    }

    const handleItemDragStart = (e: React.DragEvent, mealId: string, itemId: string) => {
        e.stopPropagation()
        setDraggedItemId({ mealId, itemId })
    }

    const handleItemDragOver = (e: React.DragEvent, mealId: string, targetId: string) => {
        e.preventDefault()
        if (!draggedItemId || draggedItemId.mealId !== mealId || draggedItemId.itemId === targetId) return
        const mealIndex = meals.findIndex(m => m.id === mealId)
        if (mealIndex === -1) return
        const currentItems = meals[mealIndex].meal_items || []
        const draggedIndex = currentItems.findIndex((i: any) => i.id === draggedItemId.itemId)
        const targetIndex = currentItems.findIndex((i: any) => i.id === targetId)
        if (draggedIndex === -1 || targetIndex === -1) return
        const newMeals = [...meals]
        const newItems = [...currentItems]
        const [removed] = newItems.splice(draggedIndex, 1)
        newItems.splice(targetIndex, 0, removed)
        newMeals[mealIndex] = { ...newMeals[mealIndex], meal_items: newItems }
        queryClient.setQueryData(queryKey, (old: any) => ({ ...old, meals: newMeals }))
    }

    const handleItemDragEnd = (mealId: string) => {
        if (!draggedItemId) return
        const meal = meals.find(m => m.id === mealId)
        setDraggedItemId(null)
        if (meal) {
            reorderItemsMutate({ mealId, orderedIds: (meal.meal_items || []).map((i: any) => i.id) })
        }
    }

    const handleEstimateAll = async () => {
        try {
            setIsEstimatingAll(true)
            toast({ title: 'Calculando...', description: 'A IA está analisando todos os itens da dieta.' })
            const res = await estimateAllDietMacros(diet.id)
            if (res.success) {
                toast({ title: 'Concluído!', description: 'Todos os macros foram calculados com sucesso.' })
                queryClient.invalidateQueries({ queryKey })
            } else {
                throw new Error((res as any).error)
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro', description: error.message || 'Erro ao calcular macros.' })
        } finally {
            setIsEstimatingAll(false)
        }
    }

    // Computed totals (passed down to header)
    const totals = meals.reduce((acc, meal) => {
        meal.meal_items?.forEach((item: any) => {
            acc.p += Number(item.protein) || 0
            acc.c += Number(item.carbs) || 0
            acc.f += Number(item.fat) || 0
            acc.fib += Number(item.fiber) || 0
        })
        return acc
    }, { p: 0, c: 0, f: 0, fib: 0 })

    // ── LOADING STATE ─────────────────────────────────────────────────────────
    if (!diet) {
        return (
            <Box display="flex" direction="col" align="center" justify="center" minHeight="lg" gap={STORE_TOKENS.SPACING.SECTION}>
                <Icon icon={Loader2} size="lg" color={STORE_TOKENS.COLORS.BRAND} spin />
                <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font
                        variant="heading"
                        uppercase
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                        }}>
                        Sincronizando Dados...
                    </Font>
                    <Font
                        variant="description"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                        }}>
                        Preparando o protocolo alimentar
                    </Font>
                </Stack>
            </Box>
        );
    }

    // ── RENDER ────────────────────────────────────────────────────────────────
    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
            {/* Header: name, macros bar, assign button */}
            {!hideHeader && (
                <DietBuilderHeader
                    dietId={diet.id}
                    name={diet.name}
                    isEditing={isEditingMeta}
                    setIsEditing={setIsEditingMeta}
                    editName={editName}
                    setEditName={setEditName}
                    onSave={() => mutateMeta({ id: diet.id, name: editName })}
                    onCancel={() => {
                        setEditName(diet.name)
                        setIsEditingMeta(false)
                    }}
                    showAssignmentBadge={showAssignmentBadge}
                    canAssign={canAssign}
                    assignments={diet.assignments}
                    students={students}
                    isEstimatingAll={isEstimatingAll}
                    onEstimateAll={handleEstimateAll}
                    contextLabel={contextLabel}
                    icon={icon}
                    contextColor={contextColor}
                />
            )}
            {/* ── Macro totals bar (isolated section) ── */}
            {!hideHeader && (
                <Grid cols={{ base: 6, md: 5 }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    {/* PROT */}
                    <GlassPanel padding={STORE_TOKENS.SPACING.ELEMENT} border="standard" colSpan={2} mdColSpan={1}>
                        <Stack gap={'tiny'} align="center" justify="center">
                            <Font
                                variant="sub-tiny"
                                uppercase
                                weight="black"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>Prot</Font>
                            <Inline align="baseline" justify="center" gap={'tiny'}>
                                <Font
                                    variant="h1"
                                    weight="black"
                                    {...{
                                        color: STORE_TOKENS.COLORS.INFO,
                                    }}>{Math.round(totals.p)}</Font>
                                <Font
                                    variant="sub-tiny"
                                    weight="bold"
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                    }}>g</Font>
                            </Inline>
                        </Stack>
                    </GlassPanel>
                    {/* CARB */}
                    <GlassPanel padding={STORE_TOKENS.SPACING.ELEMENT} border="standard" colSpan={2} mdColSpan={1}>
                        <Stack gap={'tiny'} align="center" justify="center">
                            <Font
                                variant="sub-tiny"
                                uppercase
                                weight="black"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>Carb</Font>
                            <Inline align="baseline" justify="center" gap={'tiny'}>
                                <Font
                                    variant="h1"
                                    weight="black"
                                    {...{
                                        color: STORE_TOKENS.COLORS.BRAND,
                                    }}>{Math.round(totals.c)}</Font>
                                <Font
                                    variant="sub-tiny"
                                    weight="bold"
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                    }}>g</Font>
                            </Inline>
                        </Stack>
                    </GlassPanel>
                    {/* GORD */}
                    <GlassPanel padding={STORE_TOKENS.SPACING.ELEMENT} border="standard" colSpan={2} mdColSpan={1}>
                        <Stack gap={'tiny'} align="center" justify="center">
                            <Font
                                variant="sub-tiny"
                                uppercase
                                weight="black"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>Gord</Font>
                            <Inline align="baseline" justify="center" gap={'tiny'}>
                                <Font
                                    variant="h1"
                                    weight="black"
                                    {...{
                                        color: STORE_TOKENS.COLORS.WARNING,
                                    }}>{Math.round(totals.f)}</Font>
                                <Font
                                    variant="sub-tiny"
                                    weight="bold"
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                    }}>g</Font>
                            </Inline>
                        </Stack>
                    </GlassPanel>
                    {/* FIB */}
                    <GlassPanel padding={STORE_TOKENS.SPACING.ELEMENT} border="standard" colSpan={3} mdColSpan={1}>
                        <Stack gap={'tiny'} align="center" justify="center">
                            <Font
                                variant="sub-tiny"
                                uppercase
                                weight="black"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>Fib</Font>
                            <Inline align="baseline" justify="center" gap={'tiny'}>
                                <Font
                                    variant="h1"
                                    weight="black"
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                                    }}>{Math.round(totals.fib)}</Font>
                                <Font
                                    variant="sub-tiny"
                                    weight="bold"
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                    }}>g</Font>
                            </Inline>
                        </Stack>
                    </GlassPanel>
                    {/* KCAL */}
                    <GlassPanel padding={STORE_TOKENS.SPACING.ELEMENT} border="standard" colSpan={3} mdColSpan={1}>
                        <Stack gap={'tiny'} align="center" justify="center">
                            <Font
                                variant="sub-tiny"
                                uppercase
                                weight="black"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                }}>Kcal</Font>
                            <Inline align="baseline" justify="center" gap={'tiny'}>
                                <Font
                                    variant="h1"
                                    weight="black"
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                    }}>
                                    {Math.round((totals.p * 4) + (totals.c * 4) + (totals.f * 9))}
                                </Font>
                                <Font
                                    variant="sub-tiny"
                                    weight="bold"
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                    }}>kcal</Font>
                            </Inline>
                        </Stack>
                    </GlassPanel>
                </Grid>
            )}
            {/* Meals section */}
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack
                    direction={{ base: 'col', md: 'row' }}
                    align={{ base: 'start', md: 'center' }}
                    justify="between"
                    gap={STORE_TOKENS.SPACING.ELEMENT}
                >
                    <Font
                        variant="heading"
                        uppercase
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                        }}>
                        Refeições
                    </Font>
                    <Badge
                        label={`${meals.length} ${meals.length !== 1 ? 'refeições' : 'refeição'}`}
                        variant="glass"
                        color={(contextColor as any) || STORE_TOKENS.COLORS.BRAND}
                        size="sm"
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    />
                </Stack>

                {meals.length > 0 ? (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        {meals.map((meal: any, index: number) => (
                            <DietBuilderMealCard
                                key={meal.id}
                                meal={meal}
                                index={index}
                                dietId={diet.id}
                                queryKey={queryKey}
                                isDragged={draggedMealId === meal.id}
                                draggedItemId={draggedItemId}
                                onMealDragStart={handleMealDragStart}
                                onMealDragOver={handleMealDragOver}
                                onMealDragEnd={handleMealDragEnd}
                                onItemDragStart={handleItemDragStart}
                                onItemDragOver={handleItemDragOver}
                                onItemDragEnd={handleItemDragEnd}
                                onRemoveMeal={(id) => {
                                    if (!confirm('Remover esta refeição inteira?')) return
                                    removeMealMutate({ id, dietId: diet.id })
                                }}
                                onRemoveItem={(id) => removeItemMutate({ id, dietId: diet.id })}
                                onAddItem={(mealId) => addItemMutate({ mealId, dietId: diet.id, foodId: 'default' })}
                            />
                        ))}
                    </Stack>
                ) : (
                    <EmptyState
                        icon={Utensils}
                        title="NENHUMA REFEIÇÃO ADICIONADA"
                        description="Use o formulário abaixo para começar."
                    />
                )}
            </Stack>
            {/* Add new meal form */}
            <DietBuilderNewMeal
                onAdd={(name) => addMealMutate({ dietId: diet.id, name })}
            />
            {/* Back navigation */}
            <Box display="flex" justify="center">
                <Button
                    asChild
                    variant="outline-zinc"
                    fullWidth={{ base: true, sm: false }}
                    paddingY={STORE_TOKENS.SPACING.ELEMENT}
                    paddingX={STORE_TOKENS.SPACING.CONTAINER}
                    gap={STORE_TOKENS.SPACING.ELEMENT}
                >
                    <Link href={backHref}>
                        <Icon icon={ArrowLeft} size="xs" />
                        Voltar para a Biblioteca de Dietas
                    </Link>
                </Button>
            </Box>
        </Stack>
    );
}
