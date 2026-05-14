'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Repeat2 } from "lucide-react"
import { substituteMealItem } from '@/actions/tracking-actions'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

interface SubstituteItemDialogProps {
    item: any
    onSuccess: (substitutedData: any) => void
}

export function SubstituteItemDialog({ item, onSuccess }: SubstituteItemDialogProps) {
    const { toast } = useToast()
    const [open, setOpen] = useState(false)
    const [foodName, setFoodName] = useState('')
    const [quantity, setQuantity] = useState('')

    const queryClient = useQueryClient()
    const queryKey = QUERY_KEYS.diets.today(item.user_id || 'me')

    const { mutate: substituteMutate } = useOptimisticMutation({
        actionName: 'substitute-item',
        entity: ENTITIES.MEAL_ITEM,
        entityId: item.id,
        queryKey,
        mutationFn: async (variables: any) => {
            // Background AI macro estimation
            const { estimateMacros } = await import('@/actions/diet-actions')
            const estRes = await estimateMacros(variables.substituteData.food_name, variables.substituteData.quantity)
            const macros = estRes.success ? (estRes.macros as any) : { protein: 0, carbs: 0, fat: 0, fiber: 0 }
            
            const res = await substituteMealItem(variables.itemId, {
                ...variables.substituteData,
                ...macros
            })
            
            if (!res.success) throw new Error(res.error)
            return { ...variables.substituteData, ...macros }
        },
        onMutate: () => {
            setOpen(false)
        },
        onSuccess: (data) => {
            toast({
                title: "Substituição salva!",
                description: "O item foi atualizado no seu plano de hoje."
            })
            onSuccess({
                ...item,
                is_checked: true,
                is_substituted: true,
                substituted_food_name: data.food_name,
                substituted_quantity: data.quantity,
                substituted_protein: data.protein,
                substituted_carbs: data.carbs,
                substituted_fat: data.fat,
                substituted_fiber: data.fiber
            })
        }
    })

    const handleSave = () => {
        if (!foodName || !quantity) {
             toast({
                variant: "destructive",
                title: "Campos obrigatórios",
                description: "Preencha o nome e a quantidade do alimento."
            })
            return
        }

        substituteMutate({
            itemId: item.id,
            substituteData: {
                food_name: foodName,
                quantity
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-600 hover:text-orange-500 hover:bg-orange-500/10">
                    <Repeat2 className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-900 text-white rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black italic uppercase italic">Substituir Alimento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Alimento Original</Label>
                        <p className="text-sm font-bold text-zinc-400">{item.quantity} {item.food_name}</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="food" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Novo Alimento</Label>
                        <Input
                            id="food"
                            placeholder="Ex: Frango Grelhado"
                            value={foodName}
                            onChange={e => setFoodName(e.target.value)}
                            className="bg-zinc-900 border-zinc-800 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="qty" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Quantidade</Label>
                        <Input
                            id="qty"
                            placeholder="Ex: 100g"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            className="bg-zinc-900 border-zinc-800 rounded-xl"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSave}
                        disabled={!foodName || !quantity}
                        className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-black uppercase italic tracking-widest rounded-xl"
                    >
                        Confirmar Substituição
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
