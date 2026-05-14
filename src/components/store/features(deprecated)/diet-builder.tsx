'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UnifiedAssignDialog } from "@/components/store/features(deprecated)/unified-assign-dialog"
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
    Save,
    GripVertical,
    Calendar
} from "lucide-react"
import { cn } from '@/lib/utils'
import {
    getDietDetails,
    addMealToDiet,
    addMealItem,
    updateMealItem,
    removeMealItem,
    removeMeal,
    estimateMacros,
    estimateAllDietMacros,
    updateDietMeta,
    suggestSubstitution,
    updateMealsOrder,
    updateMealItemsOrder
} from "@/actions/diet-actions"
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from "@/lib/query-keys"
import { ENTITIES } from '@/lib/outbox-db'

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
        assignments?: any[]
    }
    students?: any[]
    backHref?: string
    canAssign?: boolean
    showAssignmentBadge?: boolean
}

// Extracted Component to prevent lag
function MealItemRow({
    item,
    dietId,
    onRemove,
    draggableProps = {}
}: {
    item: MealItem;
    dietId: string;
    onRemove: (id: string) => void;
    draggableProps?: any;
}) {
    const queryClient = useQueryClient()
    const queryKey = QUERY_KEYS.diets.detail(dietId)

    // Local state for all fields to ensure zero-lag typing
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

    // AI Estimated loading states (kept as local UI feedback)
    const [estimating, setEstimating] = useState<Record<string, boolean>>({})

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
        setSubFiber(item.sub_fiber || 0)
        setFiber(item.fiber || 0)
        setIsSaved(true)
    }, [item])

    const { mutate: syncItem } = useOptimisticMutation({
        actionName: 'update-meal-item',
        entity: ENTITIES.MEAL_ITEM,
        entityId: item.id,
        queryKey,
        mutationFn: async (variables: { id: string, data: any }) => variables,
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
                quantity: quantity,
                protein, carbs, fat, fiber,
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

    const handleChange = (setter: any, val: any) => {
        setter(val)
        setIsSaved(false)
    }

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
        <div className={cn(
            "group relative transition-all duration-300",
            !isSaved && "bg-orange-500/5"
        )}>
            {/* Original Item Row */}
            <div
                {...draggableProps}
                className={cn(
                    "p-3 lg:p-4 flex items-start lg:items-end gap-2 lg:gap-3 hover:bg-zinc-900/20 border-l-2 transition-all",
                    isSaved ? "border-l-transparent" : "border-l-orange-500 shadow-[inset_10px_0_15px_-10px_rgba(249,115,22,0.1)]",
                    draggableProps.draggable && "cursor-default"
                )}
            >
                <div className="shrink-0 mt-7 lg:mt-0 lg:mb-2.5 flex items-center justify-center">
                    <GripVertical className="w-4 h-4 text-zinc-700 cursor-move hover:text-orange-500 transition-colors" />
                </div>
                <div className="flex-1 grid grid-cols-12 gap-2 lg:gap-4 items-end">
                    <div className="col-span-12 lg:col-span-5 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] text-zinc-600 uppercase font-bold tracking-tight">Alimento</Label>
                            {!isSaved && <span className="text-[8px] font-black text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded uppercase animate-pulse">Pendente</span>}
                        </div>
                        <Input
                            value={foodName}
                            onChange={(e) => handleChange(setFoodName, e.target.value)}
                            className="bg-zinc-900 border-zinc-700 text-sm h-9 text-white focus:border-orange-500/50 rounded-system w-full"
                        />
                    </div>
                    <div className="col-span-4 lg:col-span-2 space-y-1.5">
                        <Label className="text-[10px] text-zinc-600 uppercase font-bold tracking-tight">Qtd</Label>
                        <Input
                            value={quantity}
                            onChange={(e) => handleChange(setQuantity, e.target.value)}
                            placeholder="Ex: 100g"
                            className="bg-zinc-900 border-zinc-700 text-sm h-9 text-center text-white focus:border-orange-500/50 rounded-system"
                        />
                    </div>
                    <div className="col-span-8 lg:col-span-3 grid grid-cols-4 gap-1.5">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-blue-500/50 uppercase font-bold tracking-tight">Prot</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={protein}
                                onChange={(e) => handleChange(setProtein, parseFloat(e.target.value) || 0)}
                                className="bg-zinc-900 border-zinc-700 text-xs h-9 text-center text-blue-400 font-medium rounded-system px-1"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-orange-500/50 uppercase font-bold tracking-tight">Carb</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={carbs}
                                onChange={(e) => handleChange(setCarbs, parseFloat(e.target.value) || 0)}
                                className="bg-zinc-900 border-zinc-700 text-xs h-9 text-center text-orange-400 font-medium rounded-system px-1"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-orange-500/50 uppercase font-bold tracking-tight">Gord</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={fat}
                                onChange={(e) => handleChange(setFat, parseFloat(e.target.value) || 0)}
                                className="bg-zinc-900 border-zinc-700 text-xs h-9 text-center text-orange-500 font-medium rounded-system px-1"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-purple-500/50 uppercase font-bold tracking-tight">Fib</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={fiber}
                                onChange={(e) => handleChange(setFiber, parseFloat(e.target.value) || 0)}
                                className="bg-zinc-900 border-zinc-700 text-xs h-9 text-center text-purple-400 font-medium rounded-system px-1"
                            />
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-2 flex items-center justify-end gap-1.5 lg:pb-0.5 mt-1 lg:mt-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={estimating.main || !foodName}
                            onClick={handleEstimateMain}
                            className="text-zinc-600 hover:text-orange-400 h-9 w-8 hover:bg-orange-400/5 border border-zinc-800 rounded-system"
                            title="Calcular macros com IA"
                        >
                            {estimating.main ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleChange(setHasSubstitute, !hasSubstitute)}
                            className={cn("h-9 w-8 border rounded-system", hasSubstitute ? "text-orange-500 bg-orange-500/10 border-orange-500/20" : "text-zinc-600 hover:text-orange-400 hover:bg-orange-400/5 border-zinc-800")}
                            title="Adicionar/Remover Substituição"
                        >
                            <Repeat2 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemove(item.id)}
                            className="text-zinc-600 hover:text-red-400 h-9 w-8 hover:bg-red-400/5 border border-zinc-800 rounded-system"
                            title="Remover item"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSave}
                            className={cn(
                                "h-9 w-8 border transition-all rounded-system",
                                isSaved
                                    ? "bg-zinc-800 text-zinc-500 border-zinc-700 opacity-50 cursor-not-allowed"
                                    : "bg-orange-500 text-zinc-950 border-orange-400 hover:bg-orange-400"
                            )}
                            title="Salvar alterações"
                        >
                            <Save className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Substitution Row */}
            {hasSubstitute && (
                <div className=" pb-4 px-4 pt-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-end bg-orange-500/5 border-t border-orange-500/10 transition-all duration-300">
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
                    <div className="lg:col-span-4 grid grid-cols-4 gap-2">
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
                            <Label className="text-[10px] text-orange-500/50 uppercase font-bold tracking-tight text-center">Gord</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={subFat}
                                onChange={(e) => handleChange(setSubFat, parseFloat(e.target.value) || 0)}
                                className="bg-zinc-950 border-zinc-700 text-xs h-9 text-center text-orange-500/80 font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-purple-500/50 uppercase font-bold tracking-tight text-center">Fib</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={subFiber}
                                onChange={(e) => handleChange(setSubFiber, parseFloat(e.target.value) || 0)}
                                className="bg-zinc-950 border-zinc-700 text-xs h-9 text-center text-purple-400/80 font-medium"
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-3 flex items-center justify-end gap-2 pb-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={estimating.sub || !subFoodName}
                            onClick={handleEstimateSub}
                            className="text-zinc-600 hover:text-orange-400 h-9 w-9 border border-zinc-800 bg-zinc-900/50"
                            title="Calcular macros da substituição com IA"
                        >
                            {estimating.sub ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={estimating.suggest}
                            onClick={handleSuggestSub}
                            className="text-zinc-600 hover:text-purple-400 h-9 w-9 border border-zinc-800 bg-zinc-900/50"
                            title="Sugerir substituição similar com IA"
                        >
                            {estimating.suggest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Utensils className="w-4 h-4" />}
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
                            className={cn(
                                "h-9 w-9 border transition-all shadow-none",
                                isSaved
                                    ? "bg-zinc-800/50 text-zinc-600 border-zinc-800"
                                    : "bg-orange-500 text-white border-orange-400 hover:bg-orange-400"
                            )}
                            title="Salvar Alterações"
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export function DietBuilder({ diet: initialDiet, students = [], backHref = '/dashboard/trainer/diets', canAssign = true, showAssignmentBadge = true }: DietBuilderProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const queryKey = QUERY_KEYS.diets.detail(initialDiet.id)

    const { data: dietData } = useQuery({
        queryKey,
        queryFn: () => getDietDetails(initialDiet.id),
        initialData: initialDiet,
        staleTime: 0,
        refetchOnMount: 'always'
    })

    const diet = dietData as { id: string, name: string, meals: Meal[], assignments?: any[] }
    const meals = diet.meals || []

    const [newMealName, setNewMealName] = useState('')
    const [isEstimatingAll, setIsEstimatingAll] = useState(false)
    const [draggedMealId, setDraggedMealId] = useState<string | null>(null)
    const [draggedItemId, setDraggedItemId] = useState<{ mealId: string, itemId: string } | null>(null)

    // Inline name editing
    const [isEditingName, setIsEditingName] = useState(false)
    const [editName, setEditName] = useState(diet.name)
    const nameInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditingName) nameInputRef.current?.focus()
    }, [isEditingName])

    // --- MUTATIONS ---

    const { mutate: reorderMealsMutate } = useOptimisticMutation({
        actionName: 'update-meals-order',
        entity: ENTITIES.MEAL,
        entityId: diet.id,
        queryKey,
        mutationFn: async (variables: { orderedIds: string[] }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => {
                const meals = [...(old?.meals || [])]
                const sorted = variables.orderedIds.map(id => meals.find(m => m.id === id)).filter(Boolean)
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
        mutationFn: async (variables: { mealId: string, orderedIds: string[] }) => variables,
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

    const { mutate: mutateName } = useOptimisticMutation({
        actionName: 'update-diet-meta',
        entity: ENTITIES.DIET,
        entityId: diet.id,
        queryKey,
        mutationFn: async (variables: { id: string, name: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({ ...old, ...variables }))
            return { previous }
        },
        onSuccess: () => setIsEditingName(false)
    })

    const { mutate: addMealMutate } = useOptimisticMutation({
        actionName: 'add-meal',
        entity: ENTITIES.DIET,
        entityId: diet.id,
        queryKey,
        mutationFn: async (variables: { dietId: string, name: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({
                ...old,
                meals: [...(old?.meals || []), {
                    id: `temp-${Date.now()}`,
                    diet_id: diet.id,
                    name: variables.name,
                    time_of_day: "08:00",
                    meal_items: []
                }]
            }))
            return { previous }
        },
        onSuccess: () => setNewMealName('')
    })

    const { mutate: addItemMutate } = useOptimisticMutation({
        actionName: 'add-meal-item',
        entity: ENTITIES.MEAL,
        entityId: 'new',
        queryKey,
        mutationFn: async (variables: { mealId: string, dietId: string, foodId: string }) => variables,
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
                                protein: 0, carbs: 0, fat: 0
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
        mutationFn: async (variables: { id: string, dietId: string }) => variables,
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
        mutationFn: async (variables: { id: string, dietId: string }) => variables,
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

    // --- HANDLERS ---

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

    function handleMealDragEnd() {
        if (!draggedMealId) return
        setDraggedMealId(null)
        reorderMealsMutate({
            orderedIds: meals.map(m => m.id),
            dietId: diet.id
        })
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
        const draggedIndex = currentItems.findIndex(i => i.id === draggedItemId.itemId)
        const targetIndex = currentItems.findIndex(i => i.id === targetId)
        if (draggedIndex === -1 || targetIndex === -1) return
        const newMeals = [...meals]
        const newItems = [...currentItems]
        const [removed] = newItems.splice(draggedIndex, 1)
        newItems.splice(targetIndex, 0, removed)
        newMeals[mealIndex] = { ...newMeals[mealIndex], meal_items: newItems }
        queryClient.setQueryData(queryKey, (old: any) => ({ ...old, meals: newMeals }))
    }

    function handleItemDragEnd(mealId: string) {
        if (!draggedItemId) return
        const meal = meals.find(m => m.id === mealId)
        setDraggedItemId(null)
        if (meal) reorderItemsMutate({
            mealId,
            orderedIds: (meal.meal_items || []).map(i => i.id)
        })
    }

    function handleSaveName() {
        if (!editName.trim()) return
        mutateName({ id: diet.id, name: editName })
    }

    function handleCancelName() {
        setEditName(diet.name)
        setIsEditingName(false)
    }

    const totals = meals?.reduce((acc, meal) => {
        meal.meal_items?.forEach(item => {
            acc.p += Number(item.protein) || 0
            acc.c += Number(item.carbs) || 0
            acc.f += Number(item.fat) || 0
            acc.fib += Number(item.fiber) || 0
        })
        return acc
    }, { p: 0, c: 0, f: 0, fib: 0 }) || { p: 0, c: 0, f: 0, fib: 0 }

    const totalKcal = Math.round((totals.p * 4) + (totals.c * 4) + (totals.f * 9))

    function handleAddMeal() {
        if (!newMealName) return
        addMealMutate({ dietId: diet.id, name: newMealName })
    }

    function handleAddItem(mealId: string) {
        addItemMutate({ mealId, dietId: diet.id, foodId: 'default' })
    }

    function handleRemoveMeal(id: string) {
        if (!confirm('Remover esta refeição inteira?')) return
        removeMealMutate({ id, dietId: diet.id })
    }

    function handleRemoveItem(id: string) {
        removeItemMutate({ id, dietId: diet.id })
    }

    async function handleEstimateAll() {
        try {
            setIsEstimatingAll(true)
            toast({ title: "Calculando...", description: "A IA está analisando todos os itens da dieta. Isso pode levar alguns segundos." })
            const res = await estimateAllDietMacros(diet.id)
            if (res.success) {
                toast({ title: "Concluído!", description: "Todos os macros foram calculados com sucesso." })
                queryClient.invalidateQueries({ queryKey })
            } else {
                throw new Error(res.error)
            }
        } catch (error: any) {
            toast({ variant: "destructive", title: "Erro", description: error.message || "Erro ao calcular macros." })
        } finally {
            setIsEstimatingAll(false)
        }
    }

    return (
        <div className="space-y-8" suppressHydrationWarning>
            {/* Header / Meta */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4 flex-1">
                        {isEditingName ? (
                            <div className="bg-zinc-900/60 border border-zinc-700/60 rounded-system sm:rounded-system p-4 sm:p-6 space-y-4 shadow-2xl max-w-2xl">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nome da Dieta</label>
                                    <Input
                                        ref={nameInputRef}
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') handleCancelName() }}
                                        className="bg-zinc-950 border-zinc-700 text-white text-lg sm:text-xl font-black h-12 sm:h-14 rounded-system sm:rounded-system focus:ring-orange-500/30"
                                        placeholder="Nome da dieta..."
                                    />
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Button
                                        onClick={handleSaveName}
                                        className="h-10 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-system px-4 sm:px-6"
                                    >
                                        <Check className="w-4 h-4 mr-2" />Salvar
                                    </Button>
                                    <Button
                                        onClick={handleCancelName}
                                        variant="ghost"
                                        className="h-10 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px]"
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div
                                    className="relative group cursor-pointer w-fit"
                                    onClick={() => setIsEditingName(true)}
                                >
                                    <h1 className="text-2xl font-black text-white font-sans capitalize group-hover:text-orange-400 transition-colors leading-tight break-words pr-8">
                                        {editName.toLowerCase()}
                                    </h1>
                                    <button className="absolute top-0 -right-2 p-2 rounded-system text-zinc-700 group-hover:text-orange-400 bg-zinc-900/50 border border-zinc-800 transition-all active:scale-95 shadow-lg">
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {showAssignmentBadge && (
                                    <>
                                        {diet.assignments && diet.assignments.length > 0 ? (
                                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-system sm:rounded-system w-fit animate-in fade-in slide-in-from-left-4 duration-500">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                                                <span className="text-[9px] sm:text-[10px] font-black uppercase text-orange-500">
                                                    Atribuído para: <span className="text-white ml-1">{diet.assignments[0]?.student?.full_name || 'Aluno'}</span>
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-system sm:rounded-system w-fit">
                                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Template de Biblioteca</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                        <Button
                            onClick={handleEstimateAll}
                            disabled={isEstimatingAll || meals.length === 0}
                            variant="outline"
                            className="h-[56px] sm:h-[64px] px-6 sm:px-8 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-orange-400 hover:text-orange-300 rounded-system sm:rounded-system font-black capitalize text-[10px] flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-1 transition-all active:scale-95 text-center"
                        >
                            {isEstimatingAll ? (
                                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                            <span className="text-center">{isEstimatingAll ? "Calculando..." : "Calcular Macros"}</span>
                        </Button>

                        {canAssign && (
                            <UnifiedAssignDialog
                                itemId={diet.id}
                                students={students}
                                type="diet"
                                title="Atribuir Dieta"
                                description="Escolha um aluno e os dias da semana para este plano alimentar."
                                colorScheme="orange"
                                initialStudentId={diet.assignments?.[0]?.student_id}
                                initialDays={diet.assignments?.[0]?.days_of_week}
                                trigger={
                                    <Button className="h-[56px] sm:h-[64px] px-6 sm:px-8 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-system sm:rounded-system font-black capitalize text-[10px] shadow-none flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-1 transition-all active:scale-95 text-center">
                                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-center" />
                                        <span className="text-center">{diet.assignments?.length ? "Gerenciar Atribuição" : "Atribuir Dieta"}</span>
                                    </Button>
                                }
                            />
                        )}
                    </div>
                </div>

                {/* Macro Summary Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8 lg:gap-4 bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-system sm:rounded-system shadow-inner overflow-hidden">
                    <div className="space-y-1">
                        <span className="block text-[8px] sm:text-[10px] text-zinc-500 uppercase font-black mb-0.5 sm:mb-1">Proteína</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl sm:text-3xl font-black text-blue-400">{Math.round(totals.p)}</span>
                            <small className="text-[10px] sm:text-xs font-bold text-zinc-600">g</small>
                        </div>
                    </div>
                    <div className="space-y-1 lg:pl-6 lg:border-l-2 lg:border-zinc-800">
                        <span className="block text-[8px] sm:text-[10px] text-zinc-500 uppercase font-black mb-0.5 sm:mb-1">Carboidratos</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl sm:text-3xl font-black text-orange-400">{Math.round(totals.c)}</span>
                            <small className="text-[10px] sm:text-xs font-bold text-zinc-600">g</small>
                        </div>
                    </div>
                    <div className="space-y-1 lg:pl-6 lg:border-l-2 lg:border-zinc-800">
                        <span className="block text-[8px] sm:text-[10px] text-zinc-500 uppercase font-black mb-0.5 sm:mb-1">Gorduras</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl sm:text-3xl font-black text-orange-500">{Math.round(totals.f)}</span>
                            <small className="text-[10px] sm:text-xs font-bold text-zinc-600">g</small>
                        </div>
                    </div>
                    <div className="space-y-1 lg:pl-6 lg:border-l-2 lg:border-zinc-800">
                        <span className="block text-[8px] sm:text-[10px] text-zinc-500 uppercase font-black mb-0.5 sm:mb-1">Fibras</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl sm:text-3xl font-black text-purple-400">{Math.round(totals.fib)}</span>
                            <small className="text-[10px] sm:text-xs font-bold text-zinc-600">g</small>
                        </div>
                    </div>
                    <div className="space-y-1 lg:pl-6 lg:border-l-2 lg:border-zinc-800">
                        <span className="block text-[10px] sm:text-[12px] text-white uppercase font-black mb-0.5 sm:mb-1">Total Kcal</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl sm:text-3xl font-black text-white underline decoration-blue-500 decoration-4 underline-offset-4 leading-none">{totalKcal}</span>
                            <small className="text-[10px] sm:text-xs font-bold text-zinc-600">kcal</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {meals.map((meal, index) => {
                    const mealP = meal.meal_items?.reduce((s, i) => s + (Number(i.protein) || 0), 0)
                    const mealC = meal.meal_items?.reduce((s, i) => s + (Number(i.carbs) || 0), 0)
                    const mealF = meal.meal_items?.reduce((s, i) => s + (Number(i.fat) || 0), 0)
                    const mealFib = meal.meal_items?.reduce((s, i) => s + (Number(i.fiber) || 0), 0)
                    const mealKcal = Math.round((mealP * 4) + (mealC * 4) + (mealF * 9))

                    return (
                        <div
                            key={meal.id}
                            draggable
                            onDragStart={(e) => handleMealDragStart(e, meal.id)}
                            onDragOver={(e) => handleMealDragOver(e, meal.id)}
                            onDragEnd={handleMealDragEnd}
                            className={cn(
                                "transition-all duration-200",
                                draggedMealId === meal.id ? "opacity-40 scale-[0.98]" : ""
                            )}
                        >
                            <Card className="bg-zinc-950 border-zinc-800 overflow-hidden shadow-xl" suppressHydrationWarning>
                                <div className="p-4 bg-zinc-900/40 border-b border-zinc-800/50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-zinc-800 p-2.5 rounded-system border border-zinc-700/50 cursor-move">
                                            <Utensils className="w-4 h-4 text-orange-400" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-zinc-100">Refeição {index + 1}</h3>
                                                {meal.name && !meal.name.toLowerCase().includes('refeição') && (
                                                    <span className="text-sm font-medium text-zinc-500">
                                                        {meal.name}
                                                    </span>
                                                )}
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
                                            <span className="text-orange-500/80">G: {Math.round(mealF)}g</span>
                                            <span className="text-purple-400/80">F: {Math.round(mealFib)}g</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveMeal(meal.id)}
                                            className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 h-8 w-8"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-0" suppressHydrationWarning>
                                    <div className="divide-y divide-zinc-900/40">
                                        {meal.meal_items?.map((item) => (
                                            <div
                                                key={item.id}
                                                className={cn(
                                                    "transition-all duration-200",
                                                    draggedItemId?.itemId === item.id ? "opacity-40" : ""
                                                )}
                                            >
                                                <MealItemRow
                                                    item={item}
                                                    dietId={diet.id}
                                                    onRemove={handleRemoveItem}
                                                    draggableProps={{
                                                        draggable: true,
                                                        onDragStart: (e: any) => handleItemDragStart(e, meal.id, item.id),
                                                        onDragOver: (e: any) => handleItemDragOver(e, meal.id, item.id),
                                                        onDragEnd: () => handleItemDragEnd(meal.id)
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-4 bg-zinc-900/20 border-t border-zinc-900/50">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleAddItem(meal.id)}
                                            className="w-full border-dashed border-zinc-800 bg-transparent hover:bg-zinc-900 hover:text-zinc-100 text-zinc-500 h-10 rounded-system p-4"
                                        >
                                            <PlusCircle className="w-3 h-3 mr-2" />
                                            Adicionar Item
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )
                })}

                {/* New Meal Form */}
                <div className="bg-zinc-900/30 p-8 rounded-system border-2 border-dashed border-zinc-800/50 flex flex-col md:flex-row gap-6 items-end mt-12 group">
                    <div className="flex-1 space-y-2.5 w-full">
                        <Label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest ml-1">Nome da Nova Refeição</Label>
                        <Input
                            placeholder="Ex: Café da Manhã, Almoço..."
                            value={newMealName}
                            onChange={(e) => setNewMealName(e.target.value)}
                            className="bg-zinc-950 border-zinc-700 h-11 rounded-system text-white placeholder:text-zinc-700 font-medium"
                        />
                    </div>
                    <Button
                        onClick={handleAddMeal}
                        disabled={!newMealName}
                        className="bg-white text-zinc-950 hover:bg-zinc-200 w-full md:w-auto h-11 px-8 rounded-system font-bold shadow-lg flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar Refeição
                    </Button>
                </div>

                {/* Navigation Footer */}
                <div className="pt-12 flex justify-center border-t border-zinc-800/30">
                    <Button
                        asChild
                        variant="ghost"
                        className="text-zinc-500 hover:text-white hover:bg-zinc-900 gap-2 px-6 h-auto py-4 rounded-system text-center"
                    >
                        <Link href={backHref || '/dashboard/trainer/diets'}>
                            <ArrowLeft className="w-4 h-4 shrink-0" />
                            <span>
                                Voltar para a <br className="md:hidden" /> Biblioteca de Dietas
                            </span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}


