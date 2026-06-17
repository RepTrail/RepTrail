'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@/lib/dal'
import { useToast } from '@/components/store/hooks/use-toast'
import { enableAutoTrainingTrialForCurrentUser } from '@/actions/auto-training-actions'
import { cancelAsaasSubscription } from '@/actions/asaas-actions'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Modal } from '@/components/store/advanced/modal'
import { AsaasPaymentModal } from '@/components/store/advanced/asaas-payment-modal'
import { UserProfileSummary } from '@/components/store/advanced/user-profile-summary'
import { StudentSubscriptionStatus } from '@/components/store/advanced/student-subscription-status'
import { StudentProfileForm } from '@/components/store/advanced/student-profile-form'
import {
    Zap,
    AlertCircle,
    CheckCircle,
    XCircle
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentProfile } from '@/lib/dal/remote'

/**
 * StudentProfileSectionContent: A premium reconstruction of the student profile screen.
 * Fully data-driven via React Query + getStudentProfile action.
 */
export function StudentProfileSectionContent({
    userId,
    showVariants = false
}: {
    userId?: string
    showVariants?: boolean
}) {
    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
    const [isAsaasModalOpen, setIsAsaasModalOpen] = useState(false)

    const { data: profile } = useQuery({
        queryKey: userId ? QUERY_KEYS.student.details(userId) : ['student-profile-no-id'],
        queryFn: () => getStudentProfile(userId!),
        enabled: !!userId
    })

    const router = useRouter()
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const { mutate: startTrial, isPending: isActivatingTrial } = useMutation({
        mutationFn: async () => enableAutoTrainingTrialForCurrentUser(),
        onSuccess: (res) => {
            if (res.success === false) {
                toast({ variant: 'destructive', title: "Erro", description: res.error || "Erro ao ativar o teste grátis." })
                return
            }
            toast({ title: "Teste Ativado!", description: "Aproveite seus 7 dias de acesso total." })
            setIsTrialModalOpen(false)
            if (userId) queryClient.invalidateQueries({ queryKey: QUERY_KEYS.student.details(userId) })
            router.refresh()
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('open-auto-training-onboarding'))
            }, 100)
        },
        onError: () => {
            toast({ variant: 'destructive', title: "Erro", description: "Ocorreu um erro ao ativar seu teste." })
        }
    })

    const { mutate: cancelSubscription, isPending: isCancelling } = useMutation({
        mutationFn: async () => cancelAsaasSubscription(),
        onSuccess: (res) => {
            if (res.success === false) {
                toast({ variant: 'destructive', title: "Erro", description: res.error || "Erro ao cancelar assinatura." })
                return
            }
            toast({ title: "Assinatura Cancelada", description: "Sua assinatura foi cancelada." })
            setIsCancelModalOpen(false)
            if (userId) queryClient.invalidateQueries({ queryKey: QUERY_KEYS.student.details(userId) })
            router.refresh()
        },
        onError: () => {
            toast({ variant: 'destructive', title: "Erro", description: "Tente novamente mais tarde." })
        }
    })

    // Derive subscription status from backend data
    const subscriptionStatus: 'active' | 'trial_available' | 'expired' = (() => {
        const status = profile?.auto_training_status
        const trialEnd = profile?.auto_training_trial_end
        const now = new Date()

        if (status === 'active') return 'active'

        if (status === 'trial') {
            if (trialEnd && new Date(trialEnd) > now) {
                return 'active'
            }
            return 'expired'
        }

        if (status === 'trial_available') return 'trial_available'
        if (!profile?.auto_training_trial_used && status !== 'expired' && status !== 'disabled') {
            return 'trial_available'
        }

        return 'expired'
    })()

    const name = profile?.full_name || profile?.name || 'Carregando...'
    const email = profile?.email || ''
    const avatarUrl = profile?.avatar_url

    return (
        <>
            <Grid mdCols={12} gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
            {/* Left Column: Profile Card & Statuses (4 cols) */}
            <Box mdColSpan={4}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <UserProfileSummary
                        type="student"
                        name={name}
                        email={email}
                        avatarUrl={avatarUrl}
                        userId={userId}
                    />

                    <StudentSubscriptionStatus
                        status={subscriptionStatus}
                        onActivateTrial={() => setIsTrialModalOpen(true)}
                        onCancelSubscription={() => setIsCancelModalOpen(true)}
                        onRenewSubscription={() => setIsAsaasModalOpen(true)}
                    />

                    {showVariants && (
                        <>
                            <StudentSubscriptionStatus
                                status="trial_available"
                                onActivateTrial={() => setIsTrialModalOpen(true)}
                                onCancelSubscription={() => setIsCancelModalOpen(true)}
                                onRenewSubscription={() => setIsAsaasModalOpen(true)}
                            />
                            <StudentSubscriptionStatus
                                status="expired"
                                onActivateTrial={() => setIsTrialModalOpen(true)}
                                onCancelSubscription={() => setIsCancelModalOpen(true)}
                                onRenewSubscription={() => setIsAsaasModalOpen(true)}
                            />
                        </>
                    )}
                </Stack>
            </Box>

            {/* Right Column: Edit Form (8 cols) */}
            <Box mdColSpan={8}>
                <StudentProfileForm userId={userId} profile={profile} />
            </Box>
        </Grid >
        {/* Confirmation Modals */ }
        < Modal
    isOpen={isTrialModalOpen}
    onClose={() => setIsTrialModalOpen(false)}
    title="ATIVAR TESTE GRÁTIS"
    subtitle="Você terá acesso total por 7 dias."
    icon={Zap}
    variant="orange"
    confirmLabel="ATIVAR AGORA"
    confirmIcon={CheckCircle}
    isLoading={isActivatingTrial}
    onConfirm={() => startTrial()}
>
    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
        <Font
            variant="body-sm"
            {...{
                color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
            }}>
            Ao ativar o período de teste, você terá acesso imediato a todas as ferramentas de Auto-Treino, Dieta e Ergogênicos do RepTrail.
        </Font>
        <Font
            variant="sub-tiny"
            weight="bold"
            {...{
                color: STORE_TOKENS.COLORS.TEXT.MUTED,
            }}>
            * O teste é válido por 7 dias corridos e não requer cartão de crédito agora.
        </Font>
    </Stack>
            </Modal >
            <Modal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                title="CANCELAR ASSINATURA"
                subtitle="Sentiremos sua falta na plataforma!"
                icon={AlertCircle}
                variant="red"
                confirmLabel="CONFIRMAR CANCELAMENTO"
                confirmIcon={XCircle}
                confirmVariant="outline-red"
                isLoading={isCancelling}
                onConfirm={() => cancelSubscription()}
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font
                        variant="body-sm"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                        }}>
                        Tem certeza que deseja cancelar sua assinatura do Auto-Treino? Você perderá o acesso aos seus protocolos e histórico ao final do ciclo atual.
                    </Font>
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        italic
                        {...{
                            color: "red",
                        }}>
                        Esta ação não pode ser desfeita automaticamente.
                    </Font>
                </Stack>
            </Modal>
            <AsaasPaymentModal
                isOpen={isAsaasModalOpen}
                onClose={() => setIsAsaasModalOpen(false)}
                tier="auto_training"
                monthlyTotal={10.90}
                currentName={name}
            />
        </>
    );
}

