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
    DialogFooter
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
    X,
    Loader2
} from 'lucide-react'
import { getTermsStatus, acceptTerms } from '@/actions/terms-actions'
import { enableAutoTrainingTrialForCurrentUser, getAutoTrainingTrialInfoForCurrentUser } from '@/actions/auto-training-actions'
import { useToast } from '@/hooks/use-toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

interface SettingsModalProps {
    hasTrainer?: boolean
}

export function SettingsModal({ hasTrainer = false }: SettingsModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const router = useRouter()

    const { data: termsStatus, isLoading: loadingTerms } = useQuery({
        queryKey: ['terms-status'],
        queryFn: async () => getTermsStatus(),
        staleTime: 1000 * 60 * 5
    })

    const { data: trialData, isLoading: loadingTrial } = useQuery({
        queryKey: ['auto-training-trial'],
        queryFn: async () => getAutoTrainingTrialInfoForCurrentUser(),
        enabled: isOpen && !hasTrainer,
        staleTime: 1000 * 60 * 5
    })

    const { mutate: togglePhotos } = useOptimisticMutation({
        actionName: 'accept-terms',
        entity: ENTITIES.SETTINGS,
        queryKey: ['terms-status'],
        mutationFn: async (variables: { allowImageDisclosure: boolean }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(['terms-status'])
            queryClient.setQueryData(['terms-status'], (old: any) => ({ ...old, allowImageDisclosure: variables.allowImageDisclosure }))
            return { previous }
        },
        onSuccess: () => {
            toast({ title: "Configuração atualizada", description: "Sua preferência foi salva offline." })
        },
        onError: (err, variables, ctx) => {
            queryClient.setQueryData(['terms-status'], ctx?.previous)
            toast({ variant: "destructive", title: "Erro ao atualizar", description: "Falha ao sincronizar preferência." })
        }
    })

    const { mutate: startTrial } = useOptimisticMutation({
        actionName: 'enable-auto-training-trial',
        entity: ENTITIES.SETTINGS,
        queryKey: ['auto-training-trial'],
        mutationFn: async () => ({}),
        onMutate: () => {
            const previous = queryClient.getQueryData(['auto-training-trial'])
            queryClient.setQueryData(['auto-training-trial'], (old: any) => ({ 
                ...old, 
                auto_training_status: 'trial',
                auto_training_trial_used: true,
                auto_training_trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }))
            return { previous }
        },
        onSuccess: () => {
            toast({ title: "Trial Ativado!", description: "Aproveite seus 7 dias de Auto-Training." })
            setIsOpen(false)
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('open-auto-training-onboarding'))
            }, 100)
        },
        onError: (err, variables, ctx) => {
            queryClient.setQueryData(['auto-training-trial'], ctx?.previous)
            toast({ variant: "destructive", title: "Erro ao ativar trial", description: "Tente novamente em alguns instantes." })
        }
    })

    useEffect(() => {
        const handleOpen = () => setIsOpen(true)
        window.addEventListener('open-settings', handleOpen)
        return () => window.removeEventListener('open-settings', handleOpen)
    }, [])

    const handleTogglePhotos = (checked: boolean) => {
        togglePhotos({ allowImageDisclosure: checked })
    }

    const enableAutoTrainingTrial = () => {
        if (isTrialActive) return
        startTrial({})
    }

    const openTerms = () => {
        setIsOpen(false)
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-terms'))
        }, 100)
    }


    const requestDeletion = () => {
        window.open('https://wa.me/5511999999999?text=Quero%20excluir%20minha%20conta', '_blank')
    }

    const now = Date.now()
    const trialInfo = trialData
    const trialEndMs = trialInfo?.auto_training_trial_end ? new Date(trialInfo.auto_training_trial_end).getTime() : null
    const isTrialActive = trialInfo?.auto_training_status === 'trial' && !!trialEndMs && now <= trialEndMs
    const daysRemaining = isTrialActive && trialEndMs ? Math.max(0, Math.ceil((trialEndMs - now) / (1000 * 60 * 60 * 24))) : 0
    const hasUsedTrial = !!trialInfo?.auto_training_trial_used

    const allowImageDisclosure = termsStatus?.allowImageDisclosure ?? true

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent showCloseButton={false} className="max-w-xl">
                <div className="space-y-10">
                    {(loadingTerms || loadingTrial) && (
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-[60] flex items-center justify-center rounded-[2rem]">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    )}
                    <DialogClose asChild>
                        <button
                            type="button"
                            aria-label="Fechar"
                            className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 z-50"
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
                        {!hasTrainer && (
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Auto-Training</p>
                                <div className="space-y-2">
                                    {(isTrialActive || !hasUsedTrial) ? (
                                        <button
                                            onClick={isTrialActive ? undefined : enableAutoTrainingTrial}
                                            className={`w-full flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 transition-all group ${isTrialActive ? 'cursor-default' : 'hover:bg-zinc-900 hover:border-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed'}`}
                                        >
                                            <div className="flex items-center gap-3 pb-4">
                                                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                                                    <Zap className="w-5 h-5 text-orange-500" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-zinc-200">
                                                        {isTrialActive
                                                            ? `Trial ativo • ${daysRemaining} dia(s) restante(s)`
                                                            : 'Ativar Trial do Auto-Training'}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-500 uppercase font-medium">
                                                        {isTrialActive
                                                            ? 'Aproveite seus 7 dias grátis'
                                                            : 'Teste grátis por 7 dias'}
                                                    </p>
                                                </div>
                                            </div>
                                            {isTrialActive ? (
                                                <div className="flex items-center justify-center pr-2">
                                                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-[pulse_2s_ease-in-out_infinite]" />
                                                </div>
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => router.push('/dashboard/student/plans')}
                                            className="w-full flex items-center justify-between p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all group"
                                        >
                                            <div className="flex items-center gap-3 pb-4">
                                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-black text-white italic uppercase tracking-tight">
                                                        Assinar Auto-Treino
                                                    </p>
                                                    <p className="text-[10px] text-emerald-500/70 uppercase font-bold tracking-widest leading-none mt-0.5">
                                                        Liberar recursos premium
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">PRO</span>
                                                <ChevronRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

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
                                        className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-800"
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        setIsOpen(false)
                                        setTimeout(() => {
                                            window.dispatchEvent(new CustomEvent('open-notifications-prompt'))
                                        }, 100)
                                    }}
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
// Force rebuild 2026-03-13 00:58
