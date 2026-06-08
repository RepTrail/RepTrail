'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Settings2,
    Bell,
    Trash2,
    Zap,
    Clock,
    Download,
    CheckCircle2,
    Smartphone,
    CreditCard,
    Loader2,
    Crown
} from 'lucide-react'
import { actions } from '@/lib/dal'
import { getTermsStatus } from '@/lib/dal/remote'
import { getAutoTrainingTrialInfoForCurrentUser, enableAutoTrainingTrialForCurrentUser } from '@/lib/dal/remote'
import { useToast } from '@/hooks/use-toast'
import { useQuery } from '@/lib/dal'
import { getQueryClient } from '@/lib/get-query-client'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

// Design System Imports
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Box } from '@/components/store/base/box'
import { Input } from '@/components/store/base/input'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { SettingsActionCard } from '@/components/store/intermediary/settings-action-card'
import { Surface } from '@/components/store/base/surface'

interface SettingsModalProps {
    hasTrainer?: boolean
    isTrainer?: boolean
}

export function SettingsModal({ hasTrainer = false, isTrainer = false }: SettingsModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPwaModalOpen, setIsPwaModalOpen] = useState(false)
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deletePassword, setDeletePassword] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    // UI Local State
    const [pwaInstalled, setPwaInstalled] = useState(false)
    const [notifications, setNotifications] = useState('off')

    const queryClient = getQueryClient()
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

    const { mutate: startTrial } = useOptimisticMutation({
        actionName: 'enable-auto-training-trial',
        entity: ENTITIES.SETTINGS,
        queryKey: ['auto-training-trial'],
        mutationFn: async () => enableAutoTrainingTrialForCurrentUser(),
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
            router.refresh()
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
        const handleOpen = () => {
            setIsOpen(true)
            // Re-check standalone mode when modal opens
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true ||
                document.referrer.includes('android-app://')

            if (isStandalone) {
                setPwaInstalled(true)
            }
        }
        window.addEventListener('open-settings', handleOpen)

        // Initial check
        if (typeof window !== 'undefined') {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true
            if (isStandalone) setPwaInstalled(true)

            if ('Notification' in window && Notification.permission === 'granted') {
                setNotifications('on')
            }
        }

        return () => window.removeEventListener('open-settings', handleOpen)
    }, [])

    const enableAutoTrainingTrial = () => {
        if (isTrialActive) return
        startTrial({})
    }

    const now = Date.now()
    const trialInfo = trialData
    const trialEndMs = trialInfo?.auto_training_trial_end ? new Date(trialInfo.auto_training_trial_end).getTime() : null
    const isTrialActive = trialInfo?.auto_training_status === 'trial' && !!trialEndMs && now <= trialEndMs
    const daysRemaining = isTrialActive && trialEndMs ? Math.max(0, Math.ceil((trialEndMs - now) / (1000 * 60 * 60 * 24))) : 0
    const hasUsedTrial = !!trialInfo?.auto_training_trial_used

    let autoTreinoStatus: 'available' | 'trial_active' | 'subscription_active' | 'used' = 'available'
    if (trialInfo?.auto_training_status === 'active') autoTreinoStatus = 'subscription_active'
    else if (isTrialActive) autoTreinoStatus = 'trial_active'
    else if (hasUsedTrial) autoTreinoStatus = 'used'

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="CONFIGURAÇÕES DO SISTEMA"
                subtitle="Gerencie suas preferências e recursos premium."
                icon={Settings2}
                variant="primary"
                confirmLabel="SALVAR PREFERÊNCIAS"
                onConfirm={() => setIsOpen(false)}
            >
                <Box position="relative">
                    {(loadingTerms || loadingTrial) && (
                        <Box
                            position="absolute"
                            pin="inset"
                            zIndex={STORE_TOKENS.Z_INDEX.OVERLAY}
                            display="flex"
                            align="center"
                            justify="center"
                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            bg={STORE_TOKENS.COLORS.BLACK}
                            bgOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                        >
                            <Icon icon={Loader2} color={STORE_TOKENS.COLORS.SUCCESS} size="md" animate="spin" />
                        </Box>
                    )}

                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>

                        {!pwaInstalled && (
                            <SettingsActionCard
                                icon={Smartphone}
                                title="APP REPTRAIL"
                                subtitle="INSTALE PARA ACESSO RÁPIDO"
                                actionLabel="INSTALAR"
                                buttonVariant="outline-blue"
                                actionIcon={Download}
                                onAction={() => {
                                    setIsPwaModalOpen(true)
                                }}
                                {...{
                                    color: "blue",
                                }} />
                        )}

                        <SettingsActionCard
                            icon={Bell}
                            title="NOTIFICAÇÕES PUSH"
                            subtitle="RECEBA ALERTAS DE TREINOS E DIETAS"
                            actionLabel={notifications === 'on' ? 'CONFIGURAR' : 'ATIVAR'}
                            buttonVariant="outline-orange"
                            actionIcon={Bell}
                            onAction={() => {
                                setIsOpen(false)
                                setIsNotificationModalOpen(true)
                            }}
                            {...{
                                color: "orange",
                            }} />

                        {!isTrainer && !hasTrainer && (
                            <>
                                {autoTreinoStatus === 'available' && (
                                    <SettingsActionCard
                                        icon={Zap}
                                        surfaceVariant="glass"
                                        title="TESTE GRÁTIS DISPONÍVEL"
                                        subtitle="EXPERIMENTE POR 7 DIAS SEM CUSTOS"
                                        actionLabel="HABILITAR"
                                        buttonVariant="outline-emerald"
                                        actionIcon={Zap}
                                        onAction={enableAutoTrainingTrial}
                                        {...{
                                            color: "emerald",
                                        }} />
                                )}

                                {autoTreinoStatus === 'subscription_active' && (
                                    <SettingsActionCard
                                        icon={Crown}
                                        title="AUTO-TREINO ATIVO"
                                        subtitle="VOCÊ POSSUI ACESSO TOTAL ÀS FUNCIONALIDADES"
                                        actionLabel="GERENCIAR"
                                        actionIcon={CheckCircle2}
                                        buttonVariant="outline-emerald"
                                        onAction={() => {
                                            setIsOpen(false)
                                            router.push('/dashboard/student/profile')
                                        }}
                                        {...{
                                            color: "emerald",
                                        }} />
                                )}

                                {autoTreinoStatus === 'trial_active' && (
                                    <SettingsActionCard
                                        icon={Clock}
                                        title="TESTE EM ANDAMENTO"
                                        subtitle={`VOCÊ TEM ${daysRemaining} DIAS RESTANTES`}
                                        actionLabel="ATIVO"
                                        actionIcon={CheckCircle2}
                                        buttonVariant="outline-emerald"
                                        onAction={() => { }}
                                        disabled
                                        {...{
                                            color: "emerald",
                                        }} />
                                )}

                                {autoTreinoStatus === 'used' && (
                                    <SettingsActionCard
                                        icon={Zap}
                                        surfaceVariant="glass"
                                        title="TESTE INDISPONÍVEL"
                                        subtitle="VOCÊ JÁ UTILIZOU SEU PERÍODO DE TESTE"
                                        actionLabel="ASSINAR"
                                        buttonVariant="outline-zinc"
                                        actionIcon={CreditCard}
                                        onAction={() => {
                                            setIsOpen(false)
                                            window.dispatchEvent(new CustomEvent('open-asaas', { detail: { tier: 'auto_training' } }))
                                        }}
                                        {...{
                                            color: "zinc",
                                        }} />
                                )}
                            </>
                        )}

                        <SettingsActionCard
                            icon={Trash2}
                            title="ZONA CRÍTICA"
                            subtitle="AÇÃO IRREVERSÍVEL E PERMANENTE"
                            actionLabel="DELETAR"
                            buttonVariant="outline-red"
                            actionIcon={Trash2}
                            onAction={() => {
                                setIsOpen(false)
                                setIsDeleteModalOpen(true)
                            }}
                            {...{
                                color: "red",
                            }} />

                    </Stack>
                </Box>
            </Modal>
            {/* Confirmation Modals */}
            <Modal
                isOpen={isPwaModalOpen}
                onClose={() => setIsPwaModalOpen(false)}
                title="INSTALAR APLICATIVO"
                subtitle="Tenha o RepTrail sempre com você."
                icon={Download}
                variant="emerald"
                confirmLabel="INSTALAR AGORA"
                onConfirm={() => {
                    toast({ title: "Instalando...", description: "O aplicativo está sendo instalado no seu dispositivo." })
                    setPwaInstalled(true)
                    setIsPwaModalOpen(false)
                }}
            >
                <Font
                    variant="body-sm"
                    {...{
                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                    }}>
                    Ao instalar o PWA, você terá acesso rápido ao RepTrail direto da tela inicial do seu celular, com carregamento mais rápido e experiência de aplicativo nativo.
                </Font>
            </Modal>
            <Modal
                isOpen={isNotificationModalOpen}
                onClose={() => {
                    setNotifications('off')
                    setIsNotificationModalOpen(false)
                }}
                title="ATIVAR NOTIFICAÇÕES"
                subtitle="Fique por dentro das novidades."
                icon={Bell}
                variant="blue"
                confirmLabel="PERMITIR"
                onConfirm={async () => {
                    if (!('Notification' in window)) {
                        toast({ variant: 'destructive', title: "Não suportado", description: "Seu navegador não suporta notificações push." })
                        setIsNotificationModalOpen(false)
                        return
                    }

                    const permission = await Notification.requestPermission()

                    if (permission === 'granted') {
                        toast({ title: "Notificações ativadas", description: "Você receberá alertas importantes do seu treinador." })
                        setNotifications('on')
                    } else {
                        toast({ variant: 'destructive', title: "Permissão negada", description: "Você não receberá notificações até permitir nas configurações do navegador." })
                        setNotifications('off')
                    }
                    setIsNotificationModalOpen(false)
                }}
            >
                <Font
                    variant="body-sm"
                    {...{
                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                    }}>
                    Permita que o RepTrail envie notificações push para avisar sobre novos treinos, feedbacks de dieta e mensagens importantes do seu personal.
                </Font>
            </Modal>
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setDeletePassword('')
                }}
                title="EXCLUIR CONTA"
                subtitle="Ação irreversível."
                icon={Trash2}
                variant="red"
                confirmLabel="Excluir"
                isLoading={isDeleting}
                onConfirm={async () => {
                    if (!deletePassword) {
                        toast({ variant: 'destructive', title: "Senha obrigatória", description: "Digite sua senha para confirmar a exclusão." })
                        return
                    }
                    setIsDeleting(true)

                    const res = await actions.selfDeleteAction(deletePassword)

                    if (res?.error) {
                        toast({ variant: 'destructive', title: "Erro na exclusão", description: res.error })
                        setIsDeleting(false)
                        return
                    }

                    toast({ title: "Conta excluída", description: "Sua conta e todos os dados foram removidos com sucesso." })
                    setIsDeleting(false)
                    setIsDeleteModalOpen(false)
                    router.push('/auth/login')
                }}
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Surface
                        variant="tonal-red"
                        padding={STORE_TOKENS.PADDING.ELEMENT}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        display="flex"
                        align="center"
                        minHeight={44}
                    >
                        <Font
                            variant="body-sm"
                            {...{
                                color: "red",
                            }}>
                            Atenção: Ao excluir sua conta, todos os seus protocolos, histórico de treinos e métricas serão apagados <Font weight='bold'>para sempre</Font>. Esta ação não pode ser desfeita.
                        </Font>
                    </Surface>
                    <Input
                        type="password"
                        label="SENHA DE CONFIRMAÇÃO"
                        placeholder="Digite sua senha"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                    />
                </Stack>
            </Modal>
        </>
    );
}
