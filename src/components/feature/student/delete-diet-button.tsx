'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteStudentDiet } from '@/actions/student-content-actions'
import { useRouter } from 'next/navigation'

interface DeleteDietButtonProps {
    dietId: string
}

export function DeleteDietButton({ dietId }: DeleteDietButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        if (!confirm('Deseja realmente excluir esta dieta?')) return

        setLoading(true)
        try {
            const result = await deleteStudentDiet(dietId)
            if ((result as any)?.error) {
                alert('Erro ao excluir: ' + (result as any).error)
            } else {
                router.refresh()
            }
        } catch (e) {
            alert('Erro inesperado ao excluir.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={loading}
            className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    )
}
