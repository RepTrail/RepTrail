'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteWorkout } from "@/actions/workout-actions"

interface DeleteWorkoutButtonProps {
    workoutId: string
}

export function DeleteWorkoutButton({ workoutId }: DeleteWorkoutButtonProps) {
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirm('Deseja realmente excluir este treino?')) return

        setLoading(true)
        try {
            const result = await deleteWorkout(workoutId)
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
