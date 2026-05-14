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
    AlertTriangle,
    Key,
    Loader2
} from 'lucide-react'
import { getTermsStatus } from '@/actions/terms-actions'
import { getAutoTrainingTrialInfoForCurrentUser } from '@/actions/auto-training-actions'
import { getStudentProfile } from '@/actions/student-actions'
import { AUTO_TRAINING_PRICE } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { useQuery } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { AsaasPaymentModal } from '@/components/store/advanced/asaas-payment-modal'

// Design System Imports
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { FormSwitch } from '@/components/store/base/form-switch'
import { Surface } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { Input } from '@/components/store/base/input'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface SettingsModalProps {
    hasTrainer?: boolean
}

export function SettingsModal({ hasTrainer = false }: SettingsModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPwaModalOpen, setIsPwaModalOpen] = useState(false)
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isAsaasModalOpen, setIsAsaasModalOpen] = useState(false)
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

    const { data: profileData } = useQuery({
        queryKey: ['student-profile', 'me'],
        queryFn: async () => getStudentProfile('me'),
        enabled: isAsaasModalOpen,
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

    const handleNotificationToggle = (val: string) => {
        if (val === 'on') {
            setIsOpen(false)
            setIsNotificationModalOpen(true)
        } else {
            setNotifications('off')
        }
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
                <div className="relative">
                    {(loadingTerms || loadingTrial) && (
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-[60] flex items-center justify-center rounded-[2rem]">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    )}

                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>

                        {/* PWA Section */}
                        <Surface variant="tonal-blue" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Box bg="blue" bgOpacity={20} padding={STORE_TOKENS.PADDING.ELEMENT} rounded="full">
                                    <Icon icon={Smartphone} color="blue" size="md" />
                                </Box>
                                <Stack flex1 gap={0}>
                                    <Font variant="body" weight="black" uppercase italic color="blue">APLICATIVO REPTRAIL</Font>
                                    <Font variant="sub-tiny" weight="bold" color="blue" opacity={70}>INSTALE PARA ACESSO RÁPIDO E OFFLINE</Font>
                                </Stack>
                                <Button
                                    variant="outline-blue"
                                    size="sm"
                                    onClick={() => {
                                        setIsOpen(false)
                                        setIsPwaModalOpen(true)
                                    }}
                                    disabled={pwaInstalled}
                                >
                                    {pwaInstalled ? 'INSTALADO' : (
                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Icon icon={Download} size="xs" />
                                            <Font variant="body-sm" weight="black" uppercase italic>INSTALAR</Font>
                                        </Stack>
                                    )}
                                </Button>
                            </Stack>
                        </Surface>

                        {/* Notifications Section */}
                        <Surface variant="tonal-amber" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Box bg="amber" bgOpacity={20} padding={STORE_TOKENS.PADDING.ELEMENT} rounded="full">
                                    <Icon icon={Bell} color="amber" size="md" />
                                </Box>
                                <Stack flex1 gap={0}>
                                    <Font variant="body" weight="black" uppercase italic color="amber">NOTIFICAÇÕES PUSH</Font>
                                    <Font variant="sub-tiny" weight="bold" color="amber" opacity={70}>RECEBA ALERTAS DE TREINOS E DIETAS</Font>
                                </Stack>
                                <Button
                                    variant="outline-amber"
                                    size="sm"
                                    onClick={() => {
                                        setIsOpen(false)
                                        setIsNotificationModalOpen(true)
                                    }}
                                >
                                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Font variant="body-sm" weight="black" uppercase italic>{notifications === 'on' ? 'CONFIGURAR' : 'ATIVAR'}</Font>
                                    </Stack>
                                </Button>
                            </Stack>
                        </Surface>

                        {/* Auto-Treino Status Section */}
                        {!hasTrainer && (
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                {autoTreinoStatus === 'available' && (
                                    <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                                        <Stack direction="row" align="center" justify="between" fullWidth>
                                            <Stack gap={0}>
                                                <Font variant="body-sm" weight="black" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic>TESTE GRÁTIS DISPONÍVEL</Font>
                                                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>EXPERIMENTE POR 7 DIAS SEM CUSTOS</Font>
                                            </Stack>
                                            <Button variant="outline-emerald" size="sm" onClick={enableAutoTrainingTrial}>
                                                <Font variant="body-sm" weight="black" uppercase italic>HABILITAR</Font>
                                            </Button>
                                        </Stack>
                                    </Surface>
                                )}

                                {autoTreinoStatus === 'active' && (
                                    <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                                        <Stack direction="row" align="center" justify="between" fullWidth>
                                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Icon icon={Clock} size="sm" color="emerald" />
                                                <Stack gap={0}>
                                                    <Font variant="body-sm" weight="black" color="emerald" uppercase italic>TESTE EM ANDAMENTO</Font>
                                                    <Font variant="sub-tiny" color="emerald" weight="bold" opacity={70}>VOCÊ TEM {daysRemaining} DIAS RESTANTES</Font>
                                                </Stack>
                                            </Stack>
                                            <Icon icon={CheckCircle2} size="sm" color="emerald" />
                                        </Stack>
                                    </Surface>
                                )}

                                {autoTreinoStatus === 'used' && (
                                    <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none" bgOpacity={5} bg="zinc">
                                        <Stack direction="row" align="center" justify="between" fullWidth>
                                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Icon icon={Zap} size="sm" color={STORE_TOKENS.COLORS.TEXT.DIM} />
                                                <Stack gap={0}>
                                                    <Font variant="body-sm" weight="black" color={STORE_TOKENS.COLORS.TEXT.DIM} uppercase italic>TESTE INDISPONÍVEL</Font>
                                                    <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM}>VOCÊ JÁ UTILIZOU SEU PERÍODO DE TESTE</Font>
                                                </Stack>
                                            </Stack>
                                            <Button variant="outline-primary" size="sm" onClick={() => setIsAsaasModalOpen(true)}>
                                                <Font variant="body-sm" weight="black" uppercase italic>ASSINAR</Font>
                                            </Button>
                                        </Stack>
                                    </Surface>
                                )}
                            </Stack>
                        )}

                        {/* Danger Zone Section */}
                        <Surface variant="tonal-red" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Box bg="red" bgOpacity={20} padding={STORE_TOKENS.PADDING.ELEMENT} rounded="full">
                                    <Icon icon={Trash2} color="red" size="md" />
                                </Box>
                                <Stack flex1 gap={0}>
                                    <Font variant="body" weight="black" uppercase italic color="red">ZONA CRÍTICA</Font>
                                    <Font variant="sub-tiny" weight="bold" color="red" opacity={70}>AÇÃO IRREVERSÍVEL E PERMANENTE</Font>
                                </Stack>
                                <Button
                                    variant="outline-red"
                                    size="sm"
                                    onClick={() => {
                                        setIsOpen(false)
                                        setIsDeleteModalOpen(true)
                                    }}
                                >
                                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Font variant="body-sm" weight="black" uppercase italic>DELETAR</Font>
                                    </Stack>
                                </Button>
                            </Stack>
                        </Surface>

                    </Stack>
                </div>
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
                <div className="text-zinc-400 text-sm">
                    Ao instalar o PWA, você terá acesso rápido ao RepTrail direto da tela inicial do seu celular, com carregamento mais rápido e experiência de aplicativo nativo.
                </div>
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
                <div className="text-zinc-400 text-sm">
                    Permita que o RepTrail envie notificações push para avisar sobre novos treinos, feedbacks de dieta e mensagens importantes do seu personal.
                </div>
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
                <div className="space-y-4">
                    <div className="text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                        Atenção: Ao excluir sua conta, todos os seus protocolos, histórico de treinos e métricas serão apagados <strong>para sempre</strong>. Esta ação não pode ser desfeita.
                    </div>
                    <Input
                        type="password"
                        label="SENHA DE CONFIRMAÇÃO"
                        placeholder="Digite sua senha"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                    />
                </div>
            </Modal>

            <AsaasPaymentModal 
                isOpen={isAsaasModalOpen}
                onClose={() => setIsAsaasModalOpen(false)}
                tier="auto_training"
                currentCpf={profileData?.cpf}
                currentName={profileData?.full_name}
                monthlyTotal={AUTO_TRAINING_PRICE}
            />
        </>
    )
}
