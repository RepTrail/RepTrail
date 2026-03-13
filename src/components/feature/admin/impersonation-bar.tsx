'use client'

import { useState, useEffect } from 'react'
import { impersonateUser } from '@/actions/admin-actions'
import { Button } from '@/components/ui/button'
import { ShieldAlert, LogOut, ArrowLeftRight, UserCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function ImpersonationBar() {
    const [isImpersonating, setIsImpersonating] = useState(false)
    const [adminId, setAdminId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        const checkStatus = () => {
            const cookies = document.cookie.split('; ')
            const imp = cookies.find(c => c.startsWith('rt_impersonating='))?.split('=')[1]
            const aid = cookies.find(c => c.startsWith('rt_admin_id='))?.split('=')[1]

            setIsImpersonating(imp === 'true')
            setAdminId(aid || null)
        }

        checkStatus()
        // Simple polling for cookie changes since document.cookie doesn't have listeners
        const interval = setInterval(checkStatus, 2000)
        return () => clearInterval(interval)
    }, [])

    if (!isImpersonating || !adminId) return null

    const handleReturn = async () => {
        setLoading(true)
        toast({ title: 'Retornando ao Admin...', description: 'Estamos restaurando sua sessão original.' })

        const res = await impersonateUser(adminId)
        if (res?.error) {
            toast({ variant: 'destructive', title: 'Erro ao retornar', description: res.error })
            setLoading(false)
        }
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-zinc-950  py-2 border-b border-amber-600 shadow-2xl flex items-center justify-between animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3 pb-4">
                <div className="p-1 px-2 bg-zinc-950 rounded flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Modo Inspeção Ativo</span>
                </div>
                <p className="text-[11px] font-bold hidden sm:block">
                    Você está visualizando a plataforma como outro usuário. Todas as ações afetarão a conta dele.
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    onClick={handleReturn}
                    disabled={loading}
                    size="sm"
                    className="h-8 bg-zinc-950 hover:bg-zinc-900 text-white border-none rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg"
                >
                    {loading ? (
                        <div className="w-3 h-3 border-2 border-amber-500 border-t-white rounded-full animate-spin" />
                    ) : (
                        <ArrowLeftRight className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    Voltar ao Admin
                </Button>
            </div>
        </div>
    )
}
