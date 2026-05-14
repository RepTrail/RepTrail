'use client';
import { useState, useMemo, memo } from 'react'
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Utensils, ChevronDown, Check, Sparkles, Loader2, Repeat2 } from 'lucide-react'
import { Button } from '@/components/store/base/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { estimateAllDietMacros } from '@/actions/diet-actions'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Grid } from '@/components/store/base/grid'

import { STORE_TOKENS } from "../constants/tokens";

interface DietAdherenceProps {
    diet: any
    allowEstimation?: boolean
    hasTrainer?: boolean
    queryKey?: any
}

export function DietAdherence({ diet, allowEstimation = false, hasTrainer = false, queryKey: passedQueryKey }: DietAdherenceProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const [estimating, setEstimating] = useState(false)
    const [openMeals, setOpenMeals] = useState<Record<string, boolean>>({})

    const activeQueryKey = passedQueryKey || QUERY_KEYS.diets.today(diet.user_id)
    const meals = diet.meals || []

    const allItems = useMemo(() => meals.flatMap((m: any) => m.meal_items || []), [meals])
    const totalItems = allItems.length
    const completedItems = allItems.filter((i: any) => i.is_checked).length
    const dailyPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

    const toggleMealAccordion = (mealId: string) => {
        setOpenMeals(prev => ({ ...prev, [mealId]: !prev[mealId] }))
    }

    const itemMutation = useOptimisticMutation({
        queryKey: activeQueryKey,
        entity: 'meal_item_logs' as any,
        actionName: 'toggle-meal-item',
        mutationFn: async () => {},
        updateFn: (old: any, variables: any) => {
            if (!old) return old
            return {
                ...old,
                meals: old.meals.map((m: any) => {
                    if (m.id !== variables.mealId) return m
                    return {
                        ...m,
                        meal_items: m.meal_items.map((i: any) => i.id === variables.itemId ? { ...i, is_checked: variables.status } : i)
                    }
                })
            }
        }
    })

    const groupMutation = useOptimisticMutation({
        queryKey: activeQueryKey,
        entity: 'meal_item_logs' as any,
        actionName: 'toggle-meal-group',
        mutationFn: async () => {},
        updateFn: (old: any, variables: any) => {
            if (!old) return old
            return {
                ...old,
                meals: old.meals.map((m: any) => {
                    if (m.id !== variables.mealId) return m
                    return {
                        ...m,
                        meal_items: m.meal_items.map((i: any) => ({ ...i, is_checked: variables.status }))
                    }
                })
            }
        },
        onMutate: (variables) => {
            toast({
                title: variables.status ? 'Refeição Completada!' : 'Refeição Reiniciada',
                description: variables.status ? 'Todos os itens foram marcados.' : 'Itens desmarcados.'
            })
        }
    })

    const swapMutation = useOptimisticMutation({
        queryKey: activeQueryKey,
        entity: 'meal_item_logs' as any,
        actionName: 'toggle-substitution',
        mutationFn: async () => {},
        updateFn: (old: any, variables: any) => {
            if (!old) return old
            return {
                ...old,
                meals: old.meals.map((m: any) => ({
                    ...m,
                    meal_items: m.meal_items.map((i: any) => i.id === variables.itemId ? { ...i, is_substituted: !i.is_substituted } : i)
                }))
            }
        }
    })

    const handleEstimate = async () => {
        if (!allowEstimation) return
        setEstimating(true)
        try {
            await estimateAllDietMacros(diet.id)
            queryClient.invalidateQueries({ queryKey: activeQueryKey })
            toast({ title: 'Macronutrientes estimados!', description: 'Valores atualizados via IA.' })
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro na estimativa', description: 'Não foi possível calcular os macros agora.' })
        } finally {
            setEstimating(false)
        }
    }

    return (
        <Box 
            padding={{ base: 5, sm: 12.5 }} 
            rounded="system" 
            bg="zinc" 
            bgOpacity={40} 
            border 
            borderColor="zinc" 
            backdropBlur="sm"
            className="shadow-xl"
        >
            <Stack gap={STORE_TOKENS.SPACING.EMPTY_STATE}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <div className="flex items-center justify-between">
                        <Stack gap={2.5}>
                            <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest" className="flex items-center gap-2">
                                <Utensils className="w-3.5 h-3.5" />
                                {hasTrainer ? 'Protocolo Nutricional' : 'Sua Dieta'}
                            </Font>
                            <Font variant="heading" weight="black" italic uppercase tracking="tight" className="text-3xl sm:text-4xl">
                                Nutrição
                            </Font>
                        </Stack>
                        <div className="flex flex-col items-end">
                            {allowEstimation && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleEstimate}
                                    disabled={estimating}
                                    className="h-8 text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 mb-2"
                                >
                                    {estimating ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                                    Estimar Macros (IA)
                                </Button>
                            )}
                            <div className="flex items-baseline gap-1">
                                <Font variant="heading" weight="black" color="emerald" italic className="text-3xl">
                                    {Math.round(dailyPercentage)}
                                </Font>
                                <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase italic>
                                    %
                                </Font>
                            </div>
                        </div>
                    </div>

                    <Progress 
                        value={dailyPercentage} 
                        className="h-3 w-full bg-zinc-950 border border-zinc-900 shadow-inner" 
                        indicatorClassName="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                    />
                </Stack>

                <Box padding={STORE_TOKENS.PADDING.CONTAINER} bg="zinc" bgOpacity={30} border borderColor="zinc" rounded="system" suppressHydrationWarning>
                    {useMemo(() => {
                        const t = meals.reduce((acc: any, meal: any) => {
                            const items = meal.meal_items || []
                            return {
                                p: acc.p + items.reduce((s: any, i: any) => s + (i.is_substituted ? (i.substituted_protein || 0) : (i.protein || 0)), 0),
                                c: acc.c + items.reduce((s: any, i: any) => s + (i.is_substituted ? (i.substituted_carbs || 0) : (i.carbs || 0)), 0),
                                g: acc.g + items.reduce((s: any, i: any) => s + (i.is_substituted ? (i.substituted_fat || 0) : (i.fat || 0)), 0),
                                f: acc.f + items.reduce((s: any, i: any) => s + (i.is_substituted ? (i.substituted_fiber || 0) : (i.fiber || 0)), 0),
                            }
                        }, { p: 0, c: 0, g: 0, f: 0 })
                        const cals = (t.p * 4) + (t.c * 4) + (t.g * 9)

                        return (
                            <Grid cols={6} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <MacroBox label="Calorias" value={cals} unit="kcal" color="white" className="col-span-3 sm:col-span-2" />
                                <MacroBox label="Proteínas" value={t.p} unit="g" color="emerald" className="col-span-3 sm:col-span-2" />
                                <MacroBox label="Carbos" value={t.c} unit="g" color="amber" className="col-span-3 sm:col-span-2" />
                                <MacroBox label="Gorduras" value={t.g} unit="g" color="red" className="col-span-3 sm:col-span-3" />
                                <MacroBox label="Fibras" value={t.f} unit="g" color="blue" className="col-span-6 sm:col-span-3" />
                            </Grid>
                        );
                    }, [meals])}
                </Box>

                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {meals.map((meal: any) => (
                        <MealRow 
                            key={meal?.id || Math.random()} 
                            meal={meal} 
                            isOpen={!!openMeals[meal?.id]} 
                            onToggleAccordion={() => toggleMealAccordion(meal?.id)}
                            onToggleItem={itemMutation.mutate}
                            onToggleGroup={groupMutation.mutate}
                            onSwap={swapMutation.mutate}
                            hasTrainer={hasTrainer}
                        />
                    ))}
                </Stack>
            </Stack>
        </Box>
    );
}

function MacroBox({ label, value, unit, color, className }: any) {
    return (
        <Box 
            padding={{ base: 2.5, sm: 5 }} 
            rounded="system" 
            bg="zinc" 
            bgOpacity={50} 
            border 
            borderColor="zinc" 
            className={cn("flex flex-col items-center justify-center shadow-inner", className)}
        >
            <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase className="mb-1">
                {label}
            </Font>
            <div className="flex items-baseline gap-1">
                <Font variant="heading" weight="black" color={color} italic className="text-xl sm:text-2xl">
                    {Math.round(value)}
                </Font>
                <Font variant="sub-tiny" weight="bold" color="zinc-600" uppercase>
                    {unit}
                </Font>
            </div>
        </Box>
    )
}

function MacroMini({ label, value, unit = '' }: any) {
    return (
        <div className="flex items-baseline gap-0.5" suppressHydrationWarning>
            <Font variant="sub-tiny" weight="black" color="zinc-600" uppercase className="text-[9px]">
                {label}
            </Font>
            <Font variant="tiny" weight="bold" color="zinc-400">
                {Math.round(value)}{unit}
            </Font>
        </div>
    )
}

const MealItem = memo(({ item, mealId, onToggle, onSwap, hasTrainer }: any) => {
    return (
        <Box 
            padding={STORE_TOKENS.PADDING.ELEMENT} 
            rounded="system" 
            bg="zinc" 
            bgOpacity={30} 
            border 
            borderColor="zinc" 
            className="flex items-center justify-between hover:bg-zinc-900/50 transition-colors gap-3"
        >
            <div className="flex items-center gap-3 min-w-0">
                <Button
                    variant="ghost" size="xs"
                    className={cn(
                        "w-7 h-7 rounded-system border flex-shrink-0 transition-all duration-75 active:scale-95", 
                        item.is_checked 
                            ? "bg-emerald-500 border-emerald-400 text-zinc-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-600 hover:border-emerald-500/50 hover:text-emerald-500"
                    )}
                    onClick={(e) => { e.stopPropagation(); onToggle({ id: item.id, itemId: item.id, status: !item.is_checked, mealId: mealId }) }}
                >
                    <Check className={cn("w-4 h-4 transition-all duration-75", !item.is_checked ? "opacity-0 scale-50" : "opacity-100 scale-100")} strokeWidth={4} />
                </Button>
                <div className="flex flex-col min-w-0">
                    <div className="text-xs truncate sm:whitespace-normal">
                        {item.is_substituted ? (
                            <>
                                <Font weight="bold" color="orange" className="mr-1.5">{item.substituted_quantity}</Font>
                                <Font color="white" className="opacity-70">{item.substituted_food_name}</Font>
                            </>
                        ) : (
                            <>
                                <Font weight="bold" color="white" className="mr-1.5">{item.quantity}</Font>
                                <Font color="zinc-500">{item.food_name}</Font>
                            </>
                        )}
                    </div>
                    <div className="flex gap-2 text-[9px] font-bold text-zinc-600 uppercase mt-0.5">
                        <span>P: {Math.round(item.is_substituted ? (item.substituted_protein || 0) : (item.protein || 0))}</span>
                        <span>C: {Math.round(item.is_substituted ? (item.substituted_carbs || 0) : (item.carbs || 0))}</span>
                        <span>G: {Math.round(item.is_substituted ? (item.substituted_fat || 0) : (item.fat || 0))}</span>
                        <span>F: {Math.round(item.is_substituted ? (item.substituted_fiber || 0) : (item.fiber || 0))}</span>
                    </div>
                </div>
            </div>
            {hasTrainer && item.has_substitute && (
                <Button
                    variant="ghost" size="icon"
                    onClick={() => onSwap({ id: item.id, itemId: item.id })}
                    className={cn("w-8 h-8 transition-colors duration-200", item.is_substituted ? "text-orange-500 bg-orange-500/10 hover:bg-orange-500/20" : "text-zinc-600 hover:text-orange-500 hover:bg-orange-500/10")}
                >
                    <Repeat2 className="w-4 h-4" />
                </Button>
            )}
        </Box>
    );
})
MealItem.displayName = 'MealItem'

const MealRow = memo(({ meal, isOpen, onToggleAccordion, onToggleItem, onToggleGroup, onSwap, hasTrainer }: any) => {
    const mealTotal = meal.meal_items?.length || 0
    const mealCompleted = meal.meal_items?.filter((i: any) => i.is_checked).length || 0
    const isFullyComplete = mealTotal > 0 && mealCompleted === mealTotal

    return (
        <Box 
            position="relative" 
            rounded="system" 
            border 
            transition 
            overflow="hidden"
            bg={isFullyComplete ? 'emerald' : 'zinc'}
            bgOpacity={isFullyComplete ? 5 : 20}
            borderColor={isFullyComplete ? 'emerald' : 'zinc'}
            className={cn(!isFullyComplete && "hover:border-zinc-800")}
        >
            <div className="p-5 flex items-center justify-between cursor-pointer select-none" onClick={onToggleAccordion}>
                <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex-shrink-0 aspect-square flex items-center justify-center transition-colors duration-200", isFullyComplete ? "bg-emerald-500 text-zinc-950" : "bg-zinc-900 text-zinc-600")}>
                        {isFullyComplete ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </div>
                    <div>
                        <Font variant="tiny" weight="black" color="white" className="capitalize tracking-wide">{meal.name.toLowerCase()}</Font>
                        <Font variant="sub-tiny" color="zinc-500" weight="bold" className="capitalize mt-0.5">{mealCompleted}/{mealTotal} Itens</Font>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!isOpen && (
                        <div className="hidden sm:flex gap-3 mr-2 opacity-60">
                            <MacroMini label="P" value={meal.meal_items?.reduce((acc: any, i: any) => acc + (i.is_substituted ? (i.substituted_protein || 0) : (i.protein || 0)), 0)} />
                            <MacroMini label="C" value={meal.meal_items?.reduce((acc: any, i: any) => acc + (i.is_substituted ? (i.substituted_carbs || 0) : (i.carbs || 0)), 0)} />
                            <MacroMini label="G" value={meal.meal_items?.reduce((acc: any, i: any) => acc + (i.is_substituted ? (i.substituted_fat || 0) : (i.fat || 0)), 0)} />
                        </div>
                    )}
                    <ChevronDown className={cn("w-5 h-5 text-zinc-700 transition-transform duration-300", isOpen && "rotate-180")} />
                </div>
            </div>
            <div className={cn("grid transition-all duration-300 ease-in-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden">
                    <div className="p-5 pt-0 space-y-3">
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            {(meal.meal_items || []).map((item: any) => (
                                <MealItem 
                                    key={item.id} 
                                    item={item} 
                                    mealId={meal.id} 
                                    onToggle={onToggleItem} 
                                    onSwap={onSwap}
                                    hasTrainer={hasTrainer}
                                />
                            ))}
                            <Button
                                size="sm" 
                                variant="ghost"
                                fullWidth
                                onClick={() => onToggleGroup({ id: meal.id, mealId: meal.id, status: !isFullyComplete })}
                            >
                                {isFullyComplete ? '✕ Desmarcar Todos' : '✓ Marcar Todos'}
                            </Button>
                        </Stack>
                    </div>
                </div>
            </div>
        </Box>
    );
})
MealRow.displayName = 'MealRow'
