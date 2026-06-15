'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import { useState, useEffect } from 'react'
import { Modal } from '@/components/store/advanced/modal'
import { Font } from '@/components/store/base/font'
import { Stack } from '@/components/store/base/stack'
import { Sparkles } from 'lucide-react'
import { useOptimisticMutation } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

interface StudentDashboardModalProps {
    userId: string
    showModal: boolean
    hasTrainer: boolean
}

export function StudentDashboardModals({ userId, showModal, hasTrainer }: StudentDashboardModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isImpersonating, setIsImpersonating] = useState(false)

    useEffect(() => {
        if (showModal && !hasTrainer) {
            setIsModalOpen(true)
        }

        // Check impersonation status
        const cookies = document.cookie.split('; ')
        const imp = cookies.find(c => c.startsWith('rt_impersonating='))?.split('=')[1]
        setIsImpersonating(imp === 'true')
    }, [showModal, hasTrainer])

    useEffect(() => {
        const handleOpen = () => setIsModalOpen(true)
        window.addEventListener('open-auto-training-onboarding', handleOpen)
        return () => window.removeEventListener('open-auto-training-onboarding', handleOpen)
    }, [])

    const { mutate: acceptMutate } = useOptimisticMutation({
        actionName: 'enable-auto-training-trial',
        entity: ENTITIES.USER,
        entityId: userId,
        queryKey: QUERY_KEYS.student.all(userId),
        mutationFn: async () => {
             const { enableAutoTrainingTrialForCurrentUser } = await import('@/lib/dal/remote')
             return await enableAutoTrainingTrialForCurrentUser()
        },
        onMutate: () => setIsModalOpen(false)
    })

    const { mutate: rejectMutate } = useOptimisticMutation({
        actionName: 'dismiss-auto-training',
        entity: ENTITIES.USER,
        entityId: userId,
        queryKey: QUERY_KEYS.student.all(userId),
        mutationFn: async () => {
             const { dismissAutoTrainingForSession } = await import('@/lib/dal/remote')
             return await dismissAutoTrainingForSession(userId)
        },
        onMutate: () => setIsModalOpen(false)
    })

    const handleAccept = async () => acceptMutate(undefined)
    const handleReject = async () => rejectMutate(undefined)
    const handleClose = () => setIsModalOpen(false)

    return (
        <Modal
            isOpen={isModalOpen && !isImpersonating}
            onClose={handleReject}
            title="Experimente o Auto Treino"
            subtitle="InteligÃªncia Artificial para sua Performance"
            icon={Sparkles}
            confirmLabel="Iniciar Teste GrÃ¡tis"
            cancelLabel="Agora NÃ£o"
            onConfirm={handleAccept}
            variant="orange"
            confirmVariant="primary"
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font
                        variant="body"
                        weight="bold"
                        {...{
                            color: "white",
                        }}>
                        Monte seu treino, cardio e dieta de forma inteligente!
                    </Font>
                    <Font
                        variant="description"
                        {...{
                            color: "zinc-400",
                        }}>
                        O Auto Treino utiliza nossa IA avanÃ§ada para construir protocolos personalizados sob medida para o seu corpo e rotina.
                    </Font>
                </Stack>
                <Stack gap={STORE_TOKENS.SPACING.NONE}>
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        tracking="widest"
                        {...{
                            color: "primary",
                        }}>
                        âœ“ IMPORTAÃ‡ÃƒO IA DE PDFS (TREINO/DIETA)
                    </Font>
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        tracking="widest"
                        {...{
                            color: "primary",
                        }}>
                        âœ“ PLAYER DE TREINO PROFISSIONAL
                    </Font>
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        tracking="widest"
                        {...{
                            color: "primary",
                        }}>
                        âœ“ GESTÃƒO DE CARDIO E ERGOGÃŠNICOS
                    </Font>
                </Stack>
            </Stack>
        </Modal>
    );
}

