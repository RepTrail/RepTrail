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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2 } from "lucide-react"
import { assignDiet } from '@/actions/diet-actions'

interface AssignDietDialogProps {
    dietId: string
    students: any[]
}

export function AssignDietDialog({ dietId, students }: AssignDietDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<string>('')

    async function handleAssign() {
        if (!selectedStudent) return alert('Selecione um aluno.')

        setLoading(true)
        const result = await assignDiet(dietId, selectedStudent)
        setLoading(false)

        if (result.success) {
            setOpen(false)
            alert('Dieta atribuída com sucesso!')
        } else {
            alert(result.error || "Erro ao atribuir dieta.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Atribuir
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white border-zinc-800">
                <DialogHeader>
                    <DialogTitle>Atribuir Dieta</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Escolha um aluno para receber este plano alimentar.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Aluno</Label>
                        <Select onValueChange={setSelectedStudent}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                <SelectValue placeholder="Selecione o aluno" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {students.map((s) => (
                                    <SelectItem key={s.student_id} value={s.student_id}>
                                        {s.student?.full_name || s.student?.email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAssign} disabled={loading} className="w-full bg-zinc-100 text-zinc-900 hover:bg-white">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Confirmar Atribuição
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
