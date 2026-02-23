'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Plus,
    Trash2,
    Utensils,
    PlusCircle,
    Loader2,
    ArrowLeft,
    Sparkles,
    Pencil,
    Check,
    X
} from "lucide-react"
import {
    addMealToDiet,
    addMealItem,
    updateMealItem,
    removeMealItem,
    removeMeal,
    estimateMacros,
    estimateAllDietMacros,
    updateDietMeta
} from "@/actions/diet-actions"

interface MealItem {
    id: string
    food_name: string
    quantity: string
    approx_measure: string
    protein: number
    carbs: number
    fat: number
    calories?: number
}

interface Meal {
    id: string
    name: string
    time_of_day: string
    order_index: number
    notes: string
    meal_items: MealItem[]
}

interface DietBuilderProps {
    diet: {
        id: string
        name: string
        meals: Meal[]
    }
    backHref?: string
}

export function DietBuilder({ diet, backHref = '/dashboard/trainer/diets' }: DietBuilderProps) {
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})
    const [newMealName, setNewMealName] = useState('')
    const [newMealTime, setNewMealTime] = useState('')

    // Inline name editing
    const [isEditingName, setIsEditingName] = useState(false)
    const [editName, setEditName] = useState(diet.name)
    const [isSavingName, setIsSavingName] = useState(false)
    const nameInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditingName) nameInputRef.current?.focus()
    }, [isEditingName])

    async function handleSaveName() {
        if (!editName.trim()) return
        setIsSavingName(true)
        const res = await updateDietMeta(diet.id, editName)
        setIsSavingName(false)
        if (res.success) setIsEditingName(false)
    }

    function handleCancelName() {
        setEditName(diet.name)
        setIsEditingName(false)
    }

    // Macro Calculations
    const totals = diet.meals?.reduce((acc, meal) => {
        meal.meal_items?.forEach(item => {
            acc.p += Number(item.protein) || 0
            acc.c += Number(item.carbs) || 0
            acc.f += Number(item.fat) || 0
        })
        return acc
    }, { p: 0, c: 0, f: 0 }) || { p: 0, c: 0, f: 0 }

    const totalKcal = Math.round((totals.p * 4) + (totals.c * 4) + (totals.f * 9))
    const isEstimatingAll = loadingMap['estimate-all']

    async function handleEstimateAll() {
        setLoadingMap(prev => ({ ...prev, 'estimate-all': true }))
        const res = await estimateAllDietMacros(diet.id)
        if (res.error) alert(`Erro ao calcular tudo: ${res.error}`)
        setLoadingMap(prev => ({ ...prev, 'estimate-all': false }))
    }

    async function handleAddMeal() {
        if (!newMealName) return
        setLoadingMap(prev => ({ ...prev, 'add-meal': true }))
        const res = await addMealToDiet(diet.id, newMealName, newMealTime || "08:00")
        if (res?.error) {
            alert(`Erro ao adicionar refeição: ${res.error}`)
        } else {
            setNewMealName('')
            setNewMealTime('')
        }
        setLoadingMap(prev => ({ ...prev, 'add-meal': false }))
    }

    async function handleAddItem(mealId: string) {
        setLoadingMap(prev => ({ ...prev, [`add-item-${mealId}`]: true }))
        const res = await addMealItem(mealId, diet.id, {
            food_name: 'Novo Alimento',
            quantity: '',
            approx_measure: '',
            protein: 0,
            carbs: 0,
            fat: 0
        })
        if (res?.error) {
            alert(`Erro ao adicionar item: ${res.error}\n\nCertifique-se de ter rodado o SQL de migração dos Macros no Supabase.`)
        }
        setLoadingMap(prev => ({ ...prev, [`add-item-${mealId}`]: false }))
    }

    async function handleUpdateItem(id: string, data: any) {
        setLoadingMap(prev => ({ ...prev, [`save-${id}`]: true }))
        const res = await updateMealItem(id, diet.id, data)
        if (res?.error) {
            console.error('Update error:', res.error)
        }
        setLoadingMap(prev => ({ ...prev, [`save-${id}`]: false }))
    }

    async function handleUpdateMeal(id: string, data: any) {
        // Implement when needed
    }

    async function handleRemoveItem(id: string) {
        setLoadingMap(prev => ({ ...prev, [`delete-${id}`]: true }))
        const res = await removeMealItem(id, diet.id)
        if (res?.error) alert(`Erro ao remover item: ${res.error}`)
    }

    async function handleRemoveMeal(id: string) {
        if (!confirm('Remover esta refeição inteira?')) return
        setLoadingMap(prev => ({ ...prev, [`delete-meal-${id}`]: true }))
        const res = await removeMeal(id, diet.id)
        if (res?.error) alert(`Erro ao remover refeição: ${res.error}`)
        setLoadingMap(prev => ({ ...prev, [`delete-meal-${id}`]: false }))
    }


    return (
        <div className="space-y-8" suppressHydrationWarning>
            {/* Header / Totals */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2 flex-1">
                    {isEditingName ? (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200 bg-zinc-900/60 border border-zinc-700/60 rounded-2xl p-5 space-y-3 shadow-xl">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nome da Dieta</label>
                            <Input
                                ref={nameInputRef}
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') handleCancelName() }}
                                className="bg-zinc-950 border-zinc-700 text-white text-lg font-black h-12 rounded-xl focus-visible:ring-green-500/30 focus-visible:border-green-500/50"
                                placeholder="Nome da dieta..."
                            />
                            <div className="flex items-center gap-2 pt-1">
                                <Button
                                    onClick={handleSaveName}
                                    disabled={isSavingName || !editName.trim()}
                                    className="h-9 px-4 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg shadow-green-500/20 active:scale-95"
                                >
                                    {isSavingName ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Check className="w-3 h-3 mr-1.5" />Salvar</>}
                                </Button>
                                <Button
                                    onClick={handleCancelName}
                                    disabled={isSavingName}
                                    variant="ghost"
                                    className="h-9 px-4 bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all border border-zinc-700/50 hover:border-zinc-600"
                                >
                                    <X className="w-3 h-3 mr-1.5" />Cancelar
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="group flex items-center gap-3 cursor-pointer w-fit"
                            onClick={() => setIsEditingName(true)}
                        >
                            <h1 className="text-3xl font-bold text-white font-sans group-hover:text-green-400 transition-colors duration-200 border-b border-transparent group-hover:border-green-400/40 pb-0.5">
                                {editName}
                            </h1>
                            <button
                                className="p-2 rounded-xl text-zinc-600 hover:text-green-400 hover:bg-green-400/10 transition-all border border-transparent hover:border-green-400/20 active:scale-90"
                                title="Editar nome da dieta"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Resumo Nutricional do Plano</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
                        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl min-w-[80px] text-center">
                            <span className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">Proteína</span>
                            <span className="text-xl font-bold text-blue-400">{Math.round(totals.p)}<small className="text-[10px] ml-0.5">g</small></span>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl min-w-[80px] text-center">
                            <span className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">Carbs</span>
                            <span className="text-xl font-bold text-orange-400">{Math.round(totals.c)}<small className="text-[10px] ml-0.5">g</small></span>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl min-w-[80px] text-center">
                            <span className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">Gordura</span>
                            <span className="text-xl font-bold text-yellow-500">{Math.round(totals.f)}<small className="text-[10px] ml-0.5">g</small></span>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl min-w-[100px] text-center shadow-[0_0_15px_-5px_rgba(59,130,246,0.2)]">
                            <span className="block text-[10px] text-blue-400 uppercase font-bold mb-1">Total Kcal</span>
                            <span className="text-xl font-bold text-white">{totalKcal}</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleEstimateAll}
                        disabled={isEstimatingAll}
                        className="w-full sm:w-auto h-[68px] px-6 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 border border-emerald-500/20 rounded-xl font-black uppercase tracking-widest text-[10px] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group shadow-xl"
                    >
                        {isEstimatingAll ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                <span>Calcular Tudo</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {diet.meals?.map((meal, index) => {
                    const mealP = meal.meal_items?.reduce((s, i) => s + (Number(i.protein) || 0), 0)
                    const mealC = meal.meal_items?.reduce((s, i) => s + (Number(i.carbs) || 0), 0)
                    const mealF = meal.meal_items?.reduce((s, i) => s + (Number(i.fat) || 0), 0)
                    const mealKcal = Math.round((mealP * 4) + (mealC * 4) + (mealF * 9))

                    return (
                        <Card key={meal.id} className="bg-zinc-950 border-zinc-800 overflow-hidden shadow-xl" suppressHydrationWarning>
                            <div className="p-4 bg-zinc-900/40 border-b border-zinc-800/50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-zinc-800 p-2.5 rounded-xl border border-zinc-700/50">
                                        <Utensils className="w-4 h-4 text-green-400" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-zinc-100 italic">Refeição {index + 1}</h3>
                                            <span className="text-sm font-medium text-zinc-500">
                                                {meal.name}
                                            </span>
                                            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                {mealKcal} kcal
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="hidden md:flex gap-3 mr-4 text-[10px] uppercase font-bold">
                                        <span className="text-blue-400/80">P: {Math.round(mealP)}g</span>
                                        <span className="text-orange-400/80">C: {Math.round(mealC)}g</span>
                                        <span className="text-yellow-500/80">G: {Math.round(mealF)}g</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveMeal(meal.id)}
                                        disabled={loadingMap[`delete-meal-${meal.id}`]}
                                        className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-0" suppressHydrationWarning>
                                <div className="divide-y divide-zinc-900/50">
                                    {meal.meal_items?.map((item) => (
                                        <div key={item.id} className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-end group transition-colors hover:bg-zinc-900/20">
                                            <div className="lg:col-span-4 space-y-1.5">
                                                <Label className="text-[10px] text-zinc-600 uppercase font-bold tracking-tight">Alimento</Label>
                                                <Input
                                                    defaultValue={item.food_name}
                                                    onBlur={(e) => handleUpdateItem(item.id, { food_name: e.target.value })}
                                                    className="bg-zinc-900/50 border-zinc-800 text-sm h-9 focus:ring-1 focus:ring-green-500/20 text-white"
                                                />
                                            </div>
                                            <div className="lg:col-span-2 space-y-1.5">
                                                <Label className="text-[10px] text-zinc-600 uppercase font-bold tracking-tight">Quantidade</Label>
                                                <Input
                                                    defaultValue={item.quantity}
                                                    onBlur={(e) => handleUpdateItem(item.id, { quantity: e.target.value })}
                                                    placeholder="Opcional (ex: 100g)"
                                                    className="bg-zinc-900/50 border-zinc-800 text-sm h-9 text-center text-white"
                                                />
                                            </div>
                                            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] text-zinc-600 uppercase font-bold tracking-tight">Medida</Label>
                                                    <Input
                                                        defaultValue={item.approx_measure}
                                                        onBlur={(e) => handleUpdateItem(item.id, { approx_measure: e.target.value })}
                                                        placeholder="Opcional (ex: 1 colher)"
                                                        className="bg-zinc-900/50 border-zinc-800 text-xs h-9 text-white"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] text-blue-500/50 uppercase font-bold tracking-tight">Prot</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        defaultValue={item.protein}
                                                        onBlur={(e) => handleUpdateItem(item.id, { protein: parseFloat(e.target.value) || 0 })}
                                                        className="bg-zinc-900/50 border-zinc-800 text-xs h-9 text-center text-blue-400 font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] text-orange-500/50 uppercase font-bold tracking-tight">Carb</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        defaultValue={item.carbs}
                                                        onBlur={(e) => handleUpdateItem(item.id, { carbs: parseFloat(e.target.value) || 0 })}
                                                        className="bg-zinc-900/50 border-zinc-800 text-xs h-9 text-center text-orange-400 font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] text-yellow-500/50 uppercase font-bold tracking-tight">Gord</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        defaultValue={item.fat}
                                                        onBlur={(e) => handleUpdateItem(item.id, { fat: parseFloat(e.target.value) || 0 })}
                                                        className="bg-zinc-900/50 border-zinc-800 text-xs h-9 text-center text-yellow-500 font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="lg:col-span-1 flex items-center justify-center gap-1 pb-0.5">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={loadingMap[`estimate-${item.id}`] || !item.food_name}
                                                    onClick={async () => {
                                                        setLoadingMap(prev => ({ ...prev, [`estimate-${item.id}`]: true }))
                                                        const res = await estimateMacros(item.food_name, item.quantity)
                                                        if (res.success && res.macros) {
                                                            await handleUpdateItem(item.id, res.macros)
                                                            // We might need to force a refresh or trust that revalidatePath (if any) works,
                                                            // but handleUpdateItem already handles loadingMap for saving.
                                                        } else if (res.error) {
                                                            alert(`Erro ao calcular: ${res.error}`)
                                                        }
                                                        setLoadingMap(prev => ({ ...prev, [`estimate-${item.id}`]: false }))
                                                    }}
                                                    className="text-zinc-700 hover:text-emerald-400 h-8 w-8 transition-colors group-hover:bg-emerald-400/5"
                                                    title="Calcular macros com IA"
                                                >
                                                    {loadingMap[`estimate-${item.id}`] ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <Sparkles className="w-3.5 h-3.5" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={loadingMap[`delete-${item.id}`]}
                                                    className="text-zinc-700 hover:text-red-400 h-8 w-8 transition-colors group-hover:bg-red-400/5"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-zinc-900/20 border-t border-zinc-900/50">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAddItem(meal.id)}
                                        disabled={loadingMap[`add-item-${meal.id}`]}
                                        className="w-full border-dashed border-zinc-800 bg-transparent hover:bg-zinc-900 hover:text-zinc-100 text-zinc-500 h-10 rounded-xl"
                                    >
                                        {loadingMap[`add-item-${meal.id}`] ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <PlusCircle className="w-3 h-3 mr-2" />}
                                        Adicionar Item à Refeição
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}

                {/* New Meal Form */}
                <div className="bg-zinc-900/30 p-8 rounded-2xl border-2 border-dashed border-zinc-800/50 flex flex-col md:flex-row gap-6 items-end mt-12 transition-colors hover:border-zinc-700/50 group">
                    <div className="flex-1 space-y-2.5 w-full">
                        <Label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest ml-1">Nome da Nova Refeição</Label>
                        <Input
                            placeholder="Ex: Café da Manhã, Almoço..."
                            value={newMealName}
                            onChange={(e) => setNewMealName(e.target.value)}
                            className="bg-zinc-950 border-zinc-800 h-11 rounded-xl text-white placeholder:text-zinc-700 font-medium"
                        />
                    </div>
                    <Button
                        onClick={handleAddMeal}
                        disabled={loadingMap['add-meal'] || !newMealName}
                        className="bg-white text-zinc-950 hover:bg-zinc-200 w-full md:w-auto h-11 px-8 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                        {loadingMap['add-meal'] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Adicionar Refeição
                    </Button>
                </div>

                {/* Navigation Footer */}
                <div className="pt-12 flex justify-center border-t border-zinc-800/30">
                    <Button
                        asChild
                        variant="ghost"
                        className="text-zinc-500 hover:text-white hover:bg-zinc-900 gap-2 px-6 h-12 rounded-xl transition-all"
                    >
                        <Link href={backHref || '/dashboard/trainer/diets'}>
                            <ArrowLeft className="w-4 h-4" />
                            Voltar para a Biblioteca de Dietas
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
