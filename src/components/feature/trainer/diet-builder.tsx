'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
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
    X,
    Repeat2,
    ListRestart,
    Save
} from "lucide-react"
import { cn } from '@/lib/utils'
import {
    addMealToDiet,
    addMealItem,
    updateMealItem,
    removeMealItem,
    removeMeal,
    estimateMacros,
    estimateAllDietMacros,
    updateDietMeta,
    suggestSubstitution
} from "@/actions/diet-actions"

interface MealItem {
    id: string
    food_name: string
    quantity: string
    approx_measure?: string
    protein: number
    carbs: number
    fat: number
    fiber?: number
    calories?: number
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

interface DietBuilderProps {
    diet: {
        id: string
        name: string
        meals: Meal[]
    }
    backHref?: string
}

// Extracted Component to prevent lag
function MealItemRow({
    item,
    dietId,
    onRemove
}: {
    item: MealItem;
    dietId: string;
    onRemove: (id: string) => Promise<void>;
}) {
    const [loading, setLoading] = useState<Record<string, boolean>>({})

    // Local state for all fields to ensure zero-lag typing
    const [foodName, setFoodName] = useState(item.food_name)
    const [quantity, setQuantity] = useState(item.quantity)
    const [protein, setProtein] = useState(item.protein)
    const [carbs, setCarbs] = useState(item.carbs)
    const [fat, setFat] = useState(item.fat)

    const [hasSubstitute, setHasSubstitute] = useState(item.has_substitute || false)
    const [subFoodName, setSubFoodName] = useState(item.sub_food_name || '')
    const [subQuantity, setSubQuantity] = useState(item.sub_quantity || '')
    const [subProtein, setSubProtein] = useState(item.sub_protein || 0)
    const [subCarbs, setSubCarbs] = useState(item.sub_carbs || 0)
    const [subFat, setSubFat] = useState(item.sub_fat || 0)
    const [isSaved, setIsSaved] = useState(true)

    // Sync from props if item data changes (like after "Estimate All")
    useEffect(() => {
        setFoodName(item.food_name)
        setQuantity(item.quantity)
        setProtein(item.protein)
        setCarbs(item.carbs)
        setFat(item.fat)
        setHasSubstitute(item.has_substitute || false)
        setSubFoodName(item.sub_food_name || '')
        setSubQuantity(item.sub_quantity || '')
        setSubProtein(item.sub_protein || 0)
        setSubCarbs(item.sub_carbs || 0)
        setSubFat(item.sub_fat || 0)
        setIsSaved(true)
    }, [item])

    const handleSave = async () => {
        setLoading(prev => ({ ...prev, save: true }))
        const res = await updateMealItem(item.id, dietId, {
            food_name: foodName,
            quantity: quantity,
            protein,
            carbs,
            fat,
            has_substitute: hasSubstitute,
            sub_food_name: subFoodName,
            sub_quantity: subQuantity,
            sub_protein: subProtein,
            sub_carbs: subCarbs,
            sub_fat: subFat
        })
        if (!res.error) setIsSaved(true)
        setLoading(prev => ({ ...prev, save: false }))
    }

    const handleChange = (setter: any, val: any) => {
        setter(val)
        setIsSaved(false)
    }

    const handleEstimateMain = async () => {
        setLoading(prev => ({ ...prev, estimate: true }))
        const res = await estimateMacros(foodName, quantity)
        if (res.success && res.macros) {
            setProtein(res.macros.protein)
            setCarbs(res.macros.carbs)
            setFat(res.macros.fat)
            setIsSaved(false)
        }
        setLoading(prev => ({ ...prev, estimate: false }))
    }

    const handleEstimateSub = async () => {
        setLoading(prev => ({ ...prev, estimateSub: true }))
        const res = await estimateMacros(subFoodName, subQuantity)
        if (res.success && res.macros) {
            setSubProtein(res.macros.protein)
            setSubCarbs(res.macros.carbs)
            setSubFat(res.macros.fat)
            setIsSaved(false)
        }
        setLoading(prev => ({ ...prev, estimateSub: false }))
    }

    const handleSuggestSub = async () => {
        setLoading(prev => ({ ...prev, suggestSub: true }))
        const res = await suggestSubstitution(foodName, quantity)
        if (res.success && res.suggestion) {
            setHasSubstitute(true)
            setSubFoodName(res.suggestion.food_name)
            setSubQuantity(res.suggestion.quantity)
            setSubProtein(res.suggestion.protein)
            setSubCarbs(res.suggestion.carbs)
            setSubFat(res.suggestion.fat)
            setIsSaved(false)
        }
        setLoading(prev => ({ ...prev, suggestSub: false }))
    }

    const handleClearSub = () => {
        setSubFoodName('')
        setSubQuantity('')
        setSubProtein(0)
        setSubCarbs(0)
        setSubFat(0)
        setHasSubstitute(false)
        setIsSaved(false)
    }

    return (
        <div className={cn(
            "group relative transition-all duration-300",
            !isSaved && "bg-orange-500/5"
        )}>
            {/* Original Item Row */}
            <div className={cn(
                "p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-end hover:bg-zinc-900/20 border-l-2 transition-all",
                isSaved ? "border-l-transparent" : "border-l-orange-500 shadow-[inset_10px_0_15px_-10px_rgba(249,115,22,0.1)]"
            )}>
                <div className="lg:col-span-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label className="text-[10px] text-zinc-600 uppercase font-bold tracking-tight">Alimento</Label>
                        {!isSaved && <span className="text-[8px] font-black text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded uppercase animate-pulse">Pendente</span>}
                    </div>
                    <Input
                        value={foodName}
                        onChange={(e) => handleChange(setFoodName, e.target.value)}
                        className="bg-zinc-900 border-zinc-700 text-sm h-9 text-white focus:border-green-500/50"
                    />
                </div>
                <div className="lg:col-span-2 space-y-1.5">
                    <Label className="text-[10px] text-zinc-600 uppercase font-bold tracking-tight">Quantidade</Label>
                    <Input
                        value={quantity}
                        onChange={(e) => handleChange(setQuantity, e.target.value)}
                        placeholder="Ex: 100g"
                        className="bg-zinc-900 border-zinc-700 text-sm h-9 text-center text-white focus:border-green-500/50"
                    />
                </div>
                <div className="lg:col-span-4 grid grid-cols-3 gap-2">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] text-blue-500/50 uppercase font-bold tracking-tight">Prot</Label>
                        <Input
                            type="number"
                            step="0.1"
                            value={protein}
                            onChange={(e) => handleChange(setProtein, parseFloat(e.target.value) || 0)}
                            className="bg-zinc-900 border-zinc-700 text-xs h-9 text-center text-blue-400 font-medium"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[10px] text-orange-500/50 uppercase font-bold tracking-tight">Carb</Label>
                        <Input
                            type="number"
                            step="0.1"
                            value={carbs}
                            onChange={(e) => handleChange(setCarbs, parseFloat(e.target.value) || 0)}
                            className="bg-zinc-900 border-zinc-700 text-xs h-9 text-center text-orange-400 font-medium"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[10px] text-yellow-500/50 uppercase font-bold tracking-tight">Gord</Label>
                        <Input
                            type="number"
                            step="0.1"
                            value={fat}
                            onChange={(e) => handleChange(setFat, parseFloat(e.target.value) || 0)}
                            className="bg-zinc-900 border-zinc-700 text-xs h-9 text-center text-yellow-500 font-medium"
                        />
                    </div>
                </div>
                <div className="lg:col-span-3 flex items-center justify-end gap-2 pb-0.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={loading.estimate || !foodName}
                        onClick={handleEstimateMain}
                        className="text-zinc-600 hover:text-emerald-400 h-9 w-9 hover:bg-emerald-400/5 border border-zinc-800"
                        title="Calcular macros com IA"
                    >
                        {loading.estimate ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleChange(setHasSubstitute, !hasSubstitute)}
                        className={cn("h-9 w-9 border", hasSubstitute ? "text-orange-500 bg-orange-500/10 border-orange-500/20" : "text-zinc-600 hover:text-orange-400 hover:bg-orange-400/5 border-zinc-800")}
                        title="Adicionar/Remover Substituição"
                    >
                        <Repeat2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(item.id)}
                        className="text-zinc-600 hover:text-red-400 h-9 w-9 hover:bg-red-400/5 border border-zinc-800"
                        title="Remover item"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSave}
                        disabled={loading.save || (isSaved && !loading.save)}
                        className={cn(
                            "h-9 w-9 border transition-all shadow-lg",
                            isSaved
                                ? "bg-zinc-800/50 text-zinc-600 border-zinc-800"
                                : "bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-400"
                        )}
                        title="Salvar Alterações"
                    >
                        {loading.save ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Substitution Row */}
            {hasSubstitute && (
                <div className="px-4 pb-4 pt-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-end bg-orange-500/5 border-t border-orange-500/10 transition-all duration-300">
                    <div className="lg:col-span-3 space-y-1.5">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            <Label className="text-[10px] text-orange-500 uppercase font-black tracking-widest">Substituição</Label>
                        </div>
                        <Input
                            value={subFoodName}
                            onChange={(e) => handleChange(setSubFoodName, e.target.value)}
                            placeholder="Nome da substituição..."
                            className="bg-zinc-950 border-zinc-700 text-sm h-9 text-white focus:border-orange-500/50"
                        />
                    </div>
                    <div className="lg:col-span-2 space-y-1.5">
                        <Label className="text-[10px] text-zinc-600 uppercase font-bold tracking-tight">Quantidade</Label>
                        <Input
                            value={subQuantity}
                            onChange={(e) => handleChange(setSubQuantity, e.target.value)}
                            placeholder="Ex: 100g"
                            className="bg-zinc-950 border-zinc-700 text-sm h-9 text-center text-white focus:border-orange-500/50"
                        />
                    </div>
                    <div className="lg:col-span-4 grid grid-cols-3 gap-2">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-blue-500/50 uppercase font-bold tracking-tight text-center">Prot</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={subProtein}
                                onChange={(e) => handleChange(setSubProtein, parseFloat(e.target.value) || 0)}
                                className="bg-zinc-950 border-zinc-700 text-xs h-9 text-center text-blue-400/80 font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-orange-500/50 uppercase font-bold tracking-tight text-center">Carb</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={subCarbs}
                                onChange={(e) => handleChange(setSubCarbs, parseFloat(e.target.value) || 0)}
                                className="bg-zinc-950 border-zinc-700 text-xs h-9 text-center text-orange-400/80 font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-yellow-500/50 uppercase font-bold tracking-tight text-center">Gord</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={subFat}
                                onChange={(e) => handleChange(setSubFat, parseFloat(e.target.value) || 0)}
                                className="bg-zinc-950 border-zinc-700 text-xs h-9 text-center text-yellow-500/80 font-medium"
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-3 flex items-center justify-end gap-2 pb-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={loading.estimateSub || !subFoodName}
                            onClick={handleEstimateSub}
                            className="text-zinc-600 hover:text-orange-400 h-9 w-9 border border-zinc-800 bg-zinc-900/50"
                            title="Calcular macros da substituição com IA"
                        >
                            {loading.estimateSub ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={loading.suggestSub}
                            onClick={handleSuggestSub}
                            className="text-zinc-600 hover:text-purple-400 h-9 w-9 border border-zinc-800 bg-zinc-900/50"
                            title="Sugerir substituição similar com IA"
                        >
                            {loading.suggestSub ? <Loader2 className="w-4 h-4 animate-spin" /> : <Utensils className="w-4 h-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClearSub}
                            className="text-zinc-600 hover:text-red-400 h-9 w-9 border border-zinc-800 bg-zinc-900/50"
                            title="Limpar campos da substituição"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSave}
                            disabled={loading.save || (isSaved && !loading.save)}
                            className={cn(
                                "h-9 w-9 border transition-all shadow-lg",
                                isSaved
                                    ? "bg-zinc-800/50 text-zinc-600 border-zinc-800"
                                    : "bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-400"
                            )}
                            title="Salvar Alterações"
                        >
                            {loading.save ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
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

    const dietIdRef = useRef(diet.id)

    useEffect(() => {
        if (isEditingName) nameInputRef.current?.focus()
    }, [isEditingName])

    async function handleSaveName() {
        if (!editName.trim()) return
        setIsSavingName(true)
        const res = await updateDietMeta(dietIdRef.current, editName)
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
        const res = await estimateAllDietMacros(dietIdRef.current)
        if (res.error) alert(`Erro ao calcular tudo: ${res.error}`)
        setLoadingMap(prev => ({ ...prev, 'estimate-all': false }))
    }

    async function handleAddMeal() {
        if (!newMealName) return
        setLoadingMap(prev => ({ ...prev, 'add-meal': true }))
        const res = await addMealToDiet(dietIdRef.current, newMealName, newMealTime || "08:00")
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
        const res = await addMealItem(mealId, dietIdRef.current, {
            food_name: 'Novo Alimento',
            quantity: '',
            approx_measure: '',
            protein: 0,
            carbs: 0,
            fat: 0
        })
        if (res?.error) {
            alert(`Erro ao adicionar item: ${res.error}`)
        }
        setLoadingMap(prev => ({ ...prev, [`add-item-${mealId}`]: false }))
    }

    async function handleRemoveItem(id: string) {
        setLoadingMap(prev => ({ ...prev, [`delete-${id}`]: true }))
        const res = await removeMealItem(id, dietIdRef.current)
        if (res?.error) alert(`Erro ao remover item: ${res.error}`)
    }

    async function handleRemoveMeal(id: string) {
        if (!confirm('Remover esta refeição inteira?')) return
        setLoadingMap(prev => ({ ...prev, [`delete-meal-${id}`]: true }))
        const res = await removeMeal(id, dietIdRef.current)
        if (res?.error) alert(`Erro ao remover refeição: ${res.error}`)
        setLoadingMap(prev => ({ ...prev, [`delete-meal-${id}`]: false }))
    }

    return (
        <div className="space-y-8" suppressHydrationWarning>
            {/* Header / Totals */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2 flex-1">
                    {isEditingName ? (
                        <div className="bg-zinc-900/60 border border-zinc-700/60 rounded-2xl p-5 space-y-3 shadow-xl">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nome da Dieta</label>
                            <Input
                                ref={nameInputRef}
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') handleCancelName() }}
                                className="bg-zinc-950 border-zinc-700 text-white text-lg font-black h-12 rounded-xl"
                                placeholder="Nome da dieta..."
                            />
                            <div className="flex items-center gap-2 pt-1">
                                <Button
                                    onClick={handleSaveName}
                                    disabled={isSavingName || !editName.trim()}
                                    className="h-9 px-4 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-green-500/20"
                                >
                                    {isSavingName ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Check className="w-3 h-3 mr-1.5" />Salvar</>}
                                </Button>
                                <Button
                                    onClick={handleCancelName}
                                    disabled={isSavingName}
                                    variant="ghost"
                                    className="h-9 px-4 bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl border border-zinc-700/50 hover:border-zinc-600"
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
                            <h1 className="text-3xl font-bold text-white font-sans group-hover:text-green-400 border-b border-transparent group-hover:border-green-400/40 pb-0.5">
                                {editName}
                            </h1>
                            <button
                                className="p-2 rounded-xl text-zinc-600 hover:text-green-400 hover:bg-green-400/10 border border-transparent hover:border-green-400/20"
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
                        className="w-full sm:w-auto h-[68px] px-6 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 border border-emerald-500/20 rounded-xl font-black uppercase tracking-widest text-[10px] flex flex-col items-center justify-center gap-1 group shadow-xl"
                    >
                        {isEstimatingAll ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
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
                                        className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 h-8 w-8"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-0" suppressHydrationWarning>
                                <div className="divide-y divide-zinc-900/40">
                                    {meal.meal_items?.map((item) => (
                                        <MealItemRow
                                            key={item.id}
                                            item={item}
                                            dietId={diet.id}
                                            onRemove={handleRemoveItem}
                                        />
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
                <div className="bg-zinc-900/30 p-8 rounded-2xl border-2 border-dashed border-zinc-800/50 flex flex-col md:flex-row gap-6 items-end mt-12 group">
                    <div className="flex-1 space-y-2.5 w-full">
                        <Label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest ml-1">Nome da Nova Refeição</Label>
                        <Input
                            placeholder="Ex: Café da Manhã, Almoço..."
                            value={newMealName}
                            onChange={(e) => setNewMealName(e.target.value)}
                            className="bg-zinc-950 border-zinc-700 h-11 rounded-xl text-white placeholder:text-zinc-700 font-medium"
                        />
                    </div>
                    <Button
                        onClick={handleAddMeal}
                        disabled={loadingMap['add-meal'] || !newMealName}
                        className="bg-white text-zinc-950 hover:bg-zinc-200 w-full md:w-auto h-11 px-8 rounded-xl font-bold shadow-lg flex items-center gap-2"
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
                        className="text-zinc-500 hover:text-white hover:bg-zinc-900 gap-2 px-6 h-12 rounded-xl"
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
