
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toggleStudentStatus } from '@/actions/trainer-actions'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export function ToggleStudentStatusButton({ relationshipId, isActive }: { relationshipId: string, isActive: boolean }) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleToggle = async () => {
        setLoading(true)
        try {
            const result = await toggleStudentStatus(relationshipId, !isActive)
            if (result.success) {
                toast({
                    title: isActive ? 'Aluno Desativado' : 'Aluno Reativado',
                    description: isActive ? 'Student marked as inactive.' : 'Student reactivated successfully.',
                })
            } else {
                toast({
                    title: 'Erro',
                    description: result.message || 'Failed to update student status.',
                    variant: 'destructive',
                })
            }
        } catch (error) {
            toast({
                title: 'Erro Inesperado',
                description: 'Ocorreu um erro ao atualizar o status.',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            className={`w-full sm:w-auto border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold h-10  text-xs gap-2 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleToggle}
            disabled={loading}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isActive ? 'Desativar Aluno' : 'Reativar Aluno'}
        </Button>
    )
}
