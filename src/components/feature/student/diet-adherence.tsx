'use client'

import { useState, useMemo, memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Utensils, ChevronDown, Check, Sparkles, Loader2, Repeat2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { estimateAllDietMacros } from '@/actions/diet-actions'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

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
        mutationFn: async () => {}, // Single-writer: no-op
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
        entity: 'meal_item_logs' as any, // Group mutation affects item logs
        actionName: 'toggle-meal-group',
        mutationFn: async () => {}, // Single-writer: no-op
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
        mutationFn: async () => {}, // Single-writer
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

    return (
        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl rounded-3xl overflow-hidden border-t-zinc-700/10" suppressHydrationWarning>
            <CardContent className="p-6 space-y-8" suppressHydrationWarning>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6" suppressHydrationWarning>
                        <div className="space-y-1" suppressHydrationWarning>
                            <div className="flex items-center gap-2" suppressHydrationWarning>
                                <Utensils className="w-4 h-4 text-emerald-500" />
                                <h3 className="text-xl font-black text-white italic uppercase">{diet.name}</h3>
                            </div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Progresso Diário • {completedItems}/{totalItems} Itens
                            </p>
                        </div>

                        <div className="flex items-center gap-6" suppressHydrationWarning>
                            {allowEstimation && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={estimating}
                                    onClick={async () => {
                                        setEstimating(true)
                                        try {
                                            const res = await estimateAllDietMacros(diet.id)
                                            if (res.success) {
                                                toast({ title: 'Macros Calculados!', description: 'A IA preencheu os valores nutricionais da sua dieta.' })
                                                queryClient.invalidateQueries({ queryKey: activeQueryKey })
                                            } else {
                                                throw new Error(res.error)
                                            }
                                        } catch (e: any) {
                                            toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível calcular os macros.' })
                                        } finally {
                                            setEstimating(false)
                                        }
                                    }}
                                    className="h-10 px-6 rounded-xl border-amber-500/30 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 font-bold uppercase italic tracking-widest text-[10px] gap-2"
                                >
                                    {estimating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                    Calcular Macros
                                </Button>
                            )}
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-emerald-500 italic">{Math.round(dailyPercentage)}</span>
                                <span className="text-[10px] font-black text-zinc-500 uppercase italic">%</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Progress value={dailyPercentage} className="h-3 w-full bg-zinc-950 border border-zinc-900 shadow-inner" indicatorClassName="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                    </div>
                </div>

                <div className="grid grid-cols-6 gap-3 p-4 bg-zinc-950/30 border border-zinc-800/50 rounded-3xl" suppressHydrationWarning>
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
                            <>
                                <MacroBox label="Calorias" value={cals} unit="kcal" color="text-zinc-100" className="col-span-3 sm:col-span-2" />
                                <MacroBox label="Proteínas" value={t.p} unit="g" color="text-emerald-500" className="col-span-3 sm:col-span-2" />
                                <MacroBox label="Carbos" value={t.c} unit="g" color="text-amber-500" className="col-span-3 sm:col-span-2" />
                                <MacroBox label="Gorduras" value={t.g} unit="g" color="text-red-500" className="col-span-3 sm:col-span-3" />
                                <MacroBox label="Fibras" value={t.f} unit="g" color="text-blue-500" className="col-span-6 sm:col-span-3" />
                            </>
                        )
                    }, [meals])}

                </div>

                <div className="space-y-4">
                    {meals.map((meal: any) => (
                        <MealRow 
                            key={meal.id} 
                            meal={meal} 
                            isOpen={!!openMeals[meal.id]} 
                            onToggleAccordion={() => toggleMealAccordion(meal.id)}
                            onToggleItem={itemMutation.mutate}
                            onToggleGroup={groupMutation.mutate}
                            onSwap={swapMutation.mutate}
                            hasTrainer={hasTrainer}
                        />
                    ))}
                </div>


            </CardContent>
        </Card>
    )
}

function MacroBox({ label, value, unit, color, className }: any) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 shadow-inner", className)}>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter mb-1">{label}</span>
            <div className="flex items-baseline gap-1">
                <span className={cn("text-xl sm:text-2xl font-black italic", color)}>{Math.round(value)}</span>
                <span className="text-[10px] font-bold text-zinc-600 uppercase">{unit}</span>
            </div>
        </div>
    )
}

function MacroMini({ label, value, unit = '' }: any) {
    return (
        <div className="flex items-baseline gap-0.5" suppressHydrationWarning>
            <span className="text-[9px] font-black text-zinc-600 uppercase">{label}</span>
            <span className="text-[10px] font-bold text-zinc-300">{Math.round(value)}{unit}</span>
        </div>
    )
}

const MealItem = memo(({ item, mealId, onToggle, onSwap, hasTrainer }: any) => {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/50 transition-colors gap-3">
            <div className="flex items-center gap-3 min-w-0">
                <Button
                    variant="ghost" size="icon"
                    className={cn("w-7 h-7 rounded-xl border flex-shrink-0 transition-all duration-75 active:scale-95", item.is_checked ? "bg-emerald-500 border-emerald-400 text-zinc-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-zinc-900/50 border-zinc-800 text-zinc-600 hover:border-emerald-500/50 hover:text-emerald-500")}
                    onClick={(e) => { e.stopPropagation(); onToggle({ id: item.id, itemId: item.id, status: !item.is_checked, mealId: mealId }) }}
                >
                    <Check className={cn("w-4 h-4 transition-all duration-75", !item.is_checked ? "opacity-0 scale-50" : "opacity-100 scale-100")} strokeWidth={4} />
                </Button>
                <div className="flex flex-col min-w-0">
                    <div className="text-xs truncate sm:whitespace-normal">
                        {item.is_substituted ? (
                            <>
                                <span className="font-bold text-orange-500 mr-1.5">{item.substituted_quantity}</span>
                                <span className="text-orange-200">{item.substituted_food_name}</span>
                            </>
                        ) : (
                            <>
                                <span className="font-bold text-white mr-1.5">{item.quantity}</span>
                                <span className="text-zinc-300">{item.food_name}</span>
                            </>
                        )}
                    </div>
                    <div className="flex gap-2 text-[9px] font-bold text-zinc-600 uppercase mt-0.5">
                        <span>P: {Math.round(item.is_substituted ? (item.substituted_protein || 0) : (item.protein || 0))}</span>
                        <span>C: {Math.round(item.is_substituted ? (item.substituted_carbs || 0) : (item.carbs || 0))}</span>
                        <span>G: {Math.round(item.is_substituted ? (item.substituted_fat || 0) : (item.fat || 0))}</span>
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
        </div>
    )
})
MealItem.displayName = 'MealItem'

const MealRow = memo(({ meal, isOpen, onToggleAccordion, onToggleItem, onToggleGroup, onSwap, hasTrainer }: any) => {
    const mealTotal = meal.meal_items?.length || 0
    const mealCompleted = meal.meal_items?.filter((i: any) => i.is_checked).length || 0
    const isFullyComplete = mealTotal > 0 && mealCompleted === mealTotal

    return (
        <div className={cn("group relative rounded-3xl border transition-all duration-300 overflow-hidden", isFullyComplete ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-950/20 border-zinc-900 hover:border-zinc-800')}>
            <div className="p-5 flex items-center justify-between cursor-pointer select-none" onClick={onToggleAccordion}>
                <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex-shrink-0 aspect-square flex items-center justify-center transition-colors duration-200", isFullyComplete ? "bg-emerald-500 text-zinc-950" : "bg-zinc-900 text-zinc-600")}>
                        {isFullyComplete ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-zinc-100 uppercase italic tracking-wide">{meal.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{mealCompleted}/{mealTotal} Itens</p>
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
                    <ChevronDown className={cn("w-5 h-5 text-zinc-600 transition-transform duration-300", isOpen && "rotate-180")} />
                </div>
            </div>

            <div className={cn("grid transition-all duration-300 ease-in-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden">
                    <div className="p-5 pt-0 space-y-3">
                        <div className="h-px w-full bg-zinc-800/50 mb-4" />
                        {meal.meal_items?.length > 0 ? (
                            meal.meal_items.map((item: any) => (
                                <MealItem 
                                    key={item.id} 
                                    item={item} 
                                    mealId={meal.id} 
                                    onToggle={onToggleItem} 
                                    onSwap={onSwap} 
                                    hasTrainer={hasTrainer} 
                                />
                            ))
                        ) : (
                            <p className="text-xs text-zinc-500 text-center py-2">Sem itens cadastrados.</p>
                        )}

                        <div className="pt-4 flex flex-col gap-4">
                            <Button
                                size="sm" variant="ghost"
                                className={cn("w-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 border", isFullyComplete ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300")}
                                onClick={() => onToggleGroup({ id: meal.id, mealId: meal.id, status: !isFullyComplete })}
                            >
                                {isFullyComplete ? '✕ Desmarcar Todos' : '✓ Marcar Todos'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})
MealRow.displayName = 'MealRow'


