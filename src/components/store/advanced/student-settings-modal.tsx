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
    ShieldAlert,
    CheckCircle2,
    Smartphone,
    Loader2
} from 'lucide-react'
import { getTermsStatus } from '@/actions/terms-actions'
import { getAutoTrainingTrialInfoForCurrentUser } from '@/actions/auto-training-actions'
import { useToast } from '@/hooks/use-toast'
import { useQuery } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

// Design System Imports
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Surface } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { Input } from '@/components/store/base/input'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { SettingsActionCard } from '@/components/store/intermediary/settings-action-card'

interface SettingsModalProps {
    hasTrainer?: boolean
}

export function SettingsModal({ hasTrainer = false }: SettingsModalProps) {
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

    let autoTreinoStatus: 'available' | 'active' | 'used' = 'available'
    if (isTrialActive) autoTreinoStatus = 'active'
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
                            zIndex={50} 
                            display="flex" 
                            align="center" 
                            justify="center" 
                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            bg="black"
                            bgOpacity={20}
                        >
                            <Icon icon={Loader2} color="emerald" size="md" animate="spin" />
                        </Box>
                    )}
                    
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        
                        <SettingsActionCard
                            icon={Smartphone}
                            color="blue"
                            title="APLICATIVO REPTRAIL"
                            subtitle="INSTALE PARA ACESSO RÁPIDO E OFFLINE"
                            actionLabel={pwaInstalled ? 'INSTALADO' : 'INSTALAR'}
                            buttonVariant="outline-blue"
                            disabled={pwaInstalled}
                            onAction={() => {
                                setIsOpen(false)
                                setIsPwaModalOpen(true)
                            }}
                        >
                            {!pwaInstalled && (
                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Icon icon={Download} size="xs" />
                                    <Font variant="body-sm" weight="black" uppercase italic>INSTALAR</Font>
                                </Stack>
                            )}
                        </SettingsActionCard>

                        <SettingsActionCard
                            icon={Bell}
                            color="amber"
                            title="NOTIFICAÇÕES PUSH"
                            subtitle="RECEBA ALERTAS DE TREINOS E DIETAS"
                            actionLabel={notifications === 'on' ? 'CONFIGURAR' : 'ATIVAR'}
                            buttonVariant="outline-amber"
                            onAction={() => {
                                setIsOpen(false)
                                setIsNotificationModalOpen(true)
                            }}
                        />

                        {!hasTrainer && (
                            <>
                                {autoTreinoStatus === 'available' && (
                                    <SettingsActionCard
                                        icon={Zap}
                                        color="emerald"
                                        surfaceVariant="glass"
                                        title="TESTE GRÁTIS DISPONÍVEL"
                                        subtitle="EXPERIMENTE POR 7 DIAS SEM CUSTOS"
                                        actionLabel="HABILITAR"
                                        buttonVariant="outline-emerald"
                                        onAction={enableAutoTrainingTrial}
                                    />
                                )}

                                {autoTreinoStatus === 'active' && (
                                    <SettingsActionCard
                                        icon={Clock}
                                        color="emerald"
                                        title="TESTE EM ANDAMENTO"
                                        subtitle={`VOCÊ TEM ${daysRemaining} DIAS RESTANTES`}
                                        actionLabel="HABILITADO"
                                        buttonVariant="emerald"
                                        onAction={() => {}}
                                        disabled
                                    >
                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Icon icon={CheckCircle2} size="sm" color="black" />
                                            <Font variant="body-sm" weight="black" uppercase italic>ATIVO</Font>
                                        </Stack>
                                    </SettingsActionCard>
                                )}

                                {autoTreinoStatus === 'used' && (
                                    <SettingsActionCard
                                        icon={Zap}
                                        color="zinc"
                                        surfaceVariant="glass"
                                        title="TESTE INDISPONÍVEL"
                                        subtitle="VOCÊ JÁ UTILIZOU SEU PERÍODO DE TESTE"
                                        actionLabel="ASSINAR"
                                        buttonVariant="outline-primary"
                                        onAction={() => router.push('/dashboard/student/plans')}
                                    />
                                )}
                            </>
                        )}

                        <SettingsActionCard
                            icon={Trash2}
                            color="red"
                            title="ZONA CRÍTICA"
                            subtitle="AÇÃO IRREVERSÍVEL E PERMANENTE"
                            actionLabel="DELETAR"
                            buttonVariant="outline-red"
                            onAction={() => {
                                setIsOpen(false)
                                setIsDeleteModalOpen(true)
                            }}
                        />

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
                <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.DIM}>
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
                onConfirm={() => {
                    toast({ title: "Notificações ativadas", description: "Você receberá alertas importantes do seu treinador." })
                    setNotifications('on')
                    setIsNotificationModalOpen(false)
                }}
            >
                <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.DIM}>
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
                confirmLabel="EXCLUIR PERMANENTEMENTE"
                isLoading={isDeleting}
                onConfirm={() => {
                    if (!deletePassword) {
                        toast({ variant: 'destructive', title: "Senha obrigatória", description: "Digite sua senha para confirmar a exclusão." })
                        return
                    }
                    setIsDeleting(true)
                    setTimeout(() => {
                        toast({ title: "Conta excluída", description: "Sua conta e todos os dados foram removidos com sucesso." })
                        setIsDeleting(false)
                        setIsDeleteModalOpen(false)
                        router.push('/login')
                    }, 1500)
                }}
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Box 
                        padding={STORE_TOKENS.PADDING.ELEMENT} 
                        rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                        border
                        borderColor="red"
                        borderOpacity={20}
                        bg="red"
                        bgOpacity={10}
                    >
                        <Font variant="body-sm" color="red">
                            Atenção: Ao excluir sua conta, todos os seus protocolos, histórico de treinos e métricas serão apagados <strong>para sempre</strong>. Esta ação não pode ser desfeita.
                        </Font>
                    </Box>
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
    )
}
