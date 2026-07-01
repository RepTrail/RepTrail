'use client'

import React, { useState, useEffect } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Input } from '@/components/store/base/input'
import { Button } from '@/components/store/base/button'
import { Surface } from '@/components/store/base/surface'
import { Separator } from '@/components/store/base/separator'
import { Inline } from '@/components/store/base/layout'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useOptimisticMutation } from '@/lib/dal'
import { useQueryClient } from '@/lib/dal'
import { estimateMacros, suggestSubstitution } from '@/lib/dal/remote'
import { ENTITIES } from '@/lib/outbox-db'
import {
    GripVertical,
    Trash2,
    Sparkles,
    Repeat2,
    Save,
    Utensils,
    Check,
    Loader2
} from 'lucide-react'

interface MealItemRowProps {
    item: {
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
    dietId: string
    queryKey: unknown[]
    onRemove: (id: string) => void
    draggable?: boolean
    onDragStart?: React.DragEventHandler
    onDragOver?: React.DragEventHandler
    onDrop?: React.DragEventHandler
    onDragEnd?: React.DragEventHandler
    isDragged?: boolean
}

export function DietBuilderMealItemRow({
    item,
    dietId,
    queryKey,
    onRemove,
    draggable,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    isDragged = false
}: MealItemRowProps) {
    const queryClient = useQueryClient()

    // Local state â€” zero-lag typing
    const [foodName, setFoodName] = useState(item.food_name)
    const [quantity, setQuantity] = useState(item.quantity)
    const [protein, setProtein] = useState(item.protein)
    const [carbs, setCarbs] = useState(item.carbs)
    const [fat, setFat] = useState(item.fat)
    const [fiber, setFiber] = useState(item.fiber || 0)
    const [hasSubstitute, setHasSubstitute] = useState(item.has_substitute || false)
    const [subFoodName, setSubFoodName] = useState(item.sub_food_name || '')
    const [subQuantity, setSubQuantity] = useState(item.sub_quantity || '')
    const [subProtein, setSubProtein] = useState(item.sub_protein || 0)
    const [subCarbs, setSubCarbs] = useState(item.sub_carbs || 0)
    const [subFat, setSubFat] = useState(item.sub_fat || 0)
    const [subFiber, setSubFiber] = useState(item.sub_fiber || 0)
    const [isSaved, setIsSaved] = useState(true)
    const [estimating, setEstimating] = useState<Record<string, boolean>>({})

    // Sync from props (e.g. after global "Estimate All")
    useEffect(() => {
        setFoodName(item.food_name)
        setQuantity(item.quantity)
        setProtein(item.protein)
        setCarbs(item.carbs)
        setFat(item.fat)
        setFiber(item.fiber || 0)
        setHasSubstitute(item.has_substitute || false)
        setSubFoodName(item.sub_food_name || '')
        setSubQuantity(item.sub_quantity || '')
        setSubProtein(item.sub_protein || 0)
        setSubCarbs(item.sub_carbs || 0)
        setSubFat(item.sub_fat || 0)
        setSubFiber(item.sub_fiber || 0)
        setIsSaved(true)
    }, [item])

    const { mutate: syncItem } = useOptimisticMutation({
        actionName: 'update-meal-item',
        entity: ENTITIES.MEAL_ITEM,
        entityId: item.id,
        queryKey,
        mutationFn: async (variables: { id: string; data: any }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({
                ...old,
                meals: (old?.meals || []).map((m: any) => ({
                    ...m,
                    meal_items: (m.meal_items || []).map((i: any) =>
                        i.id === variables.id ? { ...i, ...variables.data } : i
                    )
                }))
            }))
            return { previous }
        },
        onSuccess: () => setIsSaved(true)
    })

    const handleSave = () => {
        syncItem({
            id: item.id,
            data: {
                food_name: foodName,
                quantity,
                protein,
                carbs,
                fat,
                fiber,
                has_substitute: hasSubstitute,
                sub_food_name: subFoodName,
                sub_quantity: subQuantity,
                sub_protein: subProtein,
                sub_carbs: subCarbs,
                sub_fat: subFat,
                sub_fiber: subFiber
            }
        })
    }

    const markUnsaved = () => setIsSaved(false)

    const handleEstimateMain = async () => {
        setEstimating(prev => ({ ...prev, main: true }))
        const res = await estimateMacros(foodName, quantity)
        if (res.success && res.macros) {
            setProtein(res.macros.protein)
            setCarbs(res.macros.carbs)
            setFat(res.macros.fat)
            setFiber(res.macros.fiber || 0)
            setIsSaved(false)
        }
        setEstimating(prev => ({ ...prev, main: false }))
    }

    const handleEstimateSub = async () => {
        setEstimating(prev => ({ ...prev, sub: true }))
        const res = await estimateMacros(subFoodName, subQuantity)
        if (res.success && res.macros) {
            setSubProtein(res.macros.protein)
            setSubCarbs(res.macros.carbs)
            setSubFat(res.macros.fat)
            setSubFiber(res.macros.fiber || 0)
            setIsSaved(false)
        }
        setEstimating(prev => ({ ...prev, sub: false }))
    }

    const handleSuggestSub = async () => {
        setEstimating(prev => ({ ...prev, suggest: true }))
        const res = await suggestSubstitution(foodName, quantity)
        if (res.success && res.suggestion) {
            setHasSubstitute(true)
            setSubFoodName(res.suggestion.food_name)
            setSubQuantity(res.suggestion.quantity)
            setSubProtein(res.suggestion.protein)
            setSubCarbs(res.suggestion.carbs)
            setSubFat(res.suggestion.fat)
            setSubFiber(res.suggestion.fiber || 0)
            setIsSaved(false)
        }
        setEstimating(prev => ({ ...prev, suggest: false }))
    }

    const handleClearSub = () => {
        setSubFoodName('')
        setSubQuantity('')
        setSubProtein(0)
        setSubCarbs(0)
        setSubFat(0)
        setSubFiber(0)
        setHasSubstitute(false)
        setIsSaved(false)
    }

    return (
        <Box
            transition
            opacity={isDragged ? STORE_TOKENS.OPACITY.SIDEBAR : STORE_TOKENS.OPACITY.FULL}
            bg={!isSaved ? STORE_TOKENS.COLORS.BRAND : undefined}
            bgOpacity={!isSaved ? STORE_TOKENS.OPACITY.LOW : undefined}
            draggable={draggable}
            onDragStart={onDragStart as any}
            onDragOver={onDragOver as any}
            onDrop={onDrop as any}
            onDragEnd={onDragEnd as any}
        >
            {/* Main item row */}
            <Stack
                direction={{ base: 'col', lg: 'row' }}
                gap={STORE_TOKENS.SPACING.ELEMENT}
                align={{ base: 'stretch', lg: 'end' }}
                padding={STORE_TOKENS.SPACING.ELEMENT}
            >
                {/* Drag handle â€” desktop only */}
                <Box display={{ base: 'none', lg: 'flex' }} align="center" justify="center" shrink={0}>
                    <Button
                        variant="outline-zinc"
                        isIconOnly
                        size="sm"
                        title="Arrastar"
                    >
                        <Icon icon={GripVertical} size="xs" />
                    </Button>
                </Box>

                {/* Food name + Quantity */}
                <Stack
                    direction={{ base: 'col', md: 'row' }}
                    gap={STORE_TOKENS.SPACING.ELEMENT}
                    align="stretch"
                    flex1
                >
                    {/* Food name */}
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1>
                        <Inline justify="between" align="center">
                            <Font
                                variant="sub-tiny"
                                uppercase
                                weight="bold"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>
                                Alimento
                            </Font>
                            {!isSaved && (
                                <Font
                                    variant="sub-tiny"
                                    weight="black"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.BRAND,
                                    }}>
                                    Pendente
                                </Font>
                            )}
                        </Inline>
                        <Input
                            size="sm"
                            value={foodName}
                            onChange={(e) => { setFoodName(e.target.value); markUnsaved() }}
                        />
                    </Stack>

                    {/* Quantity */}
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} shrink={0}>
                        <Font
                            variant="sub-tiny"
                            uppercase
                            weight="bold"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.DIM,
                            }}>
                            Qtd
                        </Font>
                        <Input
                            size="sm"
                            value={quantity}
                            onChange={(e) => { setQuantity(e.target.value); markUnsaved() }}
                            placeholder="Ex: 100g"
                            textAlign="center"
                        />
                    </Stack>
                </Stack>

                {/* Macros */}
                <Grid cols={{ base: 2, lg: 4 }} gap={STORE_TOKENS.SPACING.ELEMENT} shrink={0}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font
                            variant="sub-tiny"
                            uppercase
                            weight="bold"
                            {...{
                                color: STORE_TOKENS.COLORS.INFO,
                            }}>
                            Prot
                        </Font>
                        <Input
                            size="sm"
                            type="number"
                            value={protein}
                            onChange={(e) => { setProtein(parseFloat(e.target.value) || 0); markUnsaved() }}
                            textAlign="center"
                        />
                    </Stack>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font
                            variant="sub-tiny"
                            uppercase
                            weight="bold"
                            {...{
                                color: STORE_TOKENS.COLORS.BRAND,
                            }}>
                            Carb
                        </Font>
                        <Input
                            size="sm"
                            type="number"
                            value={carbs}
                            onChange={(e) => { setCarbs(parseFloat(e.target.value) || 0); markUnsaved() }}
                            textAlign="center"
                        />
                    </Stack>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font
                            variant="sub-tiny"
                            uppercase
                            weight="bold"
                            {...{
                                color: STORE_TOKENS.COLORS.WARNING,
                            }}>
                            Gord
                        </Font>
                        <Input
                            size="sm"
                            type="number"
                            value={fat}
                            onChange={(e) => { setFat(parseFloat(e.target.value) || 0); markUnsaved() }}
                            textAlign="center"
                        />
                    </Stack>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font
                            variant="sub-tiny"
                            uppercase
                            weight="bold"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                            }}>
                            Fib
                        </Font>
                        <Input
                            size="sm"
                            type="number"
                            value={fiber}
                            onChange={(e) => { setFiber(parseFloat(e.target.value) || 0); markUnsaved() }}
                            textAlign="center"
                        />
                    </Stack>
                </Grid>

                {/* Action buttons */}
                <Inline justify="between" align="center" shrink={0}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Button
                            variant="outline-orange"
                            isIconOnly
                            size="sm"
                            disabled={estimating.main || !foodName}
                            onClick={handleEstimateMain}
                            title="Calcular macros com IA"
                        >
                            <Icon icon={estimating.main ? Loader2 : Sparkles} size="xs" spin={estimating.main} />
                        </Button>
                        <Button
                            variant={hasSubstitute ? 'outline-amber' : 'outline-amber'}
                            isIconOnly
                            size="sm"
                            onClick={() => { setHasSubstitute(!hasSubstitute); markUnsaved() }}
                            title="Adicionar/Remover Substituição"
                        >
                            <Icon icon={Repeat2} size="xs" />
                        </Button>
                        <Button
                            variant="outline-red"
                            isIconOnly
                            size="sm"
                            onClick={() => onRemove(item.id)}
                            title="Remover item"
                        >
                            <Icon icon={Trash2} size="xs" />
                        </Button>
                        <Button
                            variant="outline-emerald"
                            isIconOnly
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaved}
                            title="Salvar alterações"
                        >
                            <Icon icon={Save} size="xs" />
                        </Button>
                    </Inline>

                    {/* Drag handle button â€” mobile only, right-aligned */}
                    <Box display={{ base: 'flex', lg: 'none' }}>
                        <Button variant="outline-blue" isIconOnly size="sm">
                            <Icon icon={GripVertical} size="xs" />
                        </Button>
                    </Box>
                </Inline>
            </Stack>
            {/* Substitution row */}
            {hasSubstitute && (
                <Box>
                    <Separator opacity={STORE_TOKENS.OPACITY.SUBTLE} />
                    <Surface
                        variant="tonal-primary"
                        padding={STORE_TOKENS.SPACING.ELEMENT}
                        rounded={STORE_TOKENS.RADIUS.NONE}
                        border="none"
                    >
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            {/* Substitution header */}
                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Font
                                    variant="sub-tiny"
                                    uppercase
                                    weight="black"
                                    tracking="widest"
                                    {...{
                                        color: STORE_TOKENS.COLORS.BRAND,
                                    }}>
                                    â†³ Substituição
                                </Font>
                            </Inline>

                            {/* Substitution fields â€” same layout as main */}
                            <Stack
                                direction={{ base: 'col', md: 'row' }}
                                gap={STORE_TOKENS.SPACING.ELEMENT}
                                align={{ base: 'stretch', md: 'end' }}
                            >
                                {/* Sub food name + quantity */}
                                <Stack
                                    direction={{ base: 'col', md: 'row' }}
                                    gap={STORE_TOKENS.SPACING.ELEMENT}
                                    align="stretch"
                                    flex1
                                >
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1>
                                        <Font
                                            variant="sub-tiny"
                                            uppercase
                                            weight="bold"
                                            {...{
                                                color: STORE_TOKENS.COLORS.TEXT.DIM,
                                            }}>
                                            Alimento
                                        </Font>
                                        <Input
                                            size="sm"
                                            value={subFoodName}
                                            onChange={(e) => { setSubFoodName(e.target.value); markUnsaved() }}
                                            placeholder="Nome da substituição..."
                                        />
                                    </Stack>
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} shrink={0}>
                                        <Font
                                            variant="sub-tiny"
                                            uppercase
                                            weight="bold"
                                            {...{
                                                color: STORE_TOKENS.COLORS.TEXT.DIM,
                                            }}>
                                            Qtd
                                        </Font>
                                        <Input
                                            size="sm"
                                            value={subQuantity}
                                            onChange={(e) => { setSubQuantity(e.target.value); markUnsaved() }}
                                            placeholder="Ex: 100g"
                                            textAlign="center"
                                        />
                                    </Stack>
                                </Stack>

                                {/* Sub macros */}
                                <Grid cols={4} gap={STORE_TOKENS.SPACING.ELEMENT} shrink={0}>
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Font
                                            variant="sub-tiny"
                                            uppercase
                                            weight="bold"
                                            {...{
                                                color: STORE_TOKENS.COLORS.INFO,
                                            }}>Prot</Font>
                                        <Input size="sm" type="number" value={subProtein} onChange={(e) => { setSubProtein(parseFloat(e.target.value) || 0); markUnsaved() }} textAlign="center" />
                                    </Stack>
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Font
                                            variant="sub-tiny"
                                            uppercase
                                            weight="bold"
                                            {...{
                                                color: STORE_TOKENS.COLORS.BRAND,
                                            }}>Carb</Font>
                                        <Input size="sm" type="number" value={subCarbs} onChange={(e) => { setSubCarbs(parseFloat(e.target.value) || 0); markUnsaved() }} textAlign="center" />
                                    </Stack>
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Font
                                            variant="sub-tiny"
                                            uppercase
                                            weight="bold"
                                            {...{
                                                color: STORE_TOKENS.COLORS.WARNING,
                                            }}>Gord</Font>
                                        <Input size="sm" type="number" value={subFat} onChange={(e) => { setSubFat(parseFloat(e.target.value) || 0); markUnsaved() }} textAlign="center" />
                                    </Stack>
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Font
                                            variant="sub-tiny"
                                            uppercase
                                            weight="bold"
                                            {...{
                                                color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                                            }}>Fib</Font>
                                        <Input size="sm" type="number" value={subFiber} onChange={(e) => { setSubFiber(parseFloat(e.target.value) || 0); markUnsaved() }} textAlign="center" />
                                    </Stack>
                                </Grid>

                                {/* Sub action buttons */}
                                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center" shrink={0}>
                                    <Button
                                        variant="outline-orange"
                                        isIconOnly
                                        size="sm"
                                        disabled={estimating.sub || !subFoodName}
                                        onClick={handleEstimateSub}
                                        title="Calcular macros da substituição com IA"
                                    >
                                        <Icon icon={estimating.sub ? Loader2 : Sparkles} size="xs" spin={estimating.sub} />
                                    </Button>
                                    <Button
                                        variant="outline-orange"
                                        isIconOnly
                                        size="sm"
                                        disabled={estimating.suggest}
                                        onClick={handleSuggestSub}
                                        title="Sugerir substituição similar com IA"
                                    >
                                        <Icon icon={estimating.suggest ? Loader2 : Utensils} size="xs" spin={estimating.suggest} />
                                    </Button>
                                    <Button
                                        variant="outline-red"
                                        isIconOnly
                                        size="sm"
                                        onClick={handleClearSub}
                                        title="Limpar campos da substituição"
                                    >
                                        <Icon icon={Trash2} size="xs" />
                                    </Button>
                                    <Button
                                        variant="outline-emerald"
                                        isIconOnly
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={isSaved}
                                        title="Salvar Alterações"
                                    >
                                        <Icon icon={Check} size="xs" />
                                    </Button>
                                </Inline>
                            </Stack>
                        </Stack>
                    </Surface>
                </Box>
            )}
        </Box>
    );
}
