'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useState } from 'react'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

export function CreateCardioDialog() {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const { mutate } = useOptimisticMutation({
        queryKey: QUERY_KEYS.cardio.library(''), // Using standardized key
        actionName: 'create-manual-cardio',
        entity: ENTITIES.CARDIO,
        mutationFn: async (variables) => variables, // 🔴 HARD BLOCK
        updateFn: (old: any, variables: any) => {
            const list = old?.data || old || []
            const newItem = {
                ...variables,
                id: crypto.randomUUID(),
                created_at: new Date().toISOString(),
                _optimistic: true
            }
            return Array.isArray(old) ? [newItem, ...old] : { ...old, data: [newItem, ...list] }
        },
        onMutate: () => {
            setOpen(false) // 🚀 0ms UI: close instantly
        },
        onSuccess: () => {
            toast({ title: 'Cardio criado com sucesso!' })
        },
        onError: (err: any) => {
            toast({ variant: 'destructive', title: 'Erro', description: err.message })
        }
    })

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        
        const payload: Record<string, any> = {}
        formData.forEach((value, key) => {
            payload[key] = value
        })

        mutate(payload)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-white text-zinc-900 hover:bg-zinc-200 font-bold uppercase italic tracking-tight rounded-xl h-11">
                    <Plus className="mr-2 h-4 w-4" /> Criar Modelo de Cardio
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white border-zinc-800 rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Novo Modelo de Cardio</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        Crie um template (ex: Esteira 45min) para agendar seus treinos.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nome do Cardio</Label>
                        <Input id="name" name="name" placeholder="Ex: Corrida na Esteira" required className="bg-zinc-900 border-zinc-800 rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Descrição (Opcional)</Label>
                        <Textarea id="description" name="description" placeholder="Ex: Manter batimentos entre 130-140..." className="bg-zinc-900 border-zinc-800 rounded-xl" />
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full bg-emerald-500 text-zinc-900 hover:bg-emerald-600 font-black uppercase italic rounded-xl h-12 transition-all">
                            Salvar Template
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
