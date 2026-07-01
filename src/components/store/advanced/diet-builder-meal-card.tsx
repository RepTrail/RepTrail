'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel, CardHeader, CardContent } from '@/components/store/base/surface'
import { Separator } from '@/components/store/base/separator'
import { Inline } from '@/components/store/base/layout'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { DietBuilderMealItemRow } from './diet-builder-meal-item-row'
import { GripVertical, Trash2, PlusCircle } from 'lucide-react'

interface MealItem {
    id: string
    food_name: string
    quantity: string
    protein: number
    carbs: number
    fat: number
    fiber?: number
    has_substitute?: boolean
    sub_food_name?: string
    sub_quantity?: string
    sub_protein?: number
    sub_carbs?: number
    sub_fat?: number
    sub_fiber?: number
}

interface Meal {
    id: string
    name: string
    time_of_day: string
    order_index: number
    notes: string
    meal_items: MealItem[]
}

interface DietBuilderMealCardProps {
    meal: Meal
    index: number
    dietId: string
    queryKey: unknown[]
    isDragged: boolean
    draggedItemId: { mealId: string; itemId: string } | null
    onMealDragStart: (e: React.DragEvent, id: string) => void
    onMealDragOver: (e: React.DragEvent, id: string) => void
    onMealDrop: (e: React.DragEvent, id: string) => void
    onMealDragEnd: () => void
    onItemDragStart: (e: React.DragEvent, mealId: string, itemId: string) => void
    onItemDragOver: (e: React.DragEvent, mealId: string, itemId: string) => void
    onItemDrop: (e: React.DragEvent, mealId: string, itemId: string) => void
    onItemDragEnd: (mealId: string) => void
    onRemoveMeal: (id: string) => void
    onRemoveItem: (id: string) => void
    onAddItem: (mealId: string) => void
}

export function DietBuilderMealCard({
    meal,
    index,
    dietId,
    queryKey,
    isDragged,
    draggedItemId,
    onMealDragStart,
    onMealDragOver,
    onMealDrop,
    onMealDragEnd,
    onItemDragStart,
    onItemDragOver,
    onItemDrop,
    onItemDragEnd,
    onRemoveMeal,
    onRemoveItem,
    onAddItem
}: DietBuilderMealCardProps) {
    const items = meal.meal_items || []

    // Per-meal macro totals
    const mealP = items.reduce((s, i) => s + (Number(i.protein) || 0), 0)
    const mealC = items.reduce((s, i) => s + (Number(i.carbs) || 0), 0)
    const mealF = items.reduce((s, i) => s + (Number(i.fat) || 0), 0)
    const mealFib = items.reduce((s, i) => s + (Number(i.fiber) || 0), 0)
    const mealKcal = Math.round((mealP * 4) + (mealC * 4) + (mealF * 9))

    return (
        <Box
            as="div"
            draggable
            onDragStart={(e: React.DragEvent) => onMealDragStart(e, meal.id)}
            onDragOver={(e: React.DragEvent) => onMealDragOver(e, meal.id)}
            onDrop={(e: React.DragEvent) => onMealDrop(e, meal.id)}
            onDragEnd={onMealDragEnd}
            transition
            opacity={isDragged ? STORE_TOKENS.OPACITY.SIDEBAR : STORE_TOKENS.OPACITY.FULL}
            scale={isDragged ? 95 : 100}
        >
            <GlassPanel border="subtle">
                <CardHeader
                    {...{
                        padding: STORE_TOKENS.SPACING.ELEMENT,
                    }}>
                    {/* ── MOBILE: two rows ── */}
                    <Box display={{ base: 'flex', md: 'none' }} direction="col" gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                        {/* Row 1: grip button ← → delete */}
                        <Inline justify="between" align="center" fullWidth>
                            <Button variant="outline-primary" isIconOnly size="sm">
                                <Icon icon={GripVertical} size="xs" />
                            </Button>
                            <Button
                                variant="outline-red"
                                isIconOnly
                                size="sm"
                                onClick={() => onRemoveMeal(meal.id)}
                                title="Remover refeição"
                            >
                                <Icon icon={Trash2} size="xs" />
                            </Button>
                        </Inline>
                        {/* Row 2: title alone */}
                        <Font
                            variant="heading"
                            uppercase
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                            }}>
                            {meal.name && !meal.name.toLowerCase().includes('refeição') ? meal.name : `Refeição ${index + 1}`}
                        </Font>
                    </Box>

                    {/* ── DESKTOP: single row ── */}
                    <Box display={{ base: 'none', md: 'flex' }} align="center" justify="between" fullWidth gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Button variant="outline-primary" isIconOnly size="sm">
                                <Icon icon={GripVertical} size="xs" />
                            </Button>
                            <Stack gap={'tiny'}>
                                <Font
                                    variant="heading"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                    }}>
                                    Refeição {index + 1}
                                </Font>
                                {meal.name && !meal.name.toLowerCase().includes('refeição') && (
                                    <Font
                                        variant="description"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                        }}>
                                        {meal.name}
                                    </Font>
                                )}
                            </Stack>
                        </Inline>

                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Badge label={`P: ${Math.round(mealP)}g`} variant="glass" color={STORE_TOKENS.COLORS.INFO} size="sm" rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                                <Badge label={`C: ${Math.round(mealC)}g`} variant="glass" color={STORE_TOKENS.COLORS.BRAND} size="sm" rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                                <Badge label={`G: ${Math.round(mealF)}g`} variant="glass" color={STORE_TOKENS.COLORS.WARNING} size="sm" rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                                <Badge label={`${mealKcal} kcal`} variant="glass" color={STORE_TOKENS.COLORS.BACKGROUND} size="sm" rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                            </Inline>
                            <Button
                                variant="outline-red"
                                isIconOnly
                                size="sm"
                                onClick={() => onRemoveMeal(meal.id)}
                                title="Remover refeição"
                            >
                                <Icon icon={Trash2} size="xs" />
                            </Button>
                        </Inline>
                    </Box>
                </CardHeader>


                {/* Meal items list */}
                <CardContent
                    {...{
                        padding: STORE_TOKENS.SPACING.NONE,
                    }}>
                    <Stack gap={STORE_TOKENS.SPACING.NONE} divide>
                        {items.map((item) => (
                            <DietBuilderMealItemRow
                                key={item.id}
                                item={item}
                                dietId={dietId}
                                queryKey={queryKey}
                                onRemove={onRemoveItem}
                                draggable
                                onDragStart={(e) => onItemDragStart(e, meal.id, item.id)}
                                onDragOver={(e) => onItemDragOver(e, meal.id, item.id)}
                                onDrop={(e) => onItemDrop(e, meal.id, item.id)}
                                onDragEnd={() => onItemDragEnd(meal.id)}
                                isDragged={draggedItemId?.itemId === item.id}
                            />
                        ))}
                    </Stack>

                    {/* Add item button */}
                    <Separator opacity={STORE_TOKENS.OPACITY.SUBTLE} />
                    <Box padding={STORE_TOKENS.SPACING.ELEMENT}>
                        <Button
                            variant="outline-zinc"
                            fullWidth
                            onClick={() => onAddItem(meal.id)}
                            gap={STORE_TOKENS.SPACING.ELEMENT}
                        >
                            <Icon icon={PlusCircle} size="xs" color={STORE_TOKENS.COLORS.BRAND} />
                            Adicionar Item
                        </Button>
                    </Box>
                </CardContent>
            </GlassPanel>
        </Box>
    );
}
