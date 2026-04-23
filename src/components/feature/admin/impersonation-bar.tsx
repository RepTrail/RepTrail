'use client'

import { useState, useEffect } from 'react'
import { impersonateUser } from '@/actions/admin-actions'
import { Button } from '@/components/ui/button'
import { ShieldAlert, LogOut, ArrowLeftRight, UserCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function ImpersonationBar() {
    const [mounted, setMounted] = useState(false)
    const [isImpersonating, setIsImpersonating] = useState(false)
    const [adminId, setAdminId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        setMounted(true)
        const checkStatus = () => {
            const cookies = document.cookie.split('; ')
            const imp = cookies.find(c => c.startsWith('rt_impersonating='))?.split('=')[1]
            const aid = cookies.find(c => c.startsWith('rt_admin_id='))?.split('=')[1]

            setIsImpersonating(imp === 'true')
            setAdminId(aid || null)
        }

        checkStatus()
        const interval = setInterval(checkStatus, 2000)
        return () => clearInterval(interval)
    }, [])

    if (!mounted || !isImpersonating || !adminId) return null

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
        <div className="relative z-[9999] bg-orange-500 text-zinc-950 px-4 sm:px-8 py-3 border-b border-orange-600 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-2.5 py-1 bg-zinc-950 rounded-full shadow-lg">
                    <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">Modo Inspeção Ativo</span>
                </div>
                <p className="text-[11px] font-bold hidden md:block">
                    Você está visualizando a plataforma como outro usuário. Todas as ações afetarão a conta dele.
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    onClick={handleReturn}
                    /* ❌ UI BLOCKING REMOVED */ disabled={false}
                    size="sm"
                    className="h-9 px-4 bg-zinc-950 hover:bg-zinc-900 text-white border-none rounded-2xl text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg transition-transform active:scale-95"
                >
                    {loading ? (
                        <div className="w-3 h-3 border-2 border-orange-500 border-t-white rounded-full animate-spin" />
                    ) : (
                        <ArrowLeftRight className="w-3.5 h-3.5 text-orange-500" />
                    )}
                    <span>Voltar ao Admin</span>
                </Button>
            </div>
        </div>
    )
}
