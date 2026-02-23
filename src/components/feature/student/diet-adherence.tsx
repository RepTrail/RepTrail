
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Utensils, Info, ChevronDown, Check, ChevronUp, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleMealItem, toggleMealGroup } from '@/actions/tracking-actions'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { SubstituteItemDialog } from './substitute-item-dialog'

import { estimateAllDietMacros } from '@/actions/diet-actions'
import { useRouter } from 'next/navigation'

interface DietAdherenceProps {
    diet: any
    allowEstimation?: boolean
}

export function DietAdherence({ diet, allowEstimation = false }: DietAdherenceProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [estimating, setEstimating] = useState(false)
    const [meals, setMeals] = useState<any[]>(diet.meals || [])
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})
    const [openMeals, setOpenMeals] = useState<Record<string, boolean>>({})

    // Sync state when prop changes (after router.refresh)
    useEffect(() => {
        if (diet.meals) {
            setMeals(diet.meals)
        }
    }, [diet.meals])

    // Calculate daily progress
    const allItems = meals.flatMap(m => m.meal_items || [])
    const totalItems = allItems.length
    const completedItems = allItems.filter(i => i.is_checked).length
    const dailyPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

    const toggleMealAccordion = (mealId: string) => {
        setOpenMeals(prev => ({ ...prev, [mealId]: !prev[mealId] }))
    }

    async function handleItemToggle(itemId: string, currentStatus: boolean, mealId: string) {
        // Optimistic update
        setMeals(prev => prev.map(m => {
            if (m.id !== mealId) return m
            return {
                ...m,
                meal_items: m.meal_items.map((i: any) => i.id === itemId ? { ...i, is_checked: !currentStatus } : i),
                // Recalculate meal checked status based on items? Optional visual cue
            }
        }))

        setLoadingMap(prev => ({ ...prev, [itemId]: true }))

        try {
            const res = await toggleMealItem(itemId, !currentStatus)
            if (!res.success) throw new Error(res.error)
        } catch (e) {
            // Revert
            setMeals(prev => prev.map(m => {
                if (m.id !== mealId) return m
                return {
                    ...m,
                    meal_items: m.meal_items.map((i: any) => i.id === itemId ? { ...i, is_checked: currentStatus } : i)
                }
            }))
            toast({ variant: 'destructive', title: 'Erro ao atualizar', description: 'Tente novamente.' })
        } finally {
            setLoadingMap(prev => ({ ...prev, [itemId]: false }))
        }
    }

    async function handleMealToggle(mealId: string, markAll: boolean) {
        // Optimistic update all items in meal
        setMeals(prev => prev.map(m => {
            if (m.id !== mealId) return m
            return {
                ...m,
                meal_items: m.meal_items.map((i: any) => ({ ...i, is_checked: markAll }))
            }
        }))

        setLoadingMap(prev => ({ ...prev, [`meal-${mealId}`]: true }))

        try {
            const res = await toggleMealGroup(mealId, markAll)
            if (!res.success) throw new Error(res.error)

            toast({
                title: markAll ? 'Refeição Completada!' : 'Refeição Reiniciada',
                description: markAll ? 'Todos os itens foram marcados.' : 'Itens desmarcados.'
            })
        } catch (e) {
            // Revert logic would be complex here, so we just reload or show error
            toast({ variant: 'destructive', title: 'Erro', description: 'Erro ao atualizar refeição.' })
        } finally {
            setLoadingMap(prev => ({ ...prev, [`meal-${mealId}`]: false }))
        }
    }

    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm border-t-zinc-700/10" suppressHydrationWarning>
            <CardContent className="p-8 space-y-8" suppressHydrationWarning>
                {/* Header */}
                {/* Header Section */}
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
                                                router.refresh()
                                            } else {
                                                throw new Error(res.error)
                                            }
                                        } catch (e: any) {
                                            toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível calcular os macros.' })
                                        } finally {
                                            setEstimating(false)
                                        }
                                    }}
                                    className="h-10 px-4 rounded-xl border-amber-500/30 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 font-bold uppercase italic tracking-widest text-[10px] gap-2"
                                >
                                    {estimating ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-3 h-3" />
                                    )}
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

                {/* Total Macros Summary */}
                <div className="grid grid-cols-6 gap-3 p-4 bg-zinc-950/30 border border-zinc-800/50 rounded-3xl" suppressHydrationWarning>
                    {(() => {
                        const t = meals.reduce((acc: any, meal: any) => {
                            const items = meal.meal_items || []
                            return {
                                p: acc.p + items.reduce((s: any, i: any) => s + (i.protein || 0), 0),
                                c: acc.c + items.reduce((s: any, i: any) => s + (i.carbs || 0), 0),
                                g: acc.g + items.reduce((s: any, i: any) => s + (i.fat || 0), 0),
                                f: acc.f + items.reduce((s: any, i: any) => s + (i.fiber || 0), 0),
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
                    })()}
                </div>

                {/* Meals List */}
                <div className="space-y-4">
                    {meals.map((meal: any) => {
                        const mealTotal = meal.meal_items?.length || 0
                        const mealCompleted = meal.meal_items?.filter((i: any) => i.is_checked).length || 0
                        const isFullyComplete = mealTotal > 0 && mealCompleted === mealTotal
                        const isOpen = openMeals[meal.id]

                        return (
                            <div
                                key={meal.id}
                                className={cn(
                                    "group relative rounded-3xl border transition-all duration-300 overflow-hidden",
                                    isFullyComplete
                                        ? 'bg-emerald-500/5 border-emerald-500/20'
                                        : 'bg-zinc-950/20 border-zinc-900 hover:border-zinc-800'
                                )}
                            >
                                {/* Accordion Header */}
                                <div
                                    className="p-5 flex items-center justify-between cursor-pointer select-none"
                                    onClick={() => toggleMealAccordion(meal.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                                            isFullyComplete ? "bg-emerald-500 text-zinc-950" : "bg-zinc-900 text-zinc-600"
                                        )}>
                                            {isFullyComplete ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-zinc-100 uppercase italic tracking-wide">
                                                {meal.name}
                                            </h4>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                                                {meal.time_of_day} • {mealCompleted}/{mealTotal} Itens
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* Macros Summary (Visible when collapsed) */}
                                        {!isOpen && (
                                            <div className="hidden sm:flex gap-3 mr-2 opacity-60">
                                                <MacroMini label="P" value={meal.meal_items?.reduce((acc: any, i: any) => acc + (i.protein || 0), 0)} />
                                                <MacroMini label="C" value={meal.meal_items?.reduce((acc: any, i: any) => acc + (i.carbs || 0), 0)} />
                                                <MacroMini label="G" value={meal.meal_items?.reduce((acc: any, i: any) => acc + (i.fat || 0), 0)} />
                                                <MacroMini label="F" value={meal.meal_items?.reduce((acc: any, i: any) => acc + (i.fiber || 0), 0)} />
                                            </div>
                                        )}
                                        <ChevronDown className={cn("w-5 h-5 text-zinc-600 transition-transform duration-300", isOpen && "rotate-180")} />
                                    </div>
                                </div>

                                {/* Accordion Content */}
                                <div className={cn(
                                    "grid transition-all duration-300 ease-in-out",
                                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                )}>
                                    <div className="overflow-hidden">
                                        <div className="p-5 pt-0 space-y-3">
                                            {/* Divider */}
                                            <div className="h-px w-full bg-zinc-800/50 mb-4" />

                                            {/* Items List */}
                                            {meal.meal_items?.length > 0 ? (
                                                meal.meal_items.map((item: any) => (
                                                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={cn(
                                                                    "w-6 h-6 rounded-lg border flex-shrink-0 transition-colors",
                                                                    item.is_checked
                                                                        ? "bg-emerald-500 border-emerald-500 text-zinc-950 hover:bg-emerald-600 hover:text-white"
                                                                        : "bg-transparent border-zinc-700 text-transparent hover:border-zinc-500"
                                                                )}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleItemToggle(item.id, item.is_checked, meal.id)
                                                                }}
                                                                disabled={loadingMap[item.id]}
                                                            >
                                                                <Check className="w-3 h-3" strokeWidth={4} />
                                                            </Button>
                                                            <div className="text-xs">
                                                                {item.is_substituted ? (
                                                                    <>
                                                                        <span className="font-bold text-orange-500 mr-1.5">{item.substituted_quantity}</span>
                                                                        <span className="text-orange-200">{item.substituted_food_name}</span>
                                                                        <span className="text-[9px] font-black text-orange-500/50 uppercase tracking-tighter ml-2">(SUBSTITUÍDO)</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span className="font-bold text-white mr-1.5">{item.quantity}</span>
                                                                        <span className="text-zinc-300">{item.food_name}</span>
                                                                        {item.approx_measure && <span className="text-zinc-500 ml-1">({item.approx_measure})</span>}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {!item.is_checked && !allowEstimation && (
                                                                <SubstituteItemDialog
                                                                    item={item}
                                                                    onSuccess={(updatedData) => {
                                                                        setMeals(prev => prev.map(m => {
                                                                            if (m.id !== meal.id) return m
                                                                            return {
                                                                                ...m,
                                                                                meal_items: m.meal_items.map((i: any) => i.id === item.id ? updatedData : i)
                                                                            }
                                                                        }))
                                                                    }}
                                                                />
                                                            )}
                                                            {/* Item Macros */}
                                                            <div className="flex gap-2 text-[9px] font-bold text-zinc-600 uppercase">
                                                                <span>P: {Math.round(item.protein || 0)}</span>
                                                                <span>C: {Math.round(item.carbs || 0)}</span>
                                                                <span>G: {Math.round(item.fat || 0)}</span>
                                                                <span>F: {Math.round(item.fiber || 0)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-zinc-500 text-center py-2">Sem itens cadastrados nesta refeição.</p>
                                            )}

                                            {/* Actions Footer */}
                                            <div className="pt-4 flex flex-col gap-4">
                                                <div className="flex gap-4 items-center">
                                                    <MacroMini label="P" value={meal.meal_items?.reduce((acc: any, i: any) => acc + (i.protein || 0), 0)} unit="g" />
                                                    <MacroMini label="C" value={meal.meal_items?.reduce((acc: any, i: any) => acc + (i.carbs || 0), 0)} unit="g" />
                                                    <MacroMini label="G" value={meal.meal_items?.reduce((acc: any, i: any) => acc + (i.fat || 0), 0)} unit="g" />
                                                </div>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className={cn(
                                                        "w-full text-[10px] font-black uppercase tracking-widest transition-all border",
                                                        isFullyComplete
                                                            ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50"
                                                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/50"
                                                    )}
                                                    onClick={() => handleMealToggle(meal.id, !isFullyComplete)}
                                                    disabled={loadingMap[`meal-${meal.id}`]}
                                                >
                                                    {isFullyComplete ? '✕ Desmarcar Todos' : '✓ Marcar Todos'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
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
