'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

export function CreateDietDialog() {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const { mutate } = useOptimisticMutation({
        queryKey: ['diets'], // Standard diet list key
        actionName: 'create-manual-diet',
        entity: ENTITIES.DIET,
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
            toast({ title: 'Dieta criada com sucesso!' })
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
                <Button className="bg-white text-zinc-900 hover:bg-zinc-200">
                    <Plus className="mr-2 h-4 w-4" /> Criar Manualmente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white border-zinc-800">
                <DialogHeader>
                    <DialogTitle>Novo Modelo de Dieta</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Crie um template de dieta (Cutting, Bulking, etc).
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome da Dieta</Label>
                        <Input id="name" name="name" placeholder="Ex: Dieta para Secar (Low Carb)" required className="bg-zinc-900 border-zinc-800" />
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full bg-zinc-100 text-zinc-900 hover:bg-white">
                            Salvar Template
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
