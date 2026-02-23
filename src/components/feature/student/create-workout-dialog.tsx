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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { createStudentWorkout } from '@/actions/student-content-actions'

export function CreateWorkoutDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)

        await createStudentWorkout(formData)
        setLoading(false)
        setOpen(false)
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
                    <DialogTitle>Novo Treino</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Crie um treino para seu plano de auto-training.
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
                        <Button type="submit" disabled={loading} className="w-full bg-zinc-100 text-zinc-900 hover:bg-white">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Salvar Treino
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
