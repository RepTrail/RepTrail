'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { PillButton } from "@/components/ui/pill-button"
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
import { UserPlus, Plus, Mail, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useQueryClient } from '@tanstack/react-query'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { QUERY_KEYS } from '@/lib/query-keys'

export function AddStudentDialog() {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const { mutate } = useOptimisticMutation({
        actionName: 'create-student',
        queryKey: ['trainer'],
        entity: ENTITIES.TRAINER_STUDENT,
        mutationFn: async () => {}, // Single-writer: no-op
        onMutate: () => {
            queryClient.invalidateQueries({ queryKey: ['trainer'] })
            toast({ title: "Aluno vinculado!", description: "O aluno foi adicionado à sua lista." })
        }
    })

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const payload = Object.fromEntries(formData.entries())
        
        // 🚀 LOCAL-FIRST: close immediately
        setOpen(false)
        mutate(payload)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <PillButton variant="emerald" className="w-full sm:w-auto">
                    <Plus className="w-4 h-4" /> Vincular Aluno
                </PillButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="space-y-3">
                    <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 w-fit">
                        <UserPlus className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-black text-white italic uppercase tracking-tight">
                            Vincular Novo Aluno
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs font-medium">
                            O aluno deve possuir uma conta no RepTrail. Insira o email abaixo.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                Email da Conta
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="ex: aluno@email.com"
                                className="bg-zinc-900 border-zinc-800 h-11 text-white rounded-xl focus:ring-zinc-700 placeholder:text-zinc-600"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="monthlyFee" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <DollarSign className="w-3 h-3" />
                                Valor da Mensalidade (R$)
                            </Label>
                            <Input
                                id="monthlyFee"
                                name="monthlyFee"
                                type="number"
                                placeholder="0.00"
                                className="bg-zinc-900 border-zinc-800 h-11 text-white rounded-xl focus:ring-zinc-700 placeholder:text-zinc-600 font-mono"
                                defaultValue="0"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="submit"
                            className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 rounded-xl font-bold h-12 shadow-lg transition-all active:scale-95"
                        >
                            Finalizar Vínculo
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
