'use client'

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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

export function CreateWorkoutDialog() {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const { mutate } = useOptimisticMutation({
        queryKey: ['workouts'], // Using standard workout list key
        actionName: 'create-manual-workout',
        entity: ENTITIES.WORKOUT,
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
            toast({ title: 'Treino criado com sucesso!' })
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
                    <DialogTitle>Novo Modelo de Treino</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Crie um template que poderá ser atribuído para vários alunos.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Treino</Label>
                        <Input id="name" name="name" placeholder="Ex: Hipertrofia A - Peito/Tríceps" required className="bg-zinc-900 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição (Opcional)</Label>
                        <Textarea id="description" name="description" placeholder="Instruções gerais, foco do treino, etc." className="bg-zinc-900 border-zinc-800" />
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
