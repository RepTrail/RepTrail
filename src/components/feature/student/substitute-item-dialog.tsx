
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
import { Repeat2, Loader2 } from "lucide-react"
import { substituteMealItem } from '@/actions/tracking-actions'
import { useToast } from '@/hooks/use-toast'

interface SubstituteItemDialogProps {
    item: any
    onSuccess: (substitutedData: any) => void
}

export function SubstituteItemDialog({ item, onSuccess }: SubstituteItemDialogProps) {
    const { toast } = useToast()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [foodName, setFoodName] = useState('')
    const [quantity, setQuantity] = useState('')

    async function handleSubstitute() {
        if (!foodName || !quantity) return

        setLoading(true)
        try {
            // Estimate macros for the custom substitution
            const { estimateMacros } = await import('@/actions/diet-actions')
            const estRes = await estimateMacros(foodName, quantity)
            const macros = estRes.success ? (estRes.macros as any) : { protein: 0, carbs: 0, fat: 0, fiber: 0 }

            const res = await substituteMealItem(item.id, {
                food_name: foodName,
                quantity,
                ...macros
            })

            if (res.success) {
                toast({ title: 'Item substituído!' })
                onSuccess({
                    ...item,
                    is_checked: true,
                    is_substituted: true,
                    substituted_food_name: foodName,
                    substituted_quantity: quantity,
                    substituted_protein: macros.protein,
                    substituted_carbs: macros.carbs,
                    substituted_fat: macros.fat,
                    substituted_fiber: macros.fiber
                })
                setOpen(false)
            } else {
                toast({ variant: 'destructive', title: 'Erro', description: res.error })
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Erro inesperado' })
        } finally {
            setLoading(false)
        }
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
                        onClick={handleSubstitute}
                        disabled={loading || !foodName || !quantity}
                        className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-black uppercase italic tracking-widest rounded-xl"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Confirmar Substituição
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
