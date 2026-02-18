'use client'

import { useState } from 'react'
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
import { Plus, Loader2 } from "lucide-react"
import { createManualDiet } from '@/actions/diet-actions'

export function CreateDietDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)

        const result = await createManualDiet(formData)
        setLoading(false)

        if (result.success) {
            setOpen(false)
        } else {
            alert(result.error || "Erro ao criar dieta.")
        }
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
                        <Button type="submit" disabled={loading} className="w-full bg-zinc-100 text-zinc-900 hover:bg-white">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Salvar Template
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
