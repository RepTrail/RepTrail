'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteDiet } from "@/actions/diet-actions"

interface DeleteDietButtonProps {
    dietId: string
}

export function DeleteDietButton({ dietId }: DeleteDietButtonProps) {
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirm('Deseja realmente excluir esta dieta?')) return

        setLoading(true)
        try {
            const result = await deleteDiet(dietId)
            if (result.error) {
                alert('Erro ao excluir: ' + result.error)
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
