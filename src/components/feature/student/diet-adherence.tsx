'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Utensils, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logMealCheck } from '@/actions/diet-actions'
import { useToast } from '@/hooks/use-toast'

interface DietAdherenceProps {
    diet: any
}

export function DietAdherence({ diet }: DietAdherenceProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState<string | null>(null)

    const meals = diet.meals || []
    const completedCount = meals.filter((m: any) => m.is_checked).length
    const totalCount = meals.length
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

    async function handleToggle(mealId: string, currentStatus: boolean) {
        setLoading(mealId)
        const res = await logMealCheck(mealId, !currentStatus)
        if (res.success) {
            toast({
                title: !currentStatus ? 'Refeição concluída!' : 'Refeição desmarcada',
                description: !currentStatus ? 'Bom trabalho mantendo a dieta!' : 'Status atualizado.'
            })
        } else {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Erro ao atualizar status da refeição.'
            })
        }
        setLoading(null)
    }

    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm border-t-zinc-700/10">
            <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-emerald-500" />
                            <h3 className="text-xl font-black text-white italic uppercase">{diet.name}</h3>
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            Refeições do Dia • {completedCount}/{totalCount} Concluídas
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-2xl font-black text-emerald-500 italic">{Math.round(percentage)}%</span>
                        <Progress value={percentage} className="h-1.5 w-24 bg-zinc-800" indicatorClassName="bg-emerald-500" />
                    </div>
                </div>

                <div className="space-y-4">
                    {meals.map((meal: any) => (
                        <div
                            key={meal.id}
                            className={`
                                group relative p-5 rounded-3xl border transition-all duration-300
                                ${meal.is_checked
                                    ? 'bg-emerald-500/5 border-emerald-500/20'
                                    : 'bg-zinc-950/20 border-zinc-900 hover:border-zinc-800'}
                            `}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={loading === meal.id}
                                        onClick={() => handleToggle(meal.id, meal.is_checked)}
                                        className={`
                                            w-10 h-10 rounded-2xl border transition-all
                                            ${meal.is_checked
                                                ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                                                : 'bg-zinc-900 text-zinc-600 border-zinc-800 hover:text-emerald-500 hover:border-emerald-500/50'}
                                        `}
                                    >
                                        {meal.is_checked ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                    </Button>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-zinc-100 uppercase italic tracking-wide">
                                                {meal.name}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0.5 pt-1">
                                            {meal.meal_items?.length > 0 ? (
                                                meal.meal_items.map((item: any, idx: number) => (
                                                    <p key={idx} className="text-[10px] text-zinc-500 font-medium">
                                                        <span className="text-zinc-300 font-bold">{item.quantity}</span> {item.food_name}
                                                        {item.approx_measure && <span className="text-zinc-600 ml-1">({item.approx_measure})</span>}
                                                    </p>
                                                ))
                                            ) : (
                                                <p className="text-[10px] text-zinc-500 font-medium">Sem itens cadastrados</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Button variant="ghost" size="icon" className="text-zinc-700 hover:text-zinc-300">
                                    <Info className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Nutrition Summary (Mini) */}
                            {meal.is_checked && (
                                <div className="mt-4 pt-4 border-t border-emerald-500/10 flex gap-6">
                                    <MacroMini label="P" value={meal.meal_items?.reduce((acc: any, i: any) => acc + (i.protein || 0), 0)} unit="g" />
                                    <MacroMini label="C" value={meal.meal_items?.reduce((acc: any, i: any) => acc + (i.carbs || 0), 0)} unit="g" />
                                    <MacroMini label="F" value={meal.meal_items?.reduce((acc: any, i: any) => acc + (i.fat || 0), 0)} unit="g" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function MacroMini({ label, value, unit }: any) {
    return (
        <div className="flex items-baseline gap-1">
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{label}:</span>
            <span className="text-[10px] font-black text-emerald-500 italic">{Math.round(value)}{unit}</span>
        </div>
    )
}
