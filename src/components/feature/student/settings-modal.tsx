'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Settings2,
    Bell,
    Image as ImageIcon,
    FileText,
    Trash2,
    ChevronRight,
    MessageSquare,
    ShieldCheck,
    Zap,
    X
} from 'lucide-react'
import { getTermsStatus, acceptTerms } from '@/actions/terms-actions'
import { enableAutoTrainingTrialForCurrentUser, getAutoTrainingTrialInfoForCurrentUser } from '@/actions/auto-training-actions'
import { useToast } from '@/hooks/use-toast'

export function SettingsModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [allowImageDisclosure, setAllowImageDisclosure] = useState(true)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [trialInfo, setTrialInfo] = useState<any>(null)
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        const handleOpen = () => setIsOpen(true)
        window.addEventListener('open-settings', handleOpen)

        // Initial load of settings
        getTermsStatus().then(status => {
            if (status) {
                setAllowImageDisclosure(status.allowImageDisclosure ?? true)
            }
            setLoading(false)
        })

        return () => window.removeEventListener('open-settings', handleOpen)
    }, [])

    useEffect(() => {
        if (!isOpen) return
        getAutoTrainingTrialInfoForCurrentUser().then((info) => {
            setTrialInfo(info)
        })
    }, [isOpen])

    const handleTogglePhotos = async (checked: boolean) => {
        setUpdating(true)
        setAllowImageDisclosure(checked)
        const result = await acceptTerms(checked) // Re-using acceptTerms to update the flag
        setUpdating(false)

        if (result.success) {
            toast({
                title: "Configuração atualizada",
                description: checked ? "Compartilhamento de fotos ativado." : "Compartilhamento de fotos desativado."
            })
        } else {
            toast({
                title: "Erro ao atualizar",
                description: "Não foi possível salvar sua preferência.",
                variant: "destructive"
            })
            setAllowImageDisclosure(!checked) // Revert on error
        }
    }

    const openTerms = () => {
        setIsOpen(false)
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-terms'))
        }, 100)
    }

    const requestDeletion = () => {
        const message = encodeURIComponent("Olá, gostaria de solicitar a exclusão da minha conta no RepTrail.")
        window.open(`https://wa.me/5541998364028?text=${message}`, '_blank')
    }

    const enableAutoTrainingTrial = async () => {
        setUpdating(true)
        const result = await enableAutoTrainingTrialForCurrentUser()
        setUpdating(false)

        if (result.success) {
            toast({
                title: 'Auto-Training ativado',
                description: 'Seu trial foi reativado. O popup será exibido novamente.',
            })
            setIsOpen(false)
            router.refresh()
        } else {
            toast({
                title: 'Erro ao ativar',
                description: result.error || 'Não foi possível ativar o Auto-Training.',
                variant: 'destructive'
            })
        }
    }

    const now = Date.now()
    const trialEndMs = trialInfo?.auto_training_trial_end ? new Date(trialInfo.auto_training_trial_end).getTime() : null
    const isTrialActive = trialInfo?.auto_training_status === 'trial' && !!trialEndMs && now <= trialEndMs
    const daysRemaining = isTrialActive && trialEndMs ? Math.max(0, Math.ceil((trialEndMs - now) / (1000 * 60 * 60 * 24))) : 0
    const hasUsedTrial = !!trialInfo?.auto_training_trial_used
    const canStartTrial = !hasUsedTrial || isTrialActive

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent showCloseButton={false} className="sm:max-w-md bg-zinc-950 border-zinc-800 p-0 overflow-hidden rounded-[2.5rem] max-h-[85vh] flex flex-col">
                <div className="p-8 space-y-8 relative flex-1 overflow-y-auto pr-2">
                    <DialogClose asChild>
                        <button
                            type="button"
                            aria-label="Fechar"
                            className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 shadow-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        >
                            <X className="w-5 h-5 mx-auto" />
                        </button>
                    </DialogClose>
                    <DialogHeader className="text-left space-y-2">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-2">
                            <Settings2 className="w-6 h-6 text-white" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-white uppercase italic tracking-tight">
                            Configurações
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 font-medium">
                            Gerencie suas preferências e conta.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Auto-Training */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Auto-Training</p>
                            <div className="space-y-2">
                                <button
                                    onClick={enableAutoTrainingTrial}
                                    disabled={updating || loading || !canStartTrial}
                                    className="w-full flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-zinc-200">
                                                {isTrialActive
                                                    ? `Trial ativo • ${daysRemaining} dia(s) restante(s)`
                                                    : hasUsedTrial
                                                        ? 'Trial indisponível'
                                                        : 'Ativar Trial do Auto-Training'}
                                            </p>
                                            <p className="text-[10px] text-zinc-500 uppercase font-medium">
                                                {isTrialActive
                                                    ? 'Você já usou seu trial'
                                                    : hasUsedTrial
                                                        ? 'Você já utilizou o trial anteriormente'
                                                        : 'Reexibir popup do trial'}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Privacidade & Notificações</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                            <ImageIcon className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-200">Compartilhar Fotos</p>
                                            <p className="text-[10px] text-zinc-500 uppercase font-medium">No perfil do Personal</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={allowImageDisclosure}
                                        onCheckedChange={handleTogglePhotos}
                                        disabled={updating || loading}
                                    />
                                </div>

                                <button
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-notifications-prompt'))}
                                    className="w-full flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:bg-zinc-900 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                            <Bell className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-200 text-left">Notificações</p>
                                            <p className="text-[10px] text-zinc-500 uppercase font-medium">Permissões do sistema</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Legal */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Jurídico</p>
                            <button
                                onClick={openTerms}
                                className="w-full flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:bg-zinc-900 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-zinc-200">Termos de Uso</p>
                                        <p className="text-[10px] text-zinc-500 uppercase font-medium">Rever contrato</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                            </button>
                        </div>

                        {/* Danger Zone */}
                        <div className="space-y-3 pt-2">
                            <p className="text-[10px] font-black text-red-500/50 uppercase tracking-[0.2em] px-1">Zona Crítica</p>
                            <button
                                onClick={requestDeletion}
                                className="w-full flex items-center justify-between p-4 bg-red-500/5 rounded-2xl border border-red-500/10 hover:bg-red-500/10 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-red-500">Excluir Minha Conta</p>
                                        <p className="text-[10px] text-red-500/60 uppercase font-medium whitespace-nowrap overflow-hidden text-ellipsis">Falar com suporte via WhatsApp</p>
                                    </div>
                                </div>
                                <MessageSquare className="w-5 h-5 text-red-500/40 group-hover:text-red-500 transition-colors" />
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-900 flex justify-center">
                        <div className="flex items-center gap-2 text-zinc-600">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">RepTrail Secure Access</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
