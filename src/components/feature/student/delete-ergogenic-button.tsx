'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteStudentErgogenic } from '@/actions/student-content-actions'
import { useRouter } from 'next/navigation'

export function DeleteErgogenicButton({ ergogenicId }: { ergogenicId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        if (!confirm('Deseja realmente excluir este ergogênico?')) return
        setLoading(true)
        try {
            const res = await deleteStudentErgogenic(ergogenicId)
            if ((res as any)?.error) alert((res as any).error)
            router.refresh()
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
