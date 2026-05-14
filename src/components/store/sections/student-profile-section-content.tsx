'use client'

import React, { useState } from 'react'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Modal } from '@/components/store/advanced/modal'
import { AsaasPaymentModal } from '@/components/store/advanced/asaas-payment-modal'
import { StudentProfileSummary } from '@/components/store/advanced/student-profile-summary'
import { StudentSubscriptionStatus } from '@/components/store/advanced/student-subscription-status'
import { StudentProfileForm } from '@/components/store/advanced/student-profile-form'
import { 
    Zap, 
    AlertCircle, 
    CheckCircle, 
    XCircle
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * StudentProfileSectionContent: A premium reconstruction of the student profile screen.
 * Refactored to orchestrate Advanced components.
 * Visual parity is 100% preserved.
 */
export function StudentProfileSectionContent({ showVariants = false }: { showVariants?: boolean }) {
    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
    const [isAsaasModalOpen, setIsAsaasModalOpen] = useState(false)

    return (
        <>
            <Grid mdCols={12} gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                {/* Left Column: Profile Card & Statuses (4 cols) */}
                <Box mdColSpan={4}>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <StudentProfileSummary 
                            name="MARCOS VINICIUS" 
                            email="marcos@reptrail.com.br" 
                        />
                        
                        <StudentSubscriptionStatus 
                            status="active" 
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
                    <StudentProfileForm />
                </Box>
            </Grid>

            {/* Confirmation Modals */}
            <Modal 
                isOpen={isTrialModalOpen} 
                onClose={() => setIsTrialModalOpen(false)}
                title="ATIVAR TESTE GRÁTIS"
                subtitle="Você terá acesso total por 7 dias."
                icon={Zap}
                variant="orange"
                confirmLabel="ATIVAR AGORA"
                confirmIcon={CheckCircle}
                onConfirm={() => setIsTrialModalOpen(false)}
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                        Ao ativar o período de teste, você terá acesso imediato a todas as ferramentas de Auto-Treino, Dieta e Ergogênicos do RepTrail.
                    </Font>
                    <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="bold">
                        * O teste é válido por 7 dias corridos e não requer cartão de crédito agora.
                    </Font>
                </Stack>
            </Modal>

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
                onConfirm={() => setIsCancelModalOpen(false)}
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                        Tem certeza que deseja cancelar sua assinatura do Auto-Treino? Você perderá o acesso aos seus protocolos e histórico ao final do ciclo atual.
                    </Font>
                    <Font variant="sub-tiny" color="red" weight="black" uppercase italic>
                        Esta ação não pode ser desfeita automaticamente.
                    </Font>
                </Stack>
            </Modal>

            <AsaasPaymentModal 
                isOpen={isAsaasModalOpen}
                onClose={() => setIsAsaasModalOpen(false)}
                tier="auto_training"
                monthlyTotal={10.90}
                currentName="MARCOS VINICIUS"
            />
        </>
    );
}
